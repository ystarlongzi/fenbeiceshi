#!/usr/bin/env bash
# 拼接进 setup-server.sh，由其在校验参数与凭据后调用；不单独作为本机命令执行。
prepare_environment() (
    set -euo pipefail
    if [[ $(uname -s) != Linux ]] || ! command -v systemctl >/dev/null; then
        fail "自动准备需要使用 systemd 的 Linux"
    fi
    # 已有配置出错时先停止，避免安装软件后才发现服务器需要修复。
    if command -v nginx >/dev/null; then nginx -t; fi
    packages=()
    # GNU tar 通过外部 gzip 解压，不能只检查 tar 是否存在。
    for item in nginx:nginx curl:curl openssl:openssl crontab:cron flock:util-linux stat:coreutils find:findutils tar:tar gzip:gzip; do
        if ! command -v "${item%%:*}" >/dev/null; then packages+=("${item#*:}"); fi
    done
    if (( ${#packages[@]} > 0 )); then
        command -v apt-get >/dev/null || fail "服务器缺少部署工具（${packages[*]}）；自动安装仅支持使用 apt-get 的 Ubuntu/Debian"
        export DEBIAN_FRONTEND=noninteractive
        apt-get update
        apt-get install -y "${packages[@]}"
    else echo "部署工具已齐全，跳过安装"; fi
    mkdir -p "$nginx_conf_path"
    nginx -t
    dump=$(nginx -T)
    # 不改写主配置；指定目录必须已由 Nginx 主配置加载。
    awk -v path="$nginx_conf_path/*.conf;" '$1 == "include" && $2 == path { found=1 } END { exit !found }' <<< "$dump" || fail "Nginx 主配置没有 include $nginx_conf_path/*.conf；请将 NGINX_CONF_PATH 指向已加载的站点目录"
    verify_cloudflare_zone
    # Debian 使用 cron，CentOS 等已有环境使用 crond；按已安装的服务选择。
    if systemctl cat cron.service >/dev/null 2>&1; then cron_service=cron
    elif systemctl cat crond.service >/dev/null 2>&1; then cron_service=crond
    else fail "服务器没有可用的 cron 或 crond 服务"; fi
    systemctl enable nginx "$cron_service"
    if ! systemctl is-active --quiet nginx; then
        # 手动启动的 Nginx 不在 systemd 状态中，不能再次启动并占用已有端口。
        if nginx_is_running "$dump"; then echo "Nginx 已在运行，复用现有主进程"
        else systemctl start nginx; fi
    fi
    if ! systemctl is-active --quiet "$cron_service"; then systemctl start "$cron_service"; fi
    if [[ -x "$acme_home/acme.sh" ]]; then
        echo "acme.sh 已安装，跳过下载"
    else
        # 固定官方版本，下载失败不执行残缺文件；不启用自动升级或重复创建 cron。
        work=$(mktemp -d)
        trap 'rm -rf "$work"' EXIT
        curl --proto '=https' --tlsv1.2 --fail --location --silent --show-error --retry 2 --max-time 120 \
            https://github.com/acmesh-official/acme.sh/archive/refs/tags/3.1.6.tar.gz -o "$work/acme.tar.gz"
        mkdir "$work/source"
        tar -xzf "$work/acme.tar.gz" -C "$work/source" --strip-components=1
        cd "$work/source"
        sh ./acme.sh --install --home "$acme_home" --accountemail "$email" --nocron --noprofile
        [[ -x "$acme_home/acme.sh" ]] || fail "acme.sh 安装没有生成可执行文件"
    fi
)

nginx_is_running() {
    local pid_file pid
    pid_file=$(awk '$1 == "pid" { sub(/;$/, "", $2); print $2; exit }' <<< "$1")
    if [[ -z "$pid_file" ]]; then
        # 主配置省略 pid 时，使用当前 Nginx 编译时指定的默认路径。
        pid_file=$(nginx -V 2>&1 | awk '{ for (i=1; i<=NF; i++) if ($i ~ /^--pid-path=/) { sub(/^--pid-path=/, "", $i); print $i; exit } }')
    fi
    [[ "$pid_file" == /* ]] || fail "无法确认 Nginx PID 文件路径，未启动新进程"
    [[ -f "$pid_file" && -s "$pid_file" ]] || return 1
    read -r pid < "$pid_file" || fail "无法读取 Nginx PID 文件"
    [[ "$pid" =~ ^[1-9][0-9]*$ ]] || fail "Nginx PID 文件格式无效，未启动新进程"
    [[ -d "/proc/$pid" ]] || return 1
    [[ $(< "/proc/$pid/comm") == nginx ]] || fail "Nginx PID 指向其他进程，未启动新进程"
    kill -0 "$pid"
}

verify_cloudflare_zone() (
    set -euo pipefail
    response_file=$(mktemp)
    trap 'rm -f "$response_file"' EXIT
    # 从标准输入读取认证头，避免 Token 出现在进程参数和日志中。
    http_status=$(printf 'header = "Authorization: Bearer %s"\n' "$CF_Token" | \
        curl --config - --proto '=https' --tlsv1.2 --silent --show-error \
        --connect-timeout 10 --max-time 30 -o "$response_file" --write-out '%{http_code}' \
        --url "https://api.cloudflare.com/client/v4/zones/$CF_Zone_ID") || fail "无法连接 Cloudflare，未开始证书申请"
    response=$(< "$response_file")
    if [[ "$http_status" != 200 || ! "$response" =~ \"success\"[[:space:]]*:[[:space:]]*true ]]; then
        error_code=unknown
        if [[ "$response" =~ \"code\"[[:space:]]*:[[:space:]]*([0-9]+) ]]; then error_code=${BASH_REMATCH[1]}; fi
        fail "Cloudflare 区域校验失败（HTTP ${http_status}，错误码 ${error_code}）；请核对 CF_TOKEN 的有效性和域名权限、CF_ZONE_ID"
    fi
    zone_name=""
    if [[ "$response" =~ \"name\"[[:space:]]*:[[:space:]]*\"([^\"]+)\" ]]; then zone_name=${BASH_REMATCH[1]}; fi
    [[ "$zone_name" == "$domain" ]] || fail "CF_ZONE_ID 对应的区域不是 ${domain}，未开始证书申请"
    echo "Cloudflare Token 与域名区域校验通过"
)
