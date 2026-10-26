# Google Analytics 4

更新：2026-10-26。中文与国际站使用同一项 GA4 媒体资源、同一个 Web 数据流。麦克风、音频、测量读数、报告备注和测量设备标识不进入统计。实际生产状态见 [接入验证](../验证/Google统计接入验证.md)。

## 后台与构建配置

- 媒体资源：分贝测试 / SoundMeterGo，ID `560740587`；[打开管理](https://analytics.google.com/analytics/web/?authuser=1#/a401391058p560740587/admin)。
- 数据流：分贝测试 / SoundMeterGo · Web，ID `16203787160`，主网址 `https://soundmetergo.com`。
- 公开衡量 ID：`G-MPXCSZLCVY`。它是浏览器代码中的公开标识，无需 API 密钥或新的 GitHub Secret。
- Google 代码 → 配置您的网域：精确匹配 `fenbeiceshi.com` 和 `soundmetergo.com`。
- 增强型衡量关闭。配置使用 `send_page_view: false`，由本站对首屏、站内切页及前进后退统一发送 `page_view`，避免浏览器历史自动事件重复计数。
- Google 信号和广告个性化在代码中关闭，不启用广告事件或测量操作的自定义事件。GA4 的 `session_start`、`first_visit`、`user_engagement` 等基础事件仍由 Google 管理。

在 GitHub 仓库 Settings → Environments → production → Environment variables 中配置：

| Variable                        | 值             |
| ------------------------------- | -------------- |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-MPXCSZLCVY` |

`.github/workflows/deploy.yml` 在构建前注入该变量，同一值进入两个域名的静态包。更新变量后必须重新构建和部署，修改服务器环境不会改变已生成的 JavaScript。变量缺失或留空时不展示统计提示，也不加载 Google；格式错误会使构建失败。PR 检查不注入 production 变量。

本地默认关闭统计。如需验证提示，在项目根目录 `.env.local` 设置同名值，示例见根目录 `.env.example`。本地与预览域名即使设置真实 ID，也不会向正式 GA4 数据流发送事件；实际发送仅允许两个 HTTPS 正式域名，不允许子域、相似域名或自定义端口。

## 访客选择与采集边界

当前实现使用全站统一的基本意见征求模式。首次访问在页头下方提供允许、拒绝和隐私说明；提示参与普通排版，不遮挡测量操作。访客未允许或拒绝时不加载 Google 脚本，允许后才异步加载。页脚“统计设置”进入本语言隐私页，顶部保留设置，可更改或撤回选择。

统计偏好使用独立键 `fenbeiceshi:analytics-consent:v1`，不读写报告、录音、主题或语言存储。两个域名分别保存选择；写入失败时本页选择仍生效，并明确提示无法记住。其他标签页撤回或清空偏好时同步停止后续事件。撤回会启用 Google 停用开关并清理本域此数据流的 `_ga`、`_ga_MPXCSZLCVY` Cookie，已发送的数据不会自动删除。

Google 接收页面地址、标题、语言、来源及其基础浏览器／设备数据。代码过滤页面与本站来源的全部查询和锚点，外站来源只保留 origin；不发送用户输入、测量值或内部错误。隐私页静态正文已同步 27 种语言，说明 Google Cookie、可能的境外处理、撤回与跨域行为。

这里的全站提示是产品实现选择，不表示所有地区都有相同要求，也不代表完成各地法律审查。[Google 欧盟用户同意政策](https://www.google.com/about/company/user-consent-policy/) 涉及欧洲经济区、英国和瑞士访客在依法需要时的 Cookie 同意及撤回；如后续改为按地区处理，需提供可靠地区识别和对应验证，不能按界面语言推断访客所在地。

## 跨域访问与查看数据

语言菜单使用原生链接跨域，使 Google 可以在点击时附加 `_gl`。目标页保留此参数，不主动删除；站内语言偏好、主题、其他查询与锚点继续沿用原逻辑。统计 Cookie 仍按域保存，只有访客在两边允许且链接参数仍有效时，跨域访问才有机会关联；统计许可不在域名之间自动转移。

在 GA4 的实时概况确认到达数据；在页面与屏幕报告查看路径，在探索中增加“主机名”区分两个域名、用语言或路径区分语种。跨域路径可能同名，不能只凭 `/` 判断来自哪个站。正常报告的处理与实时数据有延迟，不用刚创建时的“未收到数据”直接判断部署失败。

发布后验证：

1. 新访问未允许时页面无 `site-google-analytics` 脚本；拒绝后刷新与站内切页仍不加载。
2. 隐私页允许后仅加载一次脚本；首屏及每次真实路径变化各一条 `page_view`，查询和锚点变化不重复。
3. 通过菜单切换两域并核对 `_gl`、目标语言及查询；在两域分别选择统计后检查实时页面与用户数。
4. 撤回后停用统计并清理此流 Cookie；测量、本机报告及录音保持可用。
5. 检查手机、桌面、亮暗主题及 RTL，按钮与长译文可读；Google 网络不可达不应影响主功能。

不要把本机回归测试描述成已完成真实网络请求或后台收数验收。实际执行范围记录在接入验证文档。

## 暂停与回滚

临时停用可清空 production 的 `NEXT_PUBLIC_GA_MEASUREMENT_ID` 后重新发布。需要立即恢复旧网页时按 [服务器部署](./服务器部署.md) 回滚两个站点的已保留成功版本。两种方式都不修改 GA4 历史数据，也不删除用户本机报告或录音。

## 实现与依赖选择

实现位于 `src/features/site-analytics/`，服务端外壳只传公开 ID、当前语言和隐私页路径，客户端不引入正文注册表。测试覆盖同意状态、异常存储、正式域名限制、参数过滤、页面去重、前进后退、撤回和跨域链接参数。

复用现有 React 与浏览器 API，不新增 npm 包或锁文件依赖。采用 Google 官方 `gtag.js`，在同意后异步下载；相比额外 Analytics 封装包或 GTM 容器，少一层依赖和配置，也保留本站对采集范围的控制。脚本由 Google 更新，无法像 npm 包一样固定版本；需持续留意服务政策、行为与可达性，不能宣称其版本、安全审计或性能大小固定不变。

技术依据：[基本意见征求模式](https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic)、[页面访问事件](https://developers.google.com/analytics/devguides/collection/ga4/views)、[单页应用](https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications)、[跨网域衡量](https://support.google.com/analytics/answer/10071811?hl=zh-Hans)。Google 文档代码示例适用其页面列出的 Apache 2.0 条款；在线服务与脚本使用遵循 Google Analytics 服务条款。
