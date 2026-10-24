#!/usr/bin/env bash
# 由 deploy-static.mjs 通过 SSH 在服务器执行；发布时标准输入是 tar.gz，回滚不上传文件。
set -euo pipefail
umask 022

base=${1:?缺少部署目录}
release_id=${2:?缺少版本号}
digest=${3:?缺少构建校验值}
domain=${4:?缺少域名}
action=${5:?缺少操作类型}

fail() { echo "发布失败：$*" >&2; exit 1; }
[[ "$base" =~ ^/([A-Za-z0-9_-]+/){2,}fenbeiceshi$ ]] || fail "部署目录格式无效"
[[ "$release_id" =~ ^[A-Za-z0-9][A-Za-z0-9_-]{0,119}$ ]] || fail "版本号格式无效"
[[ "$domain" == fenbeiceshi.com ]] || fail "域名不属于此项目"
[[ "$action" == deploy || "$action" == rollback ]] || fail "操作类型无效"
[[ "$action" == rollback || "$digest" =~ ^[a-f0-9]{64}$ ]] || fail "SHA-256 格式无效"
[[ $(uname -s) == Linux ]] || fail "远端需要 Linux"
for command in curl tar sha256sum flock find sort realpath cmp; do
    command -v "$command" >/dev/null || fail "远端缺少命令：$command"
done

mkdir -p "$base"
[[ ! -L "$base" ]] || fail "部署目录不能是软链接"
for name in releases shared shared/_next shared/_next/static .incoming; do
    [[ ! -L "$base/$name" ]] || fail "$name 不能是软链接"
done
mkdir -p "$base/releases" "$base/shared/_next/static" "$base/.incoming"
[[ ! -L "$base/.deploy.lock" ]] || fail "锁文件不能是软链接"
exec 9>"$base/.deploy.lock"
flock -w 60 9 || fail "另一项发布仍在运行"

releases="$base/releases"
target="$releases/$release_id"
current="$base/current"
shared="$base/shared/_next/static"
previous=""
switched=0
created=0
committed=0
archive=""
listing=""
link="$base/.current-$$"

valid_target() {
    local candidate=$1 name
    [[ -d "$candidate" && ! -L "$candidate" && $(dirname "$candidate") == "$releases" ]] || return 1
    name=$(basename "$candidate")
    [[ "$name" =~ ^[A-Za-z0-9][A-Za-z0-9_-]{0,119}$ ]] || return 1
    [[ -f "$candidate/_release.txt" && $(cat "$candidate/_release.txt") == "$name" ]]
}

switch_to() {
    # 同一目录中的 rename 一次替换 current，避免请求读到尚未解包完的版本。
    ln -s "$1" "$link" || return 1
    mv -Tf "$link" "$current"
}

