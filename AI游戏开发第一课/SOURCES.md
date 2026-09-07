# 素材来源与证据边界

整理日期：2026-09-04。仅供公司内部全员分享。

## 主来源

用户提供的 `Codex游戏开发工作流与入门_内部培训.pptx`，共 21 页。原文件保持不变。当前课件使用 PPT 中已内嵌的媒体，不假设 PPT 文字提到的原始工程、会话日志或额外素材目录已取得。

| 新包内路径（assets/media/） | PPT 内部文件 | 来源页 | 证据类别与限制 |
|---|---|---|---|
| mgf-highlight.mp4 | ppt/media/media-13-1.mp4 | 13 | 内嵌录屏精华剪辑，约 35 秒；非本次现场运行 |
| mgf-landscape.png | ppt/media/image-10-1.png | 10 | PPT 中包含时间标记与说明的横屏抽帧，保留原图 |
| mgf-portrait.png | ppt/media/image-10-2.png | 10 | PPT 中的竖屏画面；不是移动端完整验收 |
| mgf-frame-1.png | ppt/media/image-11-1.png | 11 | 备用流程抽帧 |
| mgf-frame-3.png | ppt/media/image-11-3.png | 11 | 备用流程抽帧 |
| mgf-frame-5.png | ppt/media/image-11-5.png | 11 | 备用流程抽帧 |
| slime-rebuilt-dialogue.png | ppt/media/image-14-1.png | 14 | 据保存会话文本重建；非原始 GUI，非本次生成会话 |
| slime-original.png | ppt/media/image-15-1.png | 15 | 原始评审 / 早期画面，保留原标记 |
| slime-scene.png | ppt/media/image-15-2.png | 15 | PPT 的清理后完整画面；静态图不能证明全部法球运行效果 |
| slime-layers.png | ppt/media/image-15-3.png | 15 | UI 分层预览 v3；证明资源产物，不证明程序完成 |

MGF /《迷宫饭》的项目身份沿用原 PPT 根据本地文件名与复盘记录作出的推断。原 PPT 标注的录屏日期为 2026-05-25、2026-05-28；没有取得原始 session / cwd，因此不补造工具调用、模型、制作耗时或完整改动链。

史莱姆规则讨论依照 PPT 第 14–15 页摘述，保存文本日期为 2026-09-02。未将截图中的具体数值包装为本课已验证的正式数值设计。

Cube 人工验收表摘述自 PPT 第 18–19 页：单击未落子、拖拽 3×3 触发消除与订单变化、“换关”无二次确认、前三关未见胜利结算。未取得 Cube 可玩工程，不声称本次重现；“体验前三关”不改写为“通关前三关”。

## 现有作品

| 新包路径 | 用户文件夹来源 | 用途 |
|---|---|---|
| assets/demos/pixel-fighter.html | 2D像素作品-play.html | 展示输入与对战反馈；保留作品原代码 |
| assets/demos/racing-3d.html | 3D作品-play.html | 展示 3D 场景与移动；保留作品原代码 |
| assets/media/pixel-fighter.png | posters/2d.png | 对应作品封面 |
| assets/media/racing-3d.png | posters/3d.png | 对应作品封面 |

这些是现有可玩产物，不据文件名推断“一句话完成”、耗时、使用模型或发布质量。

## 本课原创内容

像素矿工、地图、角色、矿石、巡逻怪和 UI 均为本次编写的教学演示。像素美术由本地 Canvas 代码绘制。A/B 初始地图、移动速度、巡逻与时限共用确定性逻辑，只改变入账时机与未入账收益的风险。

工作流节点、任务卡、下一轮建议属于**教学编写**，不是原始 AI 对话。未接入任何 AI 接口，未生成虚假调用日志、假进度或假玩家数据。界面只显示完整试玩得到的最近两局结果；人工验收框不是自动测试。

## 零基础重写新增内容（2026-09-04）

