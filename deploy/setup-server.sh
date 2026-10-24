#!/usr/bin/env bash
# 由 setup-server.mjs 通过 SSH 执行；自动准备模式先读取两行凭据，再读取本站模板。
set -euo pipefail
umask 077

base=${1:?缺少部署目录}
domain=${2:?缺少域名}
nginx_conf_path=${3:?缺少 Nginx 配置目录}
cert_root=${4:?缺少证书目录}
dns_env=${5:?缺少 DNS 凭据文件路径}
email=${6:-}
acme_home=${7:?缺少 acme.sh 目录}
mode=${8:-server}

fail() { echo "初始化失败：$*" >&2; exit 1; }
[[ $(id -u) == 0 ]] || fail "初始化需要服务器 root 权限"
[[ "$domain" == fenbeiceshi.com && "$base" =~ ^/([A-Za-z0-9_-]+/){2,}fenbeiceshi$ ]] || fail "项目路径或域名无效"
[[ "$mode" == server || "$mode" == bootstrap ]] || fail "初始化模式无效"
for directory in "$nginx_conf_path" "$cert_root" "$acme_home" "$dns_env"; do
    [[ "$directory" =~ ^/([A-Za-z0-9_.-]+/)+[A-Za-z0-9_.-]+$ && "/$directory/" != *'/../'* && "/$directory/" != *'/./'* ]] || fail "服务器目录格式无效"
done
for private_path in "$cert_root" "$acme_home" "$dns_env"; do
    [[ "$private_path" != "$base" && "$private_path" != "$base/"* ]] || fail "证书和凭据必须存放在网站目录外"
done
# root 写入的路径不能经过软链接，避免凭据或配置落到其他位置。
for target in "$base" "$nginx_conf_path" "$cert_root" "$acme_home" "$dns_env"; do
    while [[ "$target" != / ]]; do
        [[ ! -L "$target" ]] || fail "服务器路径不能经过软链接"
        target=$(dirname "$target")
    done