valid_asset() {
    local value=$1 decoded
    [[ "$value" == /_next/static/* && "$value" != *'?'* && "$value" != *'#'* && "$value" != *\\* ]] || return 1
    [[ "$value" =~ ^([^%]|%[[:xdigit:]]{2})+$ && "$value" != *%00* ]] || return 1
    # Next.js 的 [...slug] 文件名包含连续点；只拒绝解码后独立的 . 和 .. 路径段。
    printf -v decoded '%b' "${value//%/\\x}" || return 1
    [[ "$decoded" == /_next/static/* && "$decoded" != *[[:cntrl:]]* && "$decoded" != *\\* ]] || return 1
    [[ "$decoded" != *'?'* && "$decoded" != *'#'* && "/$decoded/" != *'/../'* && "/$decoded/" != *'/./'* ]]
}

probe() {
    # 同时检查本机源站与公网地址，防止源站正常而 DNS、代理或缓存仍指向旧版。
    local expected=$1 mode asset result route code
    local options=(--silent --show-error --globoff --connect-timeout 10 --max-time 20 --noproxy "$domain" --retry 2 --retry-delay 1)
    for mode in origin public; do
        local address=()
        [[ "$mode" == public ]] || address=(--resolve "$domain:443:127.0.0.1")
        result=$(curl "${options[@]}" "${address[@]}" --fail "https://$domain/_release.txt?v=$expected") || return 1
        [[ "$result" == "$expected" ]] || { echo "$mode 返回的版本号不匹配" >&2; return 1; }
        for route in / /en/ /zh-tw/ /guide/ /en/guide/ /zh-tw/guide/ /knowledge/decibel-chart/ /en/knowledge/decibel-chart/ /zh-tw/knowledge/decibel-chart/ /records/ /en/records/ /zh-tw/records/ /audio/pcm-recorder.js /vendor/lamejs/lamejs.js /robots.txt /sitemap.xml; do
            result=$(curl "${options[@]}" "${address[@]}" --dump-header - --output /dev/null --write-out '%{http_code}' "https://$domain$route") || return 1
            code=${result##*$'\n'}
            [[ "$code" == 200 ]] || { echo "$mode 页面检查失败：$route HTTP $code" >&2; return 1; }
            # 主文档可访问还不够，错误的权限策略会让所有真实测量失败。
            if [[ "$route" == */ ]]; then
                tr -d '\r' <<< "$result" | grep -Eiq '^Permissions-Policy:.*microphone=\(self\)' || { echo "$mode 麦克风权限策略无效：$route" >&2; return 1; }
                if tr -d '\r' <<< "$result" | grep -Eiq 'microphone=\(\)'; then
                    echo "$mode 麦克风被响应头禁用：$route" >&2; return 1
                fi
            fi
        done
        while IFS= read -r asset; do
            valid_asset "$asset" || { echo "$mode 资源路径无效" >&2; return 1; }
            result=$(curl "${options[@]}" "${address[@]}" --output /dev/null --write-out '%{http_code} %{content_type}' "https://$domain$asset") || return 1
            [[ "$result" == '200 '* ]] || { echo "$mode 资源检查失败：$result" >&2; return 1; }
            if [[ "$asset" == *.js ]]; then
                [[ "$result" == '200 application/javascript'* || "$result" == '200 text/javascript'* ]] || { echo "$mode JavaScript MIME 类型无效" >&2; return 1; }
            elif [[ "$asset" == *.css ]]; then
                [[ "$result" == '200 text/css'* ]] || { echo "$mode CSS MIME 类型无效" >&2; return 1; }
            fi
        done < "$current/_release-assets.txt"
        code=$(curl "${options[@]}" "${address[@]}" --output /dev/null --write-out '%{http_code}' "https://$domain/_missing-$expected/") || return 1
        [[ "$code" == 404 ]] || { echo "$mode 缺失路径未返回 404" >&2; return 1; }
    done
}

# 只有切版并通过健康检查才提交；此前的错误需要恢复发布前的 current。
on_exit() {
    local code=$? active=""
    trap - EXIT
    set +e
    if (( code != 0 && switched == 1 && committed == 0 )); then
        rm -f -- "$link" || echo "清理未完成的版本切换链接失败" >&2
        if [[ -n "$previous" ]]; then
            if switch_to "$previous"; then
                echo "已恢复旧版，正在验证恢复结果" >&2
                probe "$(basename "$previous")" || echo "旧版已恢复，但健康检查失败，需要检查 Nginx 或网络" >&2
            else echo "恢复旧版失败，需要立即检查 current" >&2; fi
        elif [[ -L "$current" && $(readlink "$current") == "$target" ]]; then
            rm -- "$current" || echo "首次发布失败后移除 current 失败" >&2
        fi
    fi
    [[ ! -L "$current" ]] || active=$(realpath "$current")
    if (( code != 0 && created == 1 )) && [[ "$active" != "$target" ]]; then
        rm -rf -- "$target" || echo "清理失败构建目录失败：$target" >&2
    fi
    for file in "$archive" "$listing" "$link"; do
        if [[ -n "$file" && ( -e "$file" || -L "$file" ) ]]; then
            if ! rm -f -- "$file"; then echo "清理发布临时文件失败" >&2; code=1; fi
        fi
    done
    exit "$code"
}
trap on_exit EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

if [[ -L "$current" ]]; then
    previous=$(realpath "$current")
    valid_target "$previous" || fail "current 未指向本项目完整版本"
elif [[ -e "$current" ]]; then fail "current 必须是软链接"; fi