- 操作入口已核对 [官方快速入门](https://learn.chatgpt.com/docs/quickstart) 与 [项目/文件夹说明](https://learn.chatgpt.com/zh-Hans/docs/projects)。桌面端产品选择、文件夹关联等步骤依据这些页面。具体界面可能随版本变化；课件明确区分较新桌面端内的 Codex 与已有 Codex 界面，不编造某一安装版本的截图。
- 所有资源管理器、项目关联、权限与消息状态画面均为本课绘制的操作示意，**不是应用原始截图、历史会话或交互式 AI 客户端**。
- `beginner-data.js` 中的 13 条消息为完整教学模板；不会从课件发送给外部服务，也不伪造 AI 返回内容。
- `practice/v1–v4/index.html` 是本轮代码生成的独立单文件构建，四阶段规则真实可玩。`practice/fault/index.html` 为刻意加错分值的教学故障样本。
- v1/v2 除版本元数据与时长配置外使用完全相同的代码；v3/v4 使用相同地图、速度和危险节奏，只改变计分与背包规则。
- `新手操作手册.html` 与练习包内的消息由当前课程数据构建。静态初始画面使用对应实际模型绘制，不是伪造试玩结果。
- 课件中的原始案例、媒体与素材身份保持上文边界，仍不推断原项目耗时、使用模型或成功率。

## 课后在线参考（2026-09-04 核对）

以下链接和中文导读记录在 `reference-data.js`，同步生成 `课后参考.html`。外部内容未下载、未嵌入自动播放；需要联网，平台访问和字幕情况不作保证。

| 类别 | 来源 | 新人怎么用 | 核对范围 |
|---|---|---|---|
| 短视频 | [Google Cloud AI Agent 介绍页](https://cloud.google.com/discover/what-are-ai-agents?hl=zh-CN) | 打开顶部官方标注 2:11 的介绍视频 | 官方页面、视频入口；未逐分钟审看 |
| 视频 | [OpenAI Academy：Codex for Beginners](https://academy.openai.com/public/videos/codex-for-beginners-2026-04-22) | 做过第一版后选看入门讲座 | 页面、讲者与回放说明；未核验中文字幕 |
| 视频 | [OpenAI：Getting started with Codex](https://www.youtube.com/watch?v=px7XlbYgk7I&t=986s) | 选看 16:26–27:02 提示词章节 | 官方频道、简介章节表；较早 CLI/IDE 界面，不作为本课安装依据 |
| 中文文章 | [OpenAI 快速入门](https://learn.chatgpt.com/zh-Hans/docs/quickstart) | 安装、登录和桌面端入口 | 已核对正文 |
| 中文文章 | [OpenAI 项目与文件夹](https://learn.chatgpt.com/zh-Hans/docs/projects) | 关联自己的练习目录 | 已核对本地项目与文件夹部分 |
| 中文文章 | [OpenAI 提示词](https://learn.chatgpt.com/zh-Hans/docs/prompting) | 说明目标、上下文、输出、修改边界 | 已核对概览与 Codex 段落 |
| 英文入门模块 | [Microsoft Learn：AI Agent 入门](https://learn.microsoft.com/en-us/training/modules/introduction-develop-ai-agents/) | 按需补充定义、用途和组成 | 官方标注 18 分钟 / 6 单元、无先决条件；正文目标已核对 |

这些参考不增加 60 分钟正课课时，不要求全部看完。作业使用学员获准账号实际生成新游戏，不将本课预制矿工当作独立作业。所有引用均是学习导航，不代表第三方为本课背书。

## 本轮大纲对齐（2026-09-04）

- 重新阅读用户 `AI课件.zip` 内第一节数据及目录 `data/course-data.js`，二者字节一致。吸收原第一节的 Demo 目的、LLM / Agent、人和 AI 分工、三种需求表达与每轮交付。未加载旧数据接口，也未恢复 Dice Defense、Git/SVN 或命令大全专题。
- 用户截图大纲对应前四关 7 / 8 / 6 / 6 分钟；配置与开聊合计 20 分钟。原作业内容不调整，保留为选看。
- 对照阅读 PPT 全部 21 页，重点使用第 4–5、8–9 页的能力与任务拆分、第 10–15 页的迷宫饭和史莱姆案例、第 19–20 页的 Cube 验收与制作记录。
- `outline-data.js`、`outline-visuals.js` 是本课的新编教学图解和五条消息。Agent 图解释模型、工具、执行循环的关系，不将“Agent”错误简化为只有工具，也不认为所有网页聊天都一定不能操作文件；实际能力取决于应用、环境与授权。
- [Codex 官方模型说明](https://learn.chatgpt.com/docs/models)：2026-09-04 核对当前默认入口及 5.6 Sol / Terra / Luna 的官方定位。本课建议是对简单小游戏任务的教学选择，不是排行榜、实测结论、价格或成功率保证。未搬用原稿中未经当前官方资料复核的型号、价格和耗时。
- [Claude Code 官方概览](https://code.claude.com/docs/en/overview)：核对读取代码、修改文件、运行命令与不同使用入口的能力。本课不要求安装第二套工具，也不推断所有名为 Claude 的聊天入口均能写本地文件。
- Grok 等工具只作为讨论入口的例子；是否可读写项目要另看具体工具和授权。本课未接入它们，也未演示调用。
- [OpenAI 官方快速入门](https://learn.chatgpt.com/docs/quickstart) 与 [项目说明](https://learn.chatgpt.com/docs/projects) 再次核对；操作入口依安装版本变化。界面依旧是明确标注的示意。
- 原在线参考 7 项及作业内容保留。参考卡中的“对应关卡”随新路线更新，不声称本轮重新看完全部视频。

## 随包字体及许可

- Noto Sans SC：Google Fonts 仓库 `ofl/notosanssc`，本地打包为 `assets/fonts/NotoSansSC.ttf`。
- Press Start 2P：Google Fonts 仓库 `ofl/pressstart2p`，本地打包为 `assets/fonts/PressStart2P-Regular.ttf`。
- 两者均随包提供原始 SIL Open Font License 文本。运行网页不请求在线字体服务。

## 原文件保护

制作前对新目录之外的旧文件生成 SHA-256 清单，保存在 `tests/original-files.json`。静态验收脚本会重新比较；不改写该基线。新课件不读取旧课程数据，也未覆盖旧 ZIP。
