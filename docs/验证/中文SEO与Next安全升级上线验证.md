# 中文 SEO 与 Next.js 安全升级上线验证

日期：2026-11-23，时间为北京时间。结论：Go，双站已完成生产切版、独立验收及超过十分钟的稳定性观察，未发现发布异常。本次发布与独立核验由本任务执行，GitHub Actions 负责构建、Linux 演练与 SSH 发布。

## 发布范围与前置结论

- 功能提交：[`df4f709`](https://github.com/ystarlongzi/fenbeiceshi/commit/df4f709bc66455f5f2d3309cd86f1668c9f39bb8)，同时包含简体首页 SEO 文案、对应关键词规划与 Next.js／配套 ESLint 16.4.6 安全升级。未混入其他业务修改。
- 发布运行：[第 24 次生产工作流](https://github.com/ystarlongzi/fenbeiceshi/actions/runs/45111476277)，main 推送触发，production 环境，同一 runner 顺序构建与发布双站。
- 两站版本均为 `df4f709bc66455f5f2d3309cd86f1668c9f39bb8-24-1`。英文站于 12:25:04、中文站于 12:25:09 通过源站和公网健康检查；`release.json` 的 revision、domain 与版本标记一致。

| 检查项             | 状态       | 证据                                                                     | 负责人                 | 阻塞动作 |
| ------------------ | ---------- | ------------------------------------------------------------------------ | ---------------------- | -------- |
| 提交与范围         | 通过       | 10 个文件；直接清单只升级 Next.js 及配套 ESLint，沿用已验收中文文案      | 本任务                 | 无       |
| 安装、检查与构建   | 通过       | Actions 干净 `npm ci`、完整 `npm run check`、双站静态产物校验成功        | GitHub Actions         | 无       |
| 漏洞审计           | 通过       | 本地完整／生产审计均为 0；云端安装也报告 0 vulnerabilities               | 本任务／GitHub Actions | 无       |
| Linux 发布与回滚   | 通过       | 4 项独立集成测试全部通过、0 跳过，补齐本机部署测试的环境边界             | GitHub Actions         | 无       |
| 配置与生产权限     | 通过       | 已有 production 配置及 SSH 凭据完成双站发布，未新增权限、Secret 或配置项 | GitHub Actions         | 无       |
| 数据与兼容性       | 不适用迁移 | 静态内容和依赖补丁，不修改记录、音频存储或模型                           | 本任务                 | 无       |
| 源站及公网切版     | 通过       | 双站 current、公开版本与提交一致，健康检查成功                           | GitHub Actions／本任务 | 无       |
| 独立 HTTP 与浏览器 | 通过       | 56 次专项 HTTP 请求、中文桌面与手机、英文导航及搜索检查                  | 本任务                 | 无       |
| 十分钟观察         | 通过       | 21 轮、147 次公网探测；两站日志共 288 次请求、0 次 5xx、0 条新增错误     | 本任务                 | 无       |

## 实际检查与线上行为

- 本地发布前已有完整 `npm run check` 与干净安装记录；本轮提交前再次执行 `git diff --check`，暂存范围无其他改动。细节分别见 [Bing 中文首页 SEO 调整验证](./Bing中文首页SEO调整验证.md) 与 [Next.js 安全升级验证](./Next.js安全升级验证.md)。
- 云端 `npm run check` 全部通过：183 项应用测试；跨平台部署测试 31 项通过、4 项默认跳过，随后独立 Linux 演练 4 项全部通过。双站构建均使用 Next.js 16.4.6，无安全升级阻断或已知漏洞提醒。
- 云端内容与产物检查覆盖 27 种语言、1269 个页面、1242 个可索引 URL 和 27 个 noindex 记录页。生产构建保留现有统计环境变量；英文基础内部链接检查 4010 条，新增语言 96240 条，中文 3696 条。
- 本机针对生产地址执行 `node artifacts/release-20261123/check-production.mjs`，退出 0：56 次 GET／HEAD 请求核对双站版本及 manifest，简体、繁体和英文首页的 title、meta、Open Graph、WebApplication、自 canonical 与 28 项语言关系。简体首屏简介存在于静态 HTML，繁体和英文文案符合原规划。
- 同一专项检查还覆盖双站指南、分贝指南、记录页 noindex、robots 与 sitemap 数量、首页 JS／CSS 的状态和 MIME／immutable 缓存、HTML 及时重验证、版本标记 no-store、`microphone=(self)`、HTTP／www 301、中文旧英文路径迁移及真实 404；结果均正确。
- 实际浏览器覆盖中文 1280 × 720 桌面、375 × 812 手机和英文桌面。指针／数显切换正常；手机菜单可打开并由 Esc 关闭，焦点回到菜单按钮且背景滚动恢复；英文导航进入分贝指南后搜索 `40`，显示 2／31 条声音并展开匹配档。各检查视口无页面横向溢出，中文简介为 16px，手机开始按钮完整位于首屏，读取到的控制台错误为空。临时视口覆盖已清除。
- 机器证据位于本机忽略目录 `artifacts/release-20261123/`：`actions-evidence.json`、`http-checks.json`、`browser-checks.json`、`chinese-desktop.jpg`、`chinese-mobile.jpg`。不把本机证据目录上传到仓库或生产网页。

## 观察窗口与回滚

公网观察从 12:28:02 至 12:38:20，持续约 618 秒，共 21 轮、147 次请求，0 失败。每轮核对双站版本、三语首页与双站指南，所有响应均为 200，版本与麦克风策略正确。`node artifacts/release-20261123/observe-production.mjs` 退出 0，机器结果保存在 `observation.json`。

服务器日志覆盖 12:27:22 至 12:38:31，共 669 秒。中文站记录 173 次请求，国际站 115 次；两站均为 0 次 5xx、0 条新增错误日志。日志未发生 inode 变化或大小回退，两站 current 与保留版本正确。`capture-server.mjs` 及 `inspect-server-logs.mjs` 退出 0，结果为 `server-observation-start.json`、`server-observation-end.json` 和 `server-log-summary.json`。检查通过已有 SSH 密钥和严格主机公钥核验只读统计，不输出访问者地址或原始日志。

两个站点均保留当前与最多两个旧成功版本，已核对直接前版 `ca2717459af5bf8ede0b6c5fc6b8d2bfc4aa3d69-23-1` 及更早的 `e36c644e94c14dd6941017801726919434472d21-22-1`。需要恢复时，按 [服务器部署](../部署/服务器部署.md) 的回滚工作流分别选择站点及保留版本，并重新执行健康检查。本轮没有在生产执行实际回滚，也未改写或清空浏览器存储。

## 未覆盖范围

本轮没有请求真实麦克风、录音或报告下载，没有使用真实手机，也没有进行声学精度测试；既有测试与静态资源检查不能代替这些验收。没有提交站长平台或验证搜索引擎已采用新摘要；应以本次上线日期为起点，按既有 Bing 基线观察 2–4 周，再比较展示、排名和相近排名下的点击率。npm audit 为零仅描述本次已知公告审计结果。
