# Google Analytics 4

更新：2026-10-27。中文与国际站使用同一项 GA4 媒体资源、同一个 Web 数据流。麦克风、音频、测量读数、报告备注和测量设备标识不进入统计。实际生产状态见 [接入验证](../验证/Google统计接入验证.md)。

中文站另接入[百度统计](./百度统计.md)，与 GA4 共用访客统计偏好；本文件中的衡量 ID 及停用变量仅控制 Google。

## 后台与构建配置

- 媒体资源：分贝测试 / SoundMeterGo，ID `560740587`；[打开管理](https://analytics.google.com/analytics/web/?authuser=1#/a401391058p560740587/admin)。
- 数据流：分贝测试 / SoundMeterGo · Web，ID `16203787160`，主网址 `https://soundmetergo.com`。
- 公开衡量 ID：`G-MPXCSZLCVY`。它是浏览器代码中的公开标识，无需 API 密钥或新的 GitHub Secret。
- Google 代码 → 配置您的网域：精确匹配 `fenbeiceshi.com` 和 `soundmetergo.com`。
- 增强型衡量关闭。配置使用 `send_page_view: false`，由本站对首屏、站内切页及前进后退统一发送 `page_view`，避免浏览器历史自动事件重复计数。
- Google 信号和广告个性化在代码中关闭，不启用广告事件或测量操作的自定义事件。GA4 的 `session_start`、`first_visit`、`user_engagement` 等基础事件仍由 Google 管理。

在 GitHub 仓库 Settings → Environments → production → Environment variables 中配置：

| Variable                        | 值                                       |
| ------------------------------- | ---------------------------------------- |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-MPXCSZLCVY`                           |
| `NEXT_PUBLIC_GA_SHOW_NOTICE`    | `false`（默认隐藏浮动提示；`true` 展示） |

`.github/workflows/deploy.yml` 在构建前注入这两个变量，同一组配置进入两个域名的静态包。更新变量后必须重新构建和部署，修改服务器环境不会改变已生成的 JavaScript。衡量 ID 缺失或留空时关闭 Google 统计，中文站仍保留百度统计与统计设置；提示开关缺失或留空时等同于 `false`，不影响统计默认开启。提示开关只接受小写 `true`、`false`，格式错误会使构建失败。PR 检查不注入 production 变量。

本地默认没有衡量 ID。如需验证模块，在项目根目录 `.env.local` 设置该 ID；如需展示浮动提示，再设置 `NEXT_PUBLIC_GA_SHOW_NOTICE=true`，示例见根目录 `.env.example`。本地与预览域名即使设置真实 ID，也不会向正式 GA4 数据流发送事件；实际发送仅允许两个 HTTPS 正式域名，不允许子域、相似域名或自定义端口。

## 访客选择与采集边界

配置衡量 ID 后，读取偏好成功且没有已保存选择时，Google 统计默认开启；中文站的百度统计无需衡量 ID，沿用同一策略。已保存的拒绝始终优先。读取偏好完成前不加载统计，读取失败且没有本页显式选择时也保持关闭。本页手动选择即使保存失败仍立即生效，并在隐私设置中提示无法记住。默认启用不会自动向存储写入 `granted`，访客的实际选择与默认状态分开处理。

`NEXT_PUBLIC_GA_SHOW_NOTICE` 只控制首次访问的浮动提示，默认隐藏，不控制采集默认值。设置为 `true` 时，底部悬浮框说明统计默认开启，提供允许、拒绝及描述末尾的行内隐私链接；桌面居中、手机保留两侧留白与底部安全区，不加遮罩、不锁定背景滚动，选择后收起。较长内容或短屏可在框内滚动，手机菜单与工作台弹框保持在提示之上。无论提示开关如何，页脚“统计设置”均进入本语言隐私页，顶部保留页内设置，可随时关闭或重新开启统计。

统计偏好继续使用独立键 `fenbeiceshi:analytics-consent:v1`，不读写报告、录音、主题或语言存储，也不重写已有拒绝。两个域名分别保存选择；其他标签页修改后同步生效，清空偏好会恢复默认开启，读取失败则保持关闭。拒绝会启用 Google 停用开关并清理本域此数据流的 `_ga`、`_ga_MPXCSZLCVY` Cookie，已发送的数据不会自动删除。

Google 接收页面地址、标题、语言、来源及其基础浏览器／设备数据。代码过滤页面与本站来源的全部查询和锚点，外站来源只保留 origin；不发送用户输入、测量值或内部错误。隐私页静态正文已同步 27 种语言，说明 Google Cookie、可能的境外处理、撤回与跨域行为。

提示开关仅控制界面，不识别访客地区，也不代表完成各地法律审查。[Google 欧盟用户同意政策](https://www.google.com/about/company/user-consent-policy/) 涉及欧洲经济区、英国和瑞士访客在依法需要时的 Cookie 同意及撤回；如后续需要事前同意或按地区处理，应另外实现相应的采集策略和验证，不能用展示开关或界面语言代替。

## 跨域访问与查看数据

语言菜单使用原生链接跨域，使 Google 可以在点击时附加 `_gl`。目标页保留此参数，不主动删除；站内语言偏好、主题、其他查询与锚点继续沿用原逻辑。统计 Cookie 仍按域保存，仅当两域统计均开启且链接参数仍有效时，跨域访问才有机会关联；开启或拒绝选择不在域名之间自动转移。

语言选项不能拦截 `pointerdown` 的默认行为，否则浏览器会取消 Google 所需的兼容鼠标事件。键盘采用按钮上的虚拟焦点，因此在激活真实链接前转发冒泡的 `keyup` 准备事件；参数在真正跳转前保留。桌面鼠标、键盘及手机抽屉均已在正式站核对。维护菜单时须继续保留这些事件，不能恢复为脚本直接跨域导航。

在 GA4 的实时概况确认到达数据；在页面与屏幕报告查看路径，在探索中增加“主机名”区分两个域名、用语言或路径区分语种。跨域路径可能同名，不能只凭 `/` 判断来自哪个站。正常报告的处理与实时数据有延迟，不用刚创建时的“未收到数据”直接判断部署失败。

发布后验证：

1. 未保存偏好的新访问默认只加载一个 `site-google-analytics`，默认不显示浮动提示；已保存拒绝时刷新、切页仍不加载。
2. 隐私页准确展示当前开启／关闭状态；拒绝后停用采集，再次允许可恢复，脚本不重复加载。
3. 首屏及每次真实路径变化各一条 `page_view`，查询和锚点变化不重复。通过菜单切换两域并核对 `_gl`、目标语言及查询，再查看实时页面与用户数。
4. 设置 `NEXT_PUBLIC_GA_SHOW_NOTICE=true` 后验证新访问出现提示，其文案仍明确统计默认开启；设置 `false` 后提示隐藏，隐私页设置和拒绝偏好保留。
5. 检查手机、桌面、亮暗主题及 RTL，按钮与长译文可读；Google 网络不可达不应影响主功能，测量、本机报告及录音保持原行为。

不要把本机回归测试描述成已完成真实网络请求或后台收数验收。实际执行范围记录在接入验证文档。

## 暂停与回滚

临时停用 Google 可清空 production 的 `NEXT_PUBLIC_GA_MEASUREMENT_ID` 后重新发布，此操作不关闭中文站百度统计。需要立即恢复旧网页时按 [服务器部署](./服务器部署.md) 回滚两个站点的已保留成功版本。两种方式都不修改 GA4 历史数据，也不删除用户本机报告或录音。

## 实现与依赖选择

实现位于 `src/features/site-analytics/`，服务端外壳只传公开 ID、提示开关、当前语言和隐私页路径，客户端不引入正文注册表。测试覆盖提示开关解析、偏好读取就绪、默认开启、拒绝优先、异常存储、正式域名限制、参数过滤、页面去重、前进后退、撤回和跨域链接参数。

复用现有 React 与浏览器 API，不新增 npm 包或锁文件依赖。采用 Google 官方 `gtag.js`，在偏好读取完成且统计开启时异步下载；相比额外 Analytics 封装包或 GTM 容器，少一层依赖和配置，也保留本站对采集范围的控制。脚本由 Google 更新，无法像 npm 包一样固定版本；需持续留意服务政策、行为与可达性，不能宣称其版本、安全审计或性能大小固定不变。

技术依据：[基本意见征求模式](https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic)、[页面访问事件](https://developers.google.com/analytics/devguides/collection/ga4/views)、[单页应用](https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications)、[跨网域衡量](https://support.google.com/analytics/answer/10071811?hl=zh-Hans)。Google 文档代码示例适用其页面列出的 Apache 2.0 条款；在线服务与脚本使用遵循 Google Analytics 服务条款。