if [[ "$action" == deploy ]]; then
    [[ ! -e "$target" && ! -L "$target" ]] || fail "版本已存在，请使用新版本号"
    archive=$(mktemp "$base/.incoming/archive-XXXXXX.tar.gz")
    listing=$(mktemp "$base/.incoming/list-XXXXXX")
    cat > "$archive"
    printf '%s  %s\n' "$digest" "$archive" | sha256sum --check --status || fail "上传文件 SHA-256 不匹配"
    tar -tzf "$archive" > "$listing"
    while IFS= read -r entry; do
        entry=${entry#./}
        [[ -n "$entry" && "$entry" != . ]] || continue
        [[ "$entry" != /* && "/$entry/" != *'/../'* && "/$entry/" != *'/./'* && "$entry" != *\\* ]] || fail "构建包含不安全路径"
        [[ ! "$entry" =~ (^|/)\. ]] || fail "构建包含隐藏文件"
    done < "$listing"
    # 在解包前拒绝链接和设备文件，防止 tar 经链接向版本目录外写入。
    tar -tvzf "$archive" | awk 'substr($1,1,1) !~ /[-d]/ { bad=1 } END { exit bad }' || fail "构建包含非普通文件"
    mkdir "$target"
    created=1
    tar -xzf "$archive" --no-same-owner --no-same-permissions -C "$target"
    valid_target "$target" || fail "构建版本标记无效"
    for file in index.html en/index.html zh-tw/index.html 404.html guide/index.html en/guide/index.html zh-tw/guide/index.html knowledge/decibel-chart/index.html en/knowledge/decibel-chart/index.html zh-tw/knowledge/decibel-chart/index.html records/index.html en/records/index.html zh-tw/records/index.html audio/pcm-recorder.js vendor/lamejs/lamejs.js vendor/lamejs/COPYING.LESSER.txt robots.txt sitemap.xml _release-assets.txt; do
        [[ -s "$target/$file" ]] || fail "构建缺少有效文件：$file"
    done
    find "$target" -type d -exec chmod 755 {} +
    find "$target" -type f -exec chmod 644 {} +
    [[ -z $(find "$shared" -type l -print -quit) ]] || fail "共享资源目录包含软链接"
    while IFS= read -r -d '' file; do
        relative=${file#"$target/_next/static/"}
        destination="$shared/$relative"
        mkdir -p "$(dirname "$destination")"
        if [[ -e "$destination" ]]; then
            if [[ ! -f "$destination" || -L "$destination" ]] || ! cmp --silent "$file" "$destination"; then
                fail "已有哈希资源内容冲突：$relative"
            fi
        else cp -- "$file" "$destination"; fi
        touch "$destination"
    done < <(find "$target/_next/static" -type f -print0)
else
    if ! valid_target "$target" || [[ ! -f "$target/.activated" ]]; then fail "回滚版本不存在或尚未成功发布"; fi
fi

switched=1
switch_to "$target"
probe "$release_id" || fail "新版本健康检查失败"
touch "$target/.activated"
committed=1

# 当前版本始终计入三份；只清理带成功发布标记的本项目版本。
kept=1
while IFS= read -r candidate; do
    [[ "$candidate" != "$release_id" ]] || continue
    directory="$releases/$candidate"
    if ! valid_target "$directory" || [[ ! -f "$directory/.activated" ]]; then continue; fi
    if (( kept < 3 )); then kept=$((kept + 1)); else rm -rf -- "$directory"; fi
done < <(find "$releases" -mindepth 1 -maxdepth 1 -type d -printf '%T@ %f\n' | sort -rn | cut -d' ' -f2-)

# 老页面可能仍请求旧哈希资源；给已淘汰版本的资源七天缓冲，并保留所有回滚版本的资源。
while IFS= read -r -d '' file; do
    relative=${file#"$shared/"}
    referenced=0
    for directory in "$releases"/*; do
        if [[ -f "$directory/_next/static/$relative" ]]; then referenced=1; break; fi
    done
    (( referenced == 1 )) || rm -- "$file"
done < <(find "$shared" -type f -mtime +7 -print0)
find "$shared" -mindepth 1 -depth -type d -empty -delete
echo "健康检查通过，已保留当前版本及最多两个回滚版本：$release_id"
