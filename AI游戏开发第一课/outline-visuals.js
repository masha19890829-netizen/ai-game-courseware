/* Teaching diagrams: no simulated chat replies, no online calls. */
window.OutlineVisuals=function(s,{frame,esc}){
  const strip=t=>`<div class="outline-strip">${t}</div>`;
  const rows=items=>`<div class="outline-rows">${items.map(x=>`<section><b>${x[0]}</b><div><h2>${x[1]}</h2><p>${x[2]}</p></div></section>`).join('')}</div>`;
  switch(s.visual){
    case 'real-demos':return frame('INSERT COIN / 先操作两份真实文件',`<div class="demo-pair">${[
      ['2D','像素作品','pixel-fighter.png','pixel','观察：按键如何变成角色动作'],
      ['3D','竞速作品','racing-3d.png','racing','观察：操作如何改变运动与视角']
    ].map(x=>`<article><div class="demo-poster"><img src="assets/media/${x[2]}" alt="现有${x[1]}画面"><span>${x[0]}</span></div><div class="demo-copy"><h2>${x[1]}</h2><p>${x[4]}</p><button class="primary" data-play="${x[3]}">▶ 打开 ${x[0]} Demo</button></div></article>`).join('')}</div>${strip('先玩，再说你看到了什么。<br>今天从第三份更小的矿工开始，不直接照做复杂成品。')}`,'复用现有作品 · 生成过程与耗时未核验');
    case 'demo-purpose':return frame('DEMO / 用小版本回答三个问题',`<div class="purpose-media"><img src="assets/media/mgf-landscape.png" alt="迷宫饭 PPT 录屏抽帧"><div><span class="tag gold">你的案例 · 迷宫饭</span><h2>先看流程有没有接起来</h2><button class="secondary" data-play="mgf">▶ 播放 34.5 秒片段</button></div></div><div class="purpose-grid"><div><b>规则对吗？</b><p>捡一块，真的只 +10 吗？</p></div><div><b>问题在哪？</b><p>点击不放置，拖动才有效？</p></div><div><b>值得继续吗？</b><p>带回才算，是否改变选择？</p></div></div>${strip('能试玩 ≠ 已验证留存、商业价值和正式上线质量。')}`,'PPT 第 10–13 页 · 视频只证明所录画面');
    case 'vibe-loop':return frame('VIBE CODING / 中文要求 → 可玩的文件',`<div class="vibe-track">${[
      ['01','你说玩法','方向键移动，碰矿 +10'],['02','AI 实现','在项目里创建 index.html'],['03','你打开试玩','按键、捡矿，确认 30 秒结束'],['04','你再提修改','只改为 45 秒，再玩一次']
    ].map(x=>`<section><span>${x[0]}</span><div><h2>${x[1]}</h2><p>${x[2]}</p></div></section>`).join('')}</div>${strip('不先写代码，也要亲自看结果。<b>出错就给具体经过，不是换一句“再聪明一点”。</b>')}`,'本课采用的入门做法 · 不保证一句话成功');
    case 'llm-agent':return frame('拆开看 / “把 30 秒改成 45 秒”',`<div class="agent-diagram"><div class="agent-bracket"><span>Agent（智能体）= 模型 + 工具 + 执行循环</span><div class="agent-parts"><section><i>LLM</i><h2>大语言模型</h2><p>理解“只改时长”<br>判断该读哪个文件、改哪里</p></section><strong>↔</strong><section><i>TOOLS</i><h2>执行动作的工具</h2><p>读 index.html → 改计时<br>用可用工具尝试检查</p></section></div><p class="loop-note">读检查结果 → 必要时继续改 → 报告完成与未查项</p></div><div class="project-artifact"><span>▰</span><div><b>项目文件夹 / 我的矿工</b><p>留下 index.html；你打开确认 45 秒。</p></div></div></div>${strip('AI 协助制作 ≠ 游戏里调用 AI；本课矿工可离线玩。')}`,'概念示意 · 不是应用内部架构截图');
    case 'roles':return frame('PRODUCER × AGENT / 同一轮，各有交付',`<div class="role-pair"><section><span class="role-label">你 / 制作人</span><h2>决定试什么</h2><ul><li>目标：让玩家犹豫要不要回家</li><li>选择：先试“带回才算”</li><li>取舍：不同时加商店和装备</li><li>试玩：决定保留还是再调</li></ul></section><section><span class="role-label">AI / 在授权范围内</span><h2>把任务做出来</h2><ul><li>读现有计分与地图文件</li><li>列规则、拆成可做的小任务</li><li>实现背包与基地入账</li><li>尝试检查，说明还没查什么</li></ul></section></div>${strip('“更好玩”是要验证的目标；<b>“何时得分、何时丢失”才是本轮可执行的规则。</b>')}`,'同一矿工的职责拆解 · 非历史原始记录');
    case 'prompt-modes':return frame('你在哪个阶段？用对应的说法',`<div class="mode-cards">${[
      ['01','只有模糊想法','先问我 3 个问题，帮我定玩法。','explore','先不写代码'],
      ['02','有目标，没选方案','给我 3 个只改一条规则的小方案。','options','先等我选择'],
      ['03','规则已经确定','只把 30 改为 45，其他逐项不变。','time','现在实现并检查']
    ].map(x=>`<section><span>${x[0]}</span><div><h2>${x[1]}</h2><p>${x[2]}</p><small>${x[4]}</small></div><button class="secondary" data-prompt="${x[3]}">完整消息 ↗</button></section>`).join('')}</div>`,'教学消息模板 · 不是 AI 回答');
    case 'deliverables':return frame('NEXT ROUND / 不靠聊天里的一句“完成”',`${rows([
      ['改前','当前规则','例如：矿石捡到即得分；先确认，别自行补设定。'],
      ['改后','可玩的文件 + 检查结果','index.html；存分和碰撞各试了什么，哪些没试。'],
      ['下轮','制作记录.txt','入口、改动、剩余问题；下次先读记录再核对文件。']
    ])}<div class="outline-button-row"><button class="secondary" data-prompt="rulecheck">复制“先确认规则” ↗</button><button class="primary" data-prompt="handover">复制“保存制作记录” ↗</button></div>`,'PPT 第 5、8、14、20 页方法的教学转化');
    case 'tool-choice':return frame('工具入口 ≠ 底层模型',`${rows([
      ['本课','Codex 桌面端','关联练习文件夹 → 中文任务 → 读写文件 → 你试玩。'],
      ['替代','已有获准的 Claude Code','也可读项目、修改文件、运行检查；操作入口不同。'],
      ['辅助','Grok 等讨论入口','用来梳理创意；能否写本地文件，要另外确认工具和授权。']
    ])}<div class="source-links"><a href="https://learn.chatgpt.com/docs/quickstart" target="_blank" rel="noopener">Codex 官方入门 ↗</a><a href="https://code.claude.com/docs/en/overview" target="_blank" rel="noopener">Claude Code 官方能力说明 ↗</a></div>${strip('先把一种工具用通，确认得到可玩的文件。')}`,'教学路线选择 · 不是工具性能排名');
    case 'model-choice':return frame('本课起步 / 先默认，再按任务调整',`<div class="model-default"><span>START HERE</span><div><h2>账号默认推荐项 + 默认推理</h2><p>先完成一局 30 秒的小矿工，不必先调一堆参数。</p></div></div><div class="model-options">${[
      ['5.6 Terra','日常小游戏制作','本课手选起步建议'],['5.6 Sol','复杂规则、多文件查错','任务复杂时再考虑'],['5.6 Luna','清楚、重复的小改','例如只改一个文案']
    ].map(x=>`<section><h2>${x[0]}</h2><p>${x[1]}</p><small>${x[2]}</small></section>`).join('')}</div><div class="source-links"><a href="https://learn.chatgpt.com/docs/models" target="_blank" rel="noopener">依据：官方模型说明 · 2026-09-04 核对 ↗</a></div>${strip('找不到同名选项？用账号可用的默认项。<br>先排查要求、路径和实际结果，再判断是否需要更换模型。')}`,'型号可能随版本 / 账号变化 · 不作价格承诺');
    default:return '';
  }
};
