#!/usr/bin/env bash
# 仅保存本站通知密钥和成功接收的指纹，不改动 current 或其他站点。
set -euo pipefail
umask 077
base=${1:?缺少部署目录}
domain=${2:?缺少域名}
action=${3:?缺少操作}
release=${4:?缺少版本}
expected=${5:--}
fail() { echo "IndexNow 状态操作失败：$*" >&2; exit 1; }
[[ "$domain" == fenbeiceshi.com || "$domain" == soundmetergo.com ]] || fail "域名不属于此项目"
[[ "$base" =~ ^/([A-Za-z0-9_-]+/){2,}${domain%.com}$ ]] || fail "部署目录无效"
[[ "$release" =~ ^[A-Za-z0-9][A-Za-z0-9_-]{0,119}$ ]] || fail "版本号无效"
[[ "$action" == prepare || "$action" == save ]] || fail "操作无效"
[[ "$expected" == - || "$expected" =~ ^[a-f0-9]{64}$ ]] || fail "状态校验值无效"
[[ $(uname -s) == Linux ]] || fail "需要 Linux"
for tool in flock sha256sum realpath; do command -v "$tool" >/dev/null || fail "缺少 $tool"; done
for name in "$base" "$base/shared" "$base/shared/indexnow" "$base/.deploy.lock"; do
    [[ ! -L "$name" ]] || fail "状态路径不能是软链接"
done
umask 022
mkdir -p "$base/shared"
umask 077
mkdir -p "$base/shared/indexnow"
chmod 700 "$base/shared/indexnow"
exec 9>"$base/.deploy.lock"
flock -w 60 9 || fail "另一项发布仍在运行"
state="$base/shared/indexnow"
key_file="$state/key"
accepted="$state/accepted.json"
for file in "$key_file" "$accepted"; do
    [[ ! -L "$file" && ( ! -e "$file" || -f "$file" ) ]] || fail "状态必须是普通文件"
done
active=-
if [[ -L "$base/current" ]]; then
    target=$(realpath "$base/current")
    [[ $(dirname "$target") == "$base/releases" && -f "$target/_site.txt" ]] || fail "current 不属于本站"
    [[ $(cat "$target/_site.txt") == "$domain" ]] || fail "current 域名不匹配"
    active=$(cat "$target/_release.txt")
    [[ $(basename "$target") == "$active" ]] || fail "current 版本不匹配"
elif [[ -e "$base/current" ]]; then fail "current 必须是软链接"; fi
IFS= read -r candidate || fail "缺少通知密钥"
[[ "$candidate" =~ ^[a-f0-9]{32}$ ]] || fail "通知密钥格式无效"
temp=""
trap 'if [[ -n "$temp" ]]; then rm -f -- "$temp"; fi' EXIT
if [[ "$action" == prepare && ! -e "$key_file" ]]; then
    temp=$(mktemp "$state/key-XXXXXX")
    printf '%s\n' "$candidate" > "$temp"
    mv -- "$temp" "$key_file"
    temp=""
fi
[[ -f "$key_file" ]] || fail "通知密钥尚未准备"
key=$(cat "$key_file")
[[ "$key" =~ ^[a-f0-9]{32}$ ]] || fail "已保存的通知密钥无效"
digest=-
if [[ -f "$accepted" ]]; then
    [[ $(stat -c %s "$accepted") -le 1048576 ]] || fail "状态过大"
    digest=$(sha256sum "$accepted"); digest=${digest%% *}
fi
if [[ "$action" == prepare ]]; then
    printf '%s\n%s\n%s\n' "$key" "$digest" "$active"
    if [[ -f "$accepted" ]]; then cat "$accepted"; else printf 'null\n'; fi
else
    [[ "$key" == "$candidate" && "$active" == "$release" && "$digest" == "$expected" ]] || fail "当前版本或通知状态已变化"
    temp=$(mktemp "$state/accepted-XXXXXX")
    head -c 1048577 > "$temp"
    [[ -s "$temp" && $(stat -c %s "$temp") -le 1048576 ]] || fail "状态大小无效"
    mv -- "$temp" "$accepted"
    temp=""
fi
