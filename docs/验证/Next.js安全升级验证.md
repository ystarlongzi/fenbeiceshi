# Next.js 安全升级验证

日期：2026-11-23。范围为已有工作区的 Next.js 安全升级及配套检查链，保留前一轮中文首页 SEO 改动。本文记录升级与本地回归，生产提交及上线结果见 [中文 SEO 与 Next.js 安全升级上线验证](./中文SEO与Next安全升级上线验证.md)。

## 变更与依据

- `next`、`eslint-config-next`：16.4.2 → 16.4.6，直接依赖保持精确版本；Next.js 环境包、插件和各平台 SWC 随框架对齐。
- `typescript-eslint` 及其内部包：8.71.2 → 8.73.0，满足配套 ESLint 原有 `^8.56.0` 约束。解析链的 minimatch 由 10.2.6 更新为 11.0.9，新增开发传递依赖 `@isaacs/nonrecursive-glob-match@1.1.0`。
- `package.json` 仅变更 Next.js 与配套 ESLint 的版本，未添加直接依赖、overrides 或跨主版本降级。锁文件由 npm 生成；React 19.3.1、TypeScript 5.9.3、ESLint 9.39.1、构建配置和应用代码保持本轮开始时的版本。
- 官方 [16.4.5 发布](https://github.com/vercel/next.js/releases/tag/v16.4.5) 列出七项安全修复，[16.4.6 发布](https://github.com/vercel/next.js/releases/tag/v16.4.6) 补充同分支修正。升级前 audit 中的 Next.js 范围截至 16.4.4，当前稳定版核对来自 npm 官方 registry。
- minimatch 对应 [GHSA-g3hv-75wg-m249／CVE-2026-118764](https://github.com/advisories/GHSA-g3hv-75wg-m249)，公告修复范围从 11.0.1 开始。通过 [TypeScript ESLint 8.73.0](https://github.com/typescript-eslint/typescript-eslint/releases/tag/v8.73.0) 的正常依赖升级采用补丁，不手工覆盖依赖范围。
- Node engines 与项目的 Node ≥24.11、CI Node 24 和本机 Node 26.5.0 兼容。框架及 TypeScript ESLint 为 MIT；新增开发传递包为 BlueOak-1.0.0。安装使用 `--ignore-scripts`，没有扩大安装脚本授权；元数据和锁文件保留包完整性信息。候选比较及体积记录见 [依赖与检查配置](../开发/依赖与检查配置.md)。

## 实际安装与审计

使用 npm 官方 registry，本机命令通过 `rtk proxy` 执行：

```sh
npm install --save-exact next@16.4.6 eslint-config-next@16.4.6 --ignore-scripts --no-audit --no-fund --registry=https://registry.npmjs.org --fetch-retries=1 --fetch-timeout=30000
npm update typescript-eslint --ignore-scripts --no-audit --no-fund --registry=https://registry.npmjs.org --fetch-retries=1 --fetch-timeout=30000
```

以上命令均退出 0。直接清单范围专项检查通过，其他直接依赖不变。升级前完整 `npm audit --json --registry=https://registry.npmjs.org` 退出 1，返回 9 条 moderate 受影响包记录、0 high、0 critical；这不是 9 项独立漏洞，其中检查链的多条记录由同一 minimatch 公告传播。

升级后实际验证如下，所有命令均退出 0：

| 检查                                                                | 结果                                                                                                               |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `npm audit --json --registry=https://registry.npmjs.org`            | 完整依赖树的 info、low、moderate、high、critical 均为 0                                                            |
| `npm audit --omit=dev --json --registry=https://registry.npmjs.org` | 生产依赖树的各级漏洞均为 0                                                                                         |
| `npm ls --all --json`                                               | 无依赖树问题，Next.js 与配套 ESLint 均为 16.4.6                                                                    |
| 临时目录 `npm ci`                                                   | 只复制清单与锁文件，使用官方 registry 并禁用安装脚本；安装成功、两项版本正确，锁文件逐字节一致；验证后移除临时目录 |
| 包完整性与许可证                                                    | Next.js、配套 ESLint 的锁文件 SHA-512 与官方元数据一致；新增开发传递包及 minimatch 的许可证文件存在                |

机器可读证据保存在 `artifacts/next-security/`，包括升级前清单、官方包元数据、依赖差异、审计 JSON、干净安装日志与结果；该目录为本机验证产物，不提交 Git。

## 验证与发布边界

- `npm run check`：完整命令退出 0，包含格式、零警告 ESLint、strict 类型、应用与部署测试、多语言内容、双站构建和静态产物检查。应用测试 183 项全部通过；部署测试 31 项通过、4 项 Linux／Nginx／TLS 集成测试因本机条件跳过，不记为已验证。
- 两次构建均显示 Next.js 16.4.6，连续完成英文及中文导出，没有再出现安全升级阻断、已知漏洞提醒或安全版本查询失败；没有关闭安全检查或使用重试绕过。本轮未修改构建脚本、Next.js 配置、CI 或服务器配置。
- 多语言检查覆盖 24 种新增语言，各 1431 条界面文案；内容检查覆盖 44 个正文主题、27 种语言、1242 个可索引 URL 与 27 个 noindex URL。
- 静态产物检查：中文 94 页、92 个 sitemap URL、3696 条内部链接与锚点；英文基础 47 页、国际站共 1150 个 sitemap URL、3963 条基础内部链接与锚点；新增语言 1128 页、95112 条内部链接与锚点。两域合计 1269 页、1242 个 sitemap URL。
- `node artifacts/seo-bing/check-home.mjs`：退出 0。重新核对升级后的简体、繁体与英文首页 title、meta、Open Graph、WebApplication、H1、自 canonical、28 项语言关系及简体简介，保留已完成的中文 SEO 调整，繁体与英文文案一致。
- 本地静态预览与实际浏览器覆盖英文桌面 1280 × 720、简体手机 375 × 812。英文 Dial／Digital 切换正常；导航进入分贝指南后搜索 `40`，显示 2／31 条声音并展开匹配档位。中文菜单打开后可用 Esc 关闭、焦点回到打开菜单按钮、背景滚动恢复。两种视口均无页面横向溢出，读取到的控制台错误为空；中文简介为 16px，“开始测量”按钮完整处于首屏。临时视口覆盖已恢复。
- 截图为 `artifacts/next-security/english-desktop.jpg` 与 `chinese-mobile.jpg`，交互结果为同目录 `browser-checks.json`，全量检查日志为 `check.log`。截图与模拟手机视口不能替代真实设备或麦克风验收。
- 按 dependency-evaluation、release-check、React 最佳实践、文档维护与 simplify 技能复核本轮范围，继续复用现有静态导出与客户端边界，没有增加业务实现或无关重构。

本机验证不等于 GitHub Actions、真实移动设备、真实麦克风或生产发布验收，npm audit 通过也不保证没有未知漏洞。命令仍出现用户现有的 npm `home` 配置警告，本轮未修改用户 npm 配置。

本项目生产服务器托管静态文件，不运行 Next.js 服务；没有在本轮尝试复现公告中的服务端攻击条件或据此断言线上曾可被利用。若后续改为 SSR、Server Actions、缓存组件或内置图片优化，需要重新评估对应功能的安全边界。回滚仍使用已有服务器发布版本流程，升级前依赖可从 Git 及本机基线恢复，本轮没有修改浏览器记录或音频存储格式。
