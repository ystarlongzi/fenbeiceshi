#!/usr/bin/env bash
set -euo pipefail

required=true
if [[ ${GITHUB_EVENT_NAME:?缺少工作流事件} != workflow_dispatch ]]; then
    base=${DEPLOY_BASE_SHA:?缺少变更起点}
    head=${DEPLOY_HEAD_SHA:?缺少变更终点}
    [[ "$base" =~ ^[0-9a-f]{40}$ && "$head" =~ ^[0-9a-f]{40}$ ]] || { echo "变更范围不是有效提交 SHA" >&2; exit 1; }
    # 首次推送没有可比较的旧提交，保守执行；普通推送覆盖整个提交范围。
    if [[ "$base" != 0000000000000000000000000000000000000000 ]]; then
        status=0
        git diff --quiet --no-renames "$base" "$head" -- \
            deploy/ .github/workflows/ scripts/ package.json package-lock.json next.config.ts \
            eslint.config.mjs prettier.config.mjs .prettierignore tsconfig.json .gitignore .npmrc || status=$?
        case "$status" in
            0) required=false ;;
            1) required=true ;;
            *) echo "无法比较部署相关变更，停止检查" >&2; exit "$status" ;;
        esac
    fi
fi

printf 'required=%s\n' "$required" >> "${GITHUB_OUTPUT:?缺少工作流输出文件}"
if [[ "$required" == true ]]; then
    echo "部署相关文件发生变更、首次推送或手动运行：执行 Linux 集成测试"
else
    echo "本次没有部署相关变更，跳过 Linux 集成测试；常规检查和服务器健康检查照常执行"
fi