done
CF_Token=""
CF_Zone_ID=""
read_credentials() {
    local line key value count=0
    while IFS= read -r line || [[ -n "$line" ]]; do
        [[ -n "$line" && ! "$line" =~ ^[[:space:]]*# ]] || continue
        key=${line%%=*}
        value=${line#*=}
        case "$key" in
            CF_Token) [[ -z "$CF_Token" && "$value" =~ ^[A-Za-z0-9_-]{20,255}$ ]] || fail "Cloudflare Token 格式无效或重复" ;;
            CF_Zone_ID) [[ -z "$CF_Zone_ID" && "$value" =~ ^[a-f0-9]{32}$ ]] || fail "Cloudflare Zone ID 格式无效或重复" ;;
            *) fail "DNS 凭据文件包含不支持的字段" ;;
        esac
        export "$key=$value"
        count=$((count + 1))
        if [[ "$mode" == bootstrap && "$count" == 2 ]]; then break; fi
    done
    [[ -n "$CF_Token" && -n "$CF_Zone_ID" ]] || fail "DNS 凭据文件缺少 CF_Token 或 CF_Zone_ID"
}
if [[ "$mode" == bootstrap ]]; then
    [[ -n "$email" && "$email" =~ ^[A-Za-z0-9_.+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$ ]] || fail "自动准备需要有效的联系邮箱"
    read_credentials
    # 软件安装器不能读取 SSH 输入，否则会吃掉后续的 Nginx 模板。
    prepare_environment < /dev/null
fi
[[ -d "$nginx_conf_path" && ! -L "$nginx_conf_path" ]] || fail "Nginx 配置目录不存在或是软链接"
[[ -x "$acme_home/acme.sh" ]] || fail "服务器尚未安装 acme.sh"
for command in nginx openssl flock crontab base64; do command -v "$command" >/dev/null || fail "服务器缺少命令：$command"; done
nginx -t
if [[ "$mode" == server || -e "$dns_env" ]]; then
    [[ -f "$dns_env" && $(stat -c %u "$dns_env") == 0 ]] || fail "DNS 凭据必须是 root 所有的普通文件"
    [[ $(stat -c %a "$dns_env") == 600 || $(stat -c %a "$dns_env") == 400 ]] || fail "DNS 凭据文件权限必须为 600 或 400"
fi
if [[ "$mode" == server ]]; then read_credentials < "$dns_env"; fi

[[ ! -L "$base" && ! -L "$base/shared" && ! -L "$base/releases" ]] || fail "部署目录不能是软链接"
mkdir -p "$base/shared" "$base/releases"
chmod 755 "$base" "$base/shared" "$base/releases"
# 与发布、回滚共用锁，避免换证书或配置时恰好切换网站版本。
[[ ! -L "$base/.deploy.lock" ]] || fail "部署锁不能是软链接"
exec 9>"$base/.deploy.lock"
flock -w 60 9 || fail "另一项发布仍在运行"
cert_dir="$cert_root/$domain"
[[ ! -L "$cert_root" && ! -L "$cert_dir" ]] || fail "证书目录不能是软链接"
mkdir -p "$cert_dir"
chmod 700 "$cert_dir"
config="$nginx_conf_path/fenbeiceshi.conf"
[[ ! -L "$config" ]] || fail "站点配置不能是软链接"
stage=""
backup=""
cert_backup=$(mktemp -d "$base/shared/.ssl-backup-XXXXXX")
installed=0
cert_installed=0
dns_installed=0
confirmed=0
dns_stage=""
acme_conf="$acme_home/${domain}_ecc/$domain.conf"
[[ ! -L "$acme_conf" && ! -L "$acme_home/${domain}_ecc" && ! -L "$acme_home/account.conf" ]] || fail "acme.sh 配置不能是软链接"
if [[ -f "$acme_conf" ]]; then cp -p "$acme_conf" "$cert_backup/domain.conf"; fi
if [[ -f "$dns_env" ]]; then cp -p "$dns_env" "$cert_backup/cloudflare.env"; fi
# 证书、配置都确认可用前发生错误时恢复原文件，避免留下半完成的初始化。
on_exit() {
    local code=$? restore_failed=0 retry_conf=""
    trap - EXIT
    set +e
    if (( code != 0 && confirmed == 0 )); then
        if (( dns_installed == 1 )); then
            if [[ -f "$cert_backup/cloudflare.env" ]]; then cp -p "$cert_backup/cloudflare.env" "$dns_env" || { echo "恢复 DNS 凭据失败" >&2; restore_failed=1; }
            else rm -f "$dns_env" || { echo "移除失败 DNS 凭据失败" >&2; restore_failed=1; }; fi
        fi
        if [[ -f "$cert_backup/domain.conf" ]]; then
            cp -p "$cert_backup/domain.conf" "$acme_conf" || { echo "恢复域名续期配置失败" >&2; restore_failed=1; }
        elif [[ -f "$acme_conf" ]]; then
            # acme.sh 依赖申请记录复用已生成的私钥；只移除新记录中的 DNS 凭据。
            retry_conf=$(mktemp "${acme_conf%/*}/.retry-XXXXXX")
            if [[ -n "$retry_conf" ]] && awk '!/^(CF_|SAVED_CF_)/' "$acme_conf" > "$retry_conf" \
                && chmod 600 "$retry_conf" && mv -f "$retry_conf" "$acme_conf"; then
                echo "已保留不含 DNS 凭据的 ACME 申请记录，可重新运行初始化" >&2
            else echo "保存 ACME 重试记录失败" >&2; restore_failed=1; fi
            if [[ -n "$retry_conf" ]] && ! rm -f "$retry_conf"; then echo "清理 ACME 暂存记录失败" >&2; restore_failed=1; fi
        fi
        if (( installed == 1 )); then
            if [[ -n "$backup" ]]; then
                mv -f "$backup" "$config" || { echo "恢复原 Nginx 配置失败" >&2; restore_failed=1; }
            else rm -f "$config" || { echo "移除失败配置失败" >&2; restore_failed=1; }; fi
        fi
        if (( cert_installed == 1 )); then
            for name in fullchain.cer "$domain.key"; do
                if [[ -f "$cert_backup/$name" ]]; then
                    cp -p "$cert_backup/$name" "$cert_dir/$name" || { echo "恢复原证书文件失败" >&2; restore_failed=1; }
                else rm -f "$cert_dir/$name" || { echo "移除失败证书文件失败" >&2; restore_failed=1; }; fi
            done
        fi
        if (( installed == 1 || cert_installed == 1 )); then
            if nginx -t && nginx -s reload; then echo "已恢复原 Nginx 配置和证书" >&2
            else echo "恢复后的验证失败，需要检查服务" >&2; restore_failed=1; fi
        fi
    fi
    if [[ -n "$stage" ]] && ! rm -f "$stage"; then echo "清理 Nginx 暂存文件失败" >&2; code=1; fi
    if [[ -n "$dns_stage" ]] && ! rm -f "$dns_stage"; then echo "清理 DNS 暂存文件失败" >&2; code=1; fi
    # 恢复失败时保留受限备份，便于人工修复，不能把最后一份恢复文件一起清理。
    if (( restore_failed == 1 )); then
        echo "恢复文件已保留在 $cert_backup${backup:+ 和 $backup}" >&2
    else
        if [[ -n "$backup" ]] && ! rm -f "$backup"; then echo "清理 Nginx 备份文件失败" >&2; code=1; fi
        if ! rm -rf "$cert_backup"; then echo "清理证书暂存目录失败" >&2; code=1; fi
    fi
    exit "$code"
}
trap on_exit EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
if [[ "$mode" == bootstrap ]]; then
    mkdir -p "$(dirname "$dns_env")"
    dns_stage=$(mktemp "$(dirname "$dns_env")/.cloudflare-XXXXXX")
    printf 'CF_Token=%s\nCF_Zone_ID=%s\n' "$CF_Token" "$CF_Zone_ID" > "$dns_stage"
    chmod 600 "$dns_stage"
    if [[ ! -f "$dns_env" ]] || ! cmp -s "$dns_stage" "$dns_env"; then
        dns_installed=1
        mv -f "$dns_stage" "$dns_env"
    fi
    rm -f "$dns_stage"
    dns_stage=""
fi
for name in fullchain.cer "$domain.key"; do
    [[ ! -L "$cert_dir/$name" ]] || fail "证书文件不能是软链接"
    if [[ -f "$cert_dir/$name" ]]; then cp -p "$cert_dir/$name" "$cert_backup/$name"; fi
done
# acme.sh 会读取域名配置；申请前先更新，以免轮换后的 Token 被旧值覆盖。
save_dns_credentials() {
    [[ -f "$acme_conf" ]] || fail "acme.sh 没有生成域名续期配置"
    dns_stage=$(mktemp "$acme_home/${domain}_ecc/.credentials-XXXXXX")
    awk '!/^(CF_Token|CF_Zone_ID)=/' "$acme_conf" > "$dns_stage"
    printf "CF_Token='%s'\nCF_Zone_ID='%s'\n" "$CF_Token" "$CF_Zone_ID" >> "$dns_stage"
    chmod 600 "$dns_stage"
    if ! cmp -s "$dns_stage" "$acme_conf"; then mv -f "$dns_stage" "$acme_conf"; fi
    rm -f "$dns_stage"
    dns_stage=""
}
if [[ -f "$acme_conf" ]]; then save_dns_credentials; fi
acme=("$acme_home/acme.sh" --home "$acme_home" --server letsencrypt)
reload_cmd="nginx -t && nginx -s reload"
reload_saved="__ACME_BASE64__START_$(printf '%s' "$reload_cmd" | base64 | tr -d '\n')__ACME_BASE64__END_"
if [[ -n "$email" ]] && ! grep -Fxq "ACCOUNT_EMAIL='$email'" "$acme_home/account.conf" 2>/dev/null; then
    "${acme[@]}" --register-account --accountemail "$email"
fi
issue_code=0
# --issue 也可能按已有记录安装证书，出错时仍需恢复旧证书。
cert_installed=1
"${acme[@]}" --issue --dns dns_cf -d "$domain" -d "*.$domain" --keylength ec-256 || issue_code=$?
# acme.sh 用退出码 2 表示未到续期时间；不传 --force，不重复向 CA 申请。
[[ "$issue_code" == 0 || "$issue_code" == 2 ]] || fail "DNS-01 申请失败，退出码 $issue_code"
# 必须登记安装路径与 reload 命令，续期后 Nginx 才会使用新证书。
if [[ "$issue_code" == 2 && -f "$acme_conf" ]] \
    && grep -Fxq "Le_RealFullChainPath='$cert_dir/fullchain.cer'" "$acme_conf" \
    && grep -Fxq "Le_RealKeyPath='$cert_dir/$domain.key'" "$acme_conf" \
    && grep -Fxq "Le_ReloadCmd='$reload_saved'" "$acme_conf" \
    && cmp -s "$cert_dir/fullchain.cer" "$acme_home/${domain}_ecc/fullchain.cer" \
    && cmp -s "$cert_dir/$domain.key" "$acme_home/${domain}_ecc/$domain.key"; then
    cert_installed=0
    echo "证书和安装设置未变化，复用已有证书"
else
    cert_installed=1
    "${acme[@]}" --install-cert --ecc -d "$domain" \
        --fullchain-file "$cert_dir/fullchain.cer" --key-file "$cert_dir/$domain.key" \
        --reloadcmd "$reload_cmd"
fi
chmod 644 "$cert_dir/fullchain.cer"
chmod 600 "$cert_dir/$domain.key"
openssl x509 -in "$cert_dir/fullchain.cer" -noout -checkend 0
names=$(openssl x509 -in "$cert_dir/fullchain.cer" -noout -ext subjectAltName)
# 按 SAN 完整条目校验，避免把带额外后缀的域名当作本站通配符。
[[ "$names" =~ (^|[[:space:],])DNS:fenbeiceshi\.com([[:space:],]|$) ]] || fail "证书没有包含主域名"
[[ "$names" =~ (^|[[:space:],])DNS:\*\.fenbeiceshi\.com([[:space:],]|$) ]] || fail "证书没有包含通配符域名"
openssl x509 -in "$cert_dir/fullchain.cer" -noout -checkhost "$domain"
# 同时校验证书与私钥，避免配置检查通过却不能完成 TLS 握手。
cert_public=$(openssl x509 -in "$cert_dir/fullchain.cer" -pubkey -noout)
key_public=$(openssl pkey -in "$cert_dir/$domain.key" -pubout)
[[ "$cert_public" == "$key_public" ]] || fail "证书与私钥不匹配"
if [[ -f "$acme_home/account.conf" ]]; then chmod 600 "$acme_home/account.conf"; fi
if [[ -f "$acme_home/${domain}_ecc/$domain.conf" ]]; then chmod 600 "$acme_home/${domain}_ecc/$domain.conf"; fi

# 在目标配置目录暂存模板，校验后替换；主配置仍由服务器维护者管理。
stage=$(mktemp "$nginx_conf_path/.fenbeiceshi-XXXXXX")
cat > "$stage"
sed -i "s|__DOMAIN__|$domain|g; s|__DEPLOY_PATH__|$base|g; s|__CERT_ROOT__|$cert_root|g" "$stage"
if [[ ! -s "$stage" ]] || grep -q '__[A-Z_]*__' "$stage"; then fail "Nginx 模板无效"; fi
if [[ -f "$config" ]] && cmp -s "$stage" "$config"; then
    echo "本站 Nginx 配置未变化，跳过替换"
else
    if [[ -f "$config" ]]; then
        backup=$(mktemp "$base/shared/.nginx-backup-XXXXXX")
        cp -p "$config" "$backup"
    fi
    chmod 644 "$stage"
    installed=1
    mv -f "$stage" "$config"
fi
nginx -t
nginx_dump=$(nginx -T)
[[ "$nginx_dump" == *"# configuration file $config:"* ]] || fail "Nginx 主配置没有 include 此站点目录"
if (( installed == 1 || cert_installed == 1 )); then nginx -s reload; fi
# 首次签发后保存；--issue 跳过时也保留新凭据供 cron 续期。
save_dns_credentials
unset CF_Token CF_Zone_ID
# 只补缺失的本目录续期任务；读取失败时不能把已有 crontab 当作空文件覆盖。
cron_jobs=""
if ! cron_jobs=$(LC_ALL=C crontab -l 2> "$cert_backup/cron-error"); then
    grep -qi 'no crontab' "$cert_backup/cron-error" || fail "无法读取 root 定时任务，未修改续期设置"
fi
has_renewal_job() {
    tr -d '\042\047' <<< "$1" | awk -v home="$acme_home" 'index($0, home "/acme.sh --cron") && index($0, "--home " home) && $0 !~ /^[[:space:]]*#/ { found=1 } END { exit !found }'
}
if has_renewal_job "$cron_jobs"; then
    echo "自动续期任务已存在，跳过添加"
else
    "${acme[@]}" --installcronjob
    cron_jobs=$(crontab -l) || fail "无法确认自动续期任务"
    has_renewal_job "$cron_jobs" || fail "自动续期任务没有使用指定的 ACME_HOME"
fi
confirmed=1
echo "已安装 fenbeiceshi.com 与 *.fenbeiceshi.com 证书及自动续期；站点配置：$config"
