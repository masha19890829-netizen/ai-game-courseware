/* Outline-aligned teaching route. Reuses authored examples, not historical AI replies. */
(function () {
  'use strict';
  const D=window.ARCADE_COURSE;
  const old=Object.fromEntries(D.chapters.map(c=>[c.id,c]));
  const s=(id,i)=>({...old[id].steps[i]});
  const optional=(id,i)=>({...s(id,i),optional:true});
  Object.assign(D.prompts,{
    explore:'我想做一个采矿小游戏，但还没想清楚玩家为什么愿意一直捡矿。先不要写代码。请问我 3 个具体问题，分别确认玩家目标、操作方式和失败条件。每个问题给两个简单选项，等我回答后再整理成最小规则。不要扩展商店、装备或联网。',
    options:'我希望玩家在“继续拿矿”和“先回去保住收益”之间做选择。先不要改文件。请给出 3 个只改变一条规则的小方案，每个说明：具体改什么、玩家可能做出什么选择、我该怎样试玩检查。不要断言哪个方案更好玩，等我选一个再实现。',
    rulecheck:'先不要修改文件。请根据当前游戏文件列出：人物怎样移动、矿石何时得分、碰撞会发生什么、时间到怎样结算。区分代码里已有的规则和你建议新增的规则。没有找到证据就写“未确认”，不要替我补设定。',
    handover:'这一轮先到这里。请在当前练习文件夹写一份“制作记录.txt”，列出游戏入口、当前规则、本轮改动、实际检查结果和未检查项，以及下一轮只做的一件事。不记录账号信息，不上传文件。下次开始前请先读这份记录，并以实际游戏文件为准核对。',
    modeltask:'这次只完成当前的矿工小游戏任务，不增加框架或联网服务。先确认你能读写的是哪个练习文件夹；若不具备文件操作能力，请明确说明，不要声称已创建文件。完成后给出文件路径、打开方法和实际检查结果。'
  });
  D.version='outline-v3';
  D.title='认识 AI，动手做出第一个 Demo';
  D.chapters=[
    {id:'mission',name:'先看两个 Demo',minutes:7,title:'先看看 AI 做的游戏长什么样。',subtitle:'2D、3D 各玩两分钟。今天不复刻大游戏，只亲手做出一个能玩的最小版本。',note:'约 2 分钟演示 2D，2 分钟演示 3D；只用页面实际标出的操作。余下时间讲 Demo 用途并玩矿工第一版。不宣称一句话生成、开发耗时或正式品质。',steps:[
      {name:'打开两份游戏',visual:'real-demos',action:['依次点开 2D 像素作品和 3D 竞速作品，按画面上的提示各玩两分钟。','每玩一个只回答三句话：我按了什么键？画面发生了什么？我还想试什么？'],prompt:'rulecheck',expected:'不是看图：你真的操作了两个网页文件，按键让画面动了。',help:'先点一下游戏区域再按键。旧作品在当前浏览器打不开，就换矿工第一版演示，并记下异常。',tip:'作品只能证明「这份文件能做什么」，看不出做了多久、怎么做的。'},
      {name:'为什么先做 Demo',visual:'demo-purpose',action:['播放《迷宫饭》片段，看画面从入口到战斗再回来的衔接。','然后只想一个今天能验证的小问题，比如「吃一块矿是不是只加 10 分」——而不是「这游戏能不能火」。'],prompt:'options',expected:'Demo 的作用：给讨论一个能上手的对象——查规则、找问题、比一条新规则。',help:'视频只能展示录到的画面，不能代替实际验收。留存和商业价值，Demo 回答不了。',tip:'先花小成本验证一个问题，再决定要不要做成大游戏。',case:'mgf'},
      {...s('mission',0),name:'今天就做这个最小版本'}
    ]},
    {id:'concept',name:'Vibe coding 与 Agent',minutes:8,title:'你说中文需求，AI 动手改文件。',subtitle:'先分清三个角色：模型负责听懂，工具负责操作，Agent 负责把活干完。',note:'采用适合新人的自然语言迭代做法，不倡导不看结果、盲目接受。Vibe coding 是常见说法，不是某款软件或「一句话全自动」的保证。',steps:[
      {name:'Vibe coding：说人话做游戏',visual:'vibe-loop',action:['对比两种说法：「做一个矿工游戏」太模糊；「方向键移动、碰矿加 10 分、30 秒结束」才能做。','生成后自己玩，再说「只把 30 秒改成 45 秒」；打开新版核对，不是听它说「完成了」就信。'],prompt:'time',expected:'你能把制作过程说成一串动作：发中文需求 → 它建文件 → 你打开玩 → 你提意见 → 它改文件。',help:'不用读懂代码，但不能不看文件、不试玩。做得不对就继续提，别当成必然成功。',tip:'本课的 vibe coding = 用人话一轮一轮做小版本。不是玄学，是流程。'},
      {name:'模型、工具、Agent 的区别',visual:'llm-agent',action:['拿「30 改成 45」举例：模型负责听懂你的意思，文件工具负责真改文件，检查工具负责试着验证。','看它是否真的操作了文件——聊天里贴一段代码，不等于你电脑里的文件被改了。'],prompt:'modeltask',expected:'一句话记住：LLM 是「脑」，工具是「手」，Agent 是把脑和手组织起来干活的「人」。',help:'能不能读写你电脑的文件，取决于你用的软件和授权——不是开了聊天它就自动能改。',tip:'Codex 是干活的「应用」，里面用模型；应用名和模型名不是一回事。'},
      {...s('mission',1),name:'它能做，也会做错'}
    ]},
    {id:'roles',name:'人和 AI 分别做什么',minutes:6,title:'你决定玩什么，AI 负责做出来。',subtitle:'制作人不是说「更好玩」，而是先决定试哪种玩法，再限定这轮只改什么。',note:'保留原课件的三种表达方式，明确「先探索」与「开始执行」的边界。史莱姆例子来自 PPT 第 14–15 页，重建对话不是完整原始聊天。',steps:[
      {name:'谁拿主意，谁动手',visual:'roles',action:['你决定：这局要试「带着矿还要不要冒险」，并且只改计分时机这一件事。','让 AI 列实现方案和检查项；你玩完决定：保留、调整，还是砍掉。'],prompt:'options',expected:'你出的叫「取舍」，AI 交的叫「文件和检查说明」——谁也替代不了谁。',help:'AI 说「这样更有策略」只是猜测。必须看到规则真的变了、观察玩家怎么选，才算数。',tip:'创新不一定是加系统：改一下得分时机，也可能产生新选择。'},
      {name:'三种情况，三种开口方式',visual:'prompt-modes',action:['玩法没想好：让它问你问题。有目标没方案：让它给 3 个小方案，先别改文件。','方案定了：写清规则、范围和检查动作，再让它动手。点左侧看完整消息。'],prompt:'explore',expected:'同一个聊天框，你要会说「先帮我想」和「现在开始改」两种话。',help:'不满意先看是不是阶段搞错了：你想讨论它却开工、你要文件它只动嘴。把下一步动作补清楚。',tip:'别在你还没决定时，让 AI 替你把一整套玩法做完。'},
      {name:'每轮结束留一份记录',visual:'deliverables',action:['改之前，让它对照文件先列已有规则，拿不准的标「未确认」，你再选下一项。','改完让它存一份记录：入口文件、当前规则、本轮改动、检查结果、下一步只做的一件事。'],prompt:'handover',expected:'下次回来能找到：玩哪个文件、现在有什么、哪里没查、下一步改什么——不靠翻聊天记录。',help:'记录也会过时。换新聊天时让它对照真实文件重新核对，别当它永远记得上一轮。',tip:'史莱姆案例：先把射击、弹射、穿透的条件一条条说清再分别做，别让 AI 自己脑补规则。',case:'slime'}
    ]},
    {id:'models',name:'工具与模型怎么选',minutes:6,title:'先选能干活的入口，再选模型。',subtitle:'本课统一用 Codex 桌面端。跑通一条路线，比同时装三套工具重要。',note:'依据 2026-09-04 官方快速入门、项目和模型文档。型号与入口可能变化，以账号可见项为准。不给未核实价格或中转配置；看本课不需要买新工具。',steps:[
      {name:'工具：找能改文件的那个',visual:'tool-choice',action:['本课用 Codex 桌面端，在你自己的文件夹里做；公司已有获准的 Claude Code 也能按同样标准练。','用 Grok 这类聊天工具聊创意可以，但选定的规则要带回制作工具里落地。'],prompt:'modeltask',expected:'你要找的是「能在指定文件夹读写文件的工具」，不是只会回答问题的模型。',help:'公司已有获准工具就先沿用。别为上课装来路不明的软件、贴密钥、加未知中转地址。',tip:'换工具不怕：找文件、试玩、检查，这三步永远不变。'},
      {name:'模型：用默认推荐就够',visual:'model-choice',action:['在输入框附近的模型 / 推理选项里，先用账号默认推荐项；第一版不需要开最高档。','能手选的话：日常小游戏优先试 5.6 Terra；复杂规则或多文件查错考虑 Sol；明确小改考虑 Luna。'],prompt:'time',expected:'先用一个能用的选项跑完「生成 → 打开 → 修改」，按结果决定换不换，别反复刷排行榜。',help:'看不到这些型号就用默认项。没有额度就走获准渠道——模型再强，也救不了模糊需求和开错文件。',tip:'这是按官方定位给的起步建议，不是效果保证。以你账号实际看到的为准。'}
    ]},
    {...old.setup,minutes:8,name:'配置：文件夹与权限',subtitle:'配置只做四件事：装软件登录、建空文件夹、关联路径、确认权限。然后才开始做游戏。'},
    {id:'first-message',name:'开聊：做出第一版',minutes:12,title:'发出第一条需求，然后亲手打开文件。',subtitle:'把「配置 + 开始聊天」连起来：你发的中文需求，最后要变成能双击打开的 index.html。',note:'与上一关合计 20 分钟。按「需求 → 当前状态 → 文件位置 → 试玩」走完，不演示在线生成等待。操作图是示意，预制游戏是教学版本。',steps:[s('first-message',0),s('first-message',1),s('open-game',0),s('open-game',1)]},
    {...old.edit,minutes:4,steps:[{...s('edit',1),action:['先把整个「我的矿工」复制一份放在旁边，改名「我的矿工_30秒备份」；Codex 仍关联原目录。','在原任务里发修改消息；做完后重开原目录的 index.html，或按 Ctrl + R 刷新再开一局。']},s('edit',2)]},
    {...old.fix,minutes:4,steps:[{...s('fix',1),action:['先打开左侧「教学故障样本」，只吃第一块矿；看到 +20 就用 Win + Shift + S 截图。','把截图拖进 Codex，确认出现附件缩略图，再发「操作 → 实际 → 预期 → 范围」四句话。']},s('fix',2)]},
    {...old.idea,minutes:3,name:'创意：只改一条规则',subtitle:'先加危险，再改得分时机。两个版本对比着玩，才知道新规则值不值得留。',steps:[s('idea',0),s('idea',1),s('idea',2),optional('look',0),optional('look',1)]},
    {id:'practice',name:'保存带走与选看',minutes:2,title:'把能玩的文件和制作记录一起带走。',subtitle:'完成的标志：别人拿到能打开玩，你下次回来知道从哪接着改。',note:'正课只讲前两步和完整操作路线。原作业与在线书架保留为选看，本轮不调整作业要求。画面参考、作业和外部视频不计入 60 分钟。',steps:[
      {...s('share',1),action:['先打开最终文件，检查开始、计分、结束、重开；让 AI 列出必需文件，再复制整个目录为「我的矿工_交付版」。','右键交付版 → 压缩为 ZIP；旧菜单选「发送到 → 压缩(zipped)文件夹」。不放账号配置和无关资料。']},
      s('share',2),s('practice',1),optional('practice',0),optional('practice',2)
    ]}
  ];
  D.sources.push(
    ['本轮大纲与原课件','用户第一节大纲；原 AI课件.zip 内 data/course-data.js 与目录版本一致。吸收 Demo 目的、LLM/Agent、人和 AI 分工、三种表达方式；不沿用旧耗时承诺。',''],
    ['Codex 模型选择','官方当前模型定位，2026-09-04 核对；本课建议不是性能保证，账号可用项以实际界面为准。','https://learn.chatgpt.com/docs/models'],
    ['Claude Code 能做什么','官方说明：可读代码、改文件、运行命令；本课不另设 Claude 安装主线。','https://code.claude.com/docs/en/overview'],
    ['Agent 概念','模型、工具与执行任务的关系；本课图解为教学概括，不是实际软件内部结构图。','https://learn.microsoft.com/en-us/training/modules/introduction-develop-ai-agents/']
  );
  const refs=window.COURSE_REFERENCES;
  const maps={'agent-video':'对应第 2 关。无需注册云服务。','codex-beginner':'对应第 5–8 关。旧界面可能不同，以当前官方文档为准。','codex-prompt-video':'对应第 3、6–8 关。CLI、IDE 和 MCP 不是本课安装要求。',quickstart:'对应第 5 关。不需要学习 API 或命令行。',projects:'对应第 5–6 关。工作树等进阶内容可跳过。',prompting:'对应第 3、6–9 关。不需要扩展到插件和自动化。','agent-reading':'对应第 2 关。无需先决知识；证书和练习积分不是本课要求。'};
  if(refs)for(const item of refs.items)item.scope=maps[item.id]||item.scope;
})();
