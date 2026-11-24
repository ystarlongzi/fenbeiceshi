# IndexNow 自动通知

更新：2026-11-24。适用于本站两个域名的静态发布。实现入口为 `deploy/indexnow.mjs`，正文指纹、HTTP 协议和服务器状态分别在 `deploy/indexnow/` 维护；不依赖第三方 SDK，不向浏览器添加通知脚本。实际启用与接收结果见 [复查与接入验证](../验证/Bing收录复查与IndexNow接入验证.md)。

## 工作流与变化识别

1. 双站构建清理语言目录后，从各自 sitemap 读取规范 URL，生成 `_indexnow-manifest.json`。清单包含域名、版本及公开 URL 的正文指纹，不包含通知密钥。导出检查重新计算并比较清单；记录页等 noindex 页面不进入初始清单。
2. 完整检查和必要的 Linux 演练完成后，准备 SSH、站点环境及两个独立的 IndexNow 所有权文件，再打包发布。密钥由加密随机数生成，每个站点保存在自己的 `shared/indexnow/key`；复用同一密钥，不随构建轮换。
3. 英文和中文都通过源站／公网健康检查后，校验公开版本、站点归属、清单及所有权文件，才向固定的 `https://api.indexnow.org/indexnow` 发送 POST。两个站点分别提交，不把跨域 URL 放进同一批次。
4. 正文、搜索标题、描述、索引策略、语言关系及正文链接参与指纹。构建资源哈希、RSC 和公共页头不参与，避免每次构建都把全站当成新内容。首次接入只建立基线；后续提交相对最近已接收状态的新增、修改或删除 URL。
5. 200 记为已接收，202 记为已接收、密钥验证待完成，均不记为已收录。网络异常、429 和 5xx 最多尝试三次，等待时间有上限；其他错误明确失败。所有批次确认接收后，才通过服务器锁、当前版本和原状态校验值原子推进本站状态。

所有权验证使用协议要求的根目录文本文件，属于公开验证材料，随发布包进入当前版本。SSH 私钥、DNS Token 等私密凭据不进入网页。稳定通知密钥及接收状态仅保存于服务器的独立目录和忽略的本机准备文件；本机准备文件为 600，服务器状态目录为 700。日志和步骤摘要只记录域名、URL 数、响应码和重试次数，不打印密钥。

## 本机发布与预演

使用原部署连接配置，不需要新增 GitHub Secrets。两个站点目录为默认路径时可一次操作；自定义目录用 `--domain` 与 `--path` 分站执行。以下版本号必须替换为此次实际版本，先完成 `npm run check` 和站点环境准备。

```sh
node deploy/indexnow.mjs prepare --release <本次版本>
# 按服务器部署手册打包并发布两站，通过全部健康检查后执行。
node deploy/indexnow.mjs notify --release <本次版本>
```

`prepare --dry-run` 不连接服务器、不生成密钥、不改产物。`notify --dry-run` 读取已准备状态并显示计划，不访问公网或服务器、不发送通知，也不推进接收状态。实际模式会核对当前发布版本，不能拿其他提交的产物直接补提。

```sh
node deploy/indexnow.mjs prepare --release <本次版本> --dry-run
node deploy/indexnow.mjs notify --release <本次版本> --dry-run
```

## 已发布版本的定向补提

当接口暂时失败，或需对近期真实更新的少量页面补交通知时，可从已发布版本刷新准备状态。`--published` 读取公网清单并核对版本及所有权文件，不要求重建网页；该模式不修改导出产物。

```sh
node deploy/indexnow.mjs prepare --published --release <当前生产版本>
node deploy/indexnow.mjs notify --domain fenbeiceshi.com --release <当前生产版本> --url-file <URL数组JSON路径> --dry-run
node deploy/indexnow.mjs notify --domain fenbeiceshi.com --release <当前生产版本> --url-file <URL数组JSON路径>
```

URL 文件必须是同一站点当前可索引页面的 JSON 数组，不带参数或锚点，例如 `["https://fenbeiceshi.com/knowledge/db-vs-dba/"]`。英文站另用 `--domain soundmetergo.com`。首次基线建立后才允许手动补提；它只推进指定 URL 的指纹，保留其余尚未通知的变化。常规自动流程会从旧状态识别已删除或转为 noindex 的 URL，手动补提不接受不存在的页面。

## 结果与故障处理

Actions 的通知步骤和步骤摘要显示各域结果；忽略目录 `artifacts/indexnow/` 保存不含密钥的 receipt，服务器 `shared/indexnow/accepted.json` 保存最近确认的状态。通知步骤出错会让工作流明确失败，另一站仍会尝试；已通过健康检查的静态站点继续运行。应先区分发布失败与通知失败，再检查响应码、公开所有权文件、版本及服务器状态，按当前版本重试。

API 超时不代表服务端一定未接收；重试可能再次发送同一变化。状态写入或连接确认失败时也需核对实际服务器文件，不把未知结果记为成功。回滚工作流继续沿用原健康检查，不自动发送 IndexNow；回滚至接入前版本时没有所有权文件，不应强行补提。后续正常发布会恢复文件并比较最近确认的通知状态。

协议、批量限制及响应含义见 [IndexNow 官方文档](https://www.indexnow.org/documentation)；首次启用不应批量重提多年未变化页面，通知不保证抓取或收录，见 [Bing 接入说明](https://www.bing.com/indexnow/getstarted)。
