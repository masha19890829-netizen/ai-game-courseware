(function(){
  'use strict';
  const $=id=>document.getElementById(id), M=window.MinerModel;
  const canvas=$('game'),ctx=canvas.getContext('2d'),stage=$('stage');
  const query=new URLSearchParams(location.search);
  let game=M.createGame(query.get('v')==='B'?'B':'A'), keys=new Set(),target=null;
  let enhanced=true,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches||query.get('motion')==='off';
  let audio=null,sound=false,particles=[],labels=[],shake=0,last=0,acc=0,raf=0,disposed=false,toastUntil=0;
  let history=[];
  try{const saved=JSON.parse(sessionStorage.getItem('miner-real-runs-v1')||'[]');if(Array.isArray(saved))history=saved.filter(x=>['A','B'].includes(x.version)&&x.duration===45&&Number.isFinite(x.banked)).slice(-2);}catch{}
  $('motion').checked=reduced;document.body.classList.toggle('reduced-motion',reduced);
  function tell(text){$('toast').textContent=text;toastUntil=performance.now()+1900;$('toast').classList.add('visible');}
  function beep(freq=440,duration=.07){
    if(!sound||!audio||game.status!=='running')return;
    try{const osc=audio.createOscillator(),gain=audio.createGain();osc.type='square';osc.frequency.value=freq;gain.gain.setValueAtTime(.035,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);osc.connect(gain);gain.connect(audio.destination);osc.start();osc.stop(audio.currentTime+duration);}catch{}
  }
  function overlay(tag,title,text,button){$('overlayTag').textContent=tag;$('overlayTitle').textContent=title;$('overlayText').textContent=text;$('overlayStart').textContent=button;$('gameOverlay').classList.remove('hidden');}
  function ready(){
    const b=game.version==='B';
    overlay('INSERT CURIOSITY',b?'背包装满，要回去吗？':'矿石就在前面。',b?'45 秒，把矿石带回左侧基地才算分。红色巡逻怪会让你丢掉背包里的矿石。':'45 秒，每块矿石 10 分，拾取即入账。方向键移动，或点击地面走向目的地。','开始采集 →');
    $('ruleStrip').textContent=b?'B 版：每块矿石 10 分，回到基地才入账；碰撞丢失背包，已入账分数保留。':'A 版：每块矿石 10 分，拾取即入账；碰撞只送回基地。';
    document.querySelectorAll('[data-version]').forEach(b=>{b.classList.toggle('selected',b.dataset.version===game.version);b.setAttribute('aria-pressed',b.dataset.version===game.version);});
    $('versionLabel').textContent=game.version;$('pause').textContent='暂停';$('pause').disabled=true;hud();
    $('carriedLabel').textContent=b?'背包 / 遇险会丢失':'背包 / A 版直接入账';
  }
  function hud(){ $('banked').textContent=String(game.banked).padStart(3,'0');$('carried').textContent=String(game.carried).padStart(3,'0');$('timer').innerHTML=`${String(Math.max(0,Math.ceil(45-game.elapsed))).padStart(2,'0')}<span>s</span>`; }
  function play(){
    if(game.status==='ended'){game=M.createGame(game.version);particles=[];labels=[];}
    if(game.status==='paused')M.resume(game);else M.start(game);
    $('gameOverlay').classList.add('hidden');$('pause').disabled=false;$('pause').textContent='暂停';stage.focus({preventScroll:true});last=0;acc=0;
    if(sound&&audio)audio.resume().catch(()=>{});
  }
  function pause(){
    if(game.status!=='running')return;
    M.pause(game);keys.clear();target=null;acc=0;
    overlay('PAUSED / TIME IS FROZEN','停一下，看看发生了什么。','倒计时、巡逻与采集都已暂停。可以先解释，再继续这一局。','继续采集 →');
    $('pause').textContent='继续';if(audio)audio.suspend().catch(()=>{});
  }
  function reset(version=game.version){ game=M.createGame(version);keys.clear();target=null;particles=[];labels=[];shake=0;acc=0;ready();if(audio)audio.suspend().catch(()=>{}); }
  function results(){
    const list=history.slice().reverse();
    $('results').innerHTML=[0,1].map(i=>{
      const r=list[i];
      if(!r){const missing=list[0]?.version==='B'?'A':'B',v=i===0?'A':missing;return `<div class="result-card"><div class="result-head"><b>${v} 版 · ${v==='A'?'即时得分':'带回才算'}</b><small>等待一局完整试玩</small></div><p class="empty">尚未试玩</p><p class="result-foot">开始、操作、完成 45 秒后，这里才会出现真实结果。</p></div>`;}
      return `<div class="result-card"><div class="result-head"><b>${r.version} 版 · ${r.version==='A'?'即时得分':'带回才算'}</b><small>${i===0?'最近一局':'上一局'} / 45 秒</small></div><div class="stat-row"><span><b>${r.collected}</b>采集 / 块</span><span><b>${r.banked}</b>入账 / 分</span><span><b>${r.lost}</b>遇险损失 / 分</span><span><b>${r.returns}</b>主动回基地</span><span><b>${r.hits}</b>遇险次数</span></div><div class="result-foot">结束时未带回：${r.unbanked} 分 · 固定地图 5050 · 本次操作产生</div></div>`;
    }).join('');
  }
  function handleEvents(){
    for(const e of game.events.splice(0)){
      if(e.type==='finish'){
        const r=M.result(game);history.push(r);history=history.slice(-2);try{sessionStorage.setItem('miner-real-runs-v1',JSON.stringify(history));}catch{}
        results();overlay('RUN COMPLETE',`${r.banked} 分，已带回。`,`采集 ${r.collected} 块 · 遇险 ${r.hits} 次 · 回基地 ${r.returns} 次。${r.unbanked?`还有 ${r.unbanked} 分留在背包，未计入成绩。`:'试试另一种规则，观察自己的选择。'}`,'再玩一局 →');$('pause').disabled=true;keys.clear();target=null;if(audio)audio.suspend().catch(()=>{});continue;
      }
      if(e.type==='collect'){beep(650+game.collected%4*80);if(enhanced)labels.push({x:e.x,y:e.y-23,text:game.version==='A'?'+10 入账':'+10 背包',life:1,color:'#c9ffb9'});}
      if(e.type==='bank'){beep(980,.15);tell(`带回基地：+${e.value} 分入账`);if(enhanced)labels.push({x:e.x,y:e.y-28,text:`存入 +${e.value}`,life:1.3,color:'#ffe1a1'});}
      if(e.type==='hit'){target=null;beep(140,.13);tell(e.value?`遇险！丢失背包 ${e.value} 分，已入账不受影响`:'遇险！回到基地，已入账分数保留');if(enhanced&&!reduced)shake=.18;}
      if(enhanced&&!reduced)for(let i=0;i<12;i++)particles.push({x:e.x,y:e.y,vx:Math.cos(i*.53)*55,vy:Math.sin(i*.53)*55-20,life:.5,color:e.type==='hit'?'#ef9381':'#b8f2ac'});
    }
  }
  function frame(now){
    if(disposed)return;
    const dt=last?Math.min((now-last)/1000,.1):0;last=now;
    if(game.status==='running'){
      acc+=dt;
      while(acc>=1/60){
        const x=(keys.has('arrowright')||keys.has('d')?1:0)-(keys.has('arrowleft')||keys.has('a')?1:0);
        const y=(keys.has('arrowdown')||keys.has('s')?1:0)-(keys.has('arrowup')||keys.has('w')?1:0);
        M.update(game,1/60,{x,y,target});acc-=1/60;handleEvents();
      }
      particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;});particles=particles.filter(p=>p.life>0);
      labels.forEach(p=>{p.y-=18*dt;p.life-=dt;});labels=labels.filter(p=>p.life>0);shake=Math.max(0,shake-dt);
    }
    ctx.save();if(shake&&!reduced)ctx.translate(Math.sin(now*.11)*3,Math.cos(now*.13)*3);
    PixelWorld.draw(ctx,game,{time:game.elapsed,enhanced,reduced,moving:game.status==='running'&&(keys.size||target)});
    particles.forEach(p=>{ctx.globalAlpha=Math.min(1,p.life*2);ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,4,4);});ctx.globalAlpha=1;
    labels.forEach(p=>{ctx.font='bold 16px Noto,sans-serif';ctx.textAlign='center';ctx.fillStyle='#142332';ctx.fillRect(p.x-53,p.y-19,106,25);ctx.fillStyle=p.color;ctx.fillText(p.text,p.x,p.y);});ctx.restore();
    if(now>toastUntil)$('toast').classList.remove('visible');hud();raf=requestAnimationFrame(frame);
  }
  document.addEventListener('keydown',e=>{
    if(e.target.matches('input,textarea,button')||$('taskDialog').open)return;
    const k=e.key.toLowerCase();
    if(['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d'].includes(k)){e.preventDefault();keys.add(k);target=null;}
    if(k==='p'){e.preventDefault();game.status==='running'?pause():game.status==='paused'&&play();}
    if(k==='escape'){pause();if(parent!==window)parent.postMessage({type:'ARCADE_CLOSE'},'*');}
  });
  document.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
  function point(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width*960,y:(e.clientY-r.top)/r.height*540};}
  canvas.addEventListener('pointerdown',e=>{if(game.status!=='running')return;e.preventDefault();stage.focus({preventScroll:true});canvas.setPointerCapture(e.pointerId);target=point(e);});
  canvas.addEventListener('pointermove',e=>{if(canvas.hasPointerCapture(e.pointerId))target=point(e);});
  canvas.addEventListener('pointercancel',()=>target=null);
  $('overlayStart').onclick=play;$('pause').onclick=()=>game.status==='running'?pause():play();$('restart').onclick=()=>reset();
  document.querySelectorAll('[data-version]').forEach(b=>b.onclick=()=>reset(b.dataset.version));
  $('feedback').onchange=e=>{enhanced=e.target.checked;if(!enhanced){particles=[];labels=[];shake=0;}};
  $('motion').onchange=e=>{reduced=e.target.checked;document.body.classList.toggle('reduced-motion',reduced);if(reduced){particles=[];shake=0;}};
  $('sound').onchange=async e=>{sound=e.target.checked;if(sound){try{const Audio=window.AudioContext||window.webkitAudioContext;audio=audio||new Audio();if(game.status==='running')await audio.resume();}catch{sound=false;e.target.checked=false;tell('当前浏览器不支持音效，仍可静音试玩。');}}else if(audio)audio.suspend().catch(()=>{});};
  $('clearResults').onclick=()=>{history=[];try{sessionStorage.removeItem('miner-real-runs-v1');}catch{}results();};
  function task(){return `【教学任务模板 · 非 AI 回答】\n项目：像素矿工，原生 HTML / CSS / JavaScript，离线运行。\n先读取：lab-model.js、lab.js 和 tests/model.test.cjs，复述现有规则，暂不修改。\n体验目标：${game.version==='A'?'让玩家立即理解“捡矿石 → 得分”的基本循环。':'让玩家在“继续采集”和“回基地保住收益”之间做选择。'}\n修改范围：玩法状态与计分逻辑；保留地图、速度、45 秒时限、输入方式与巡逻轨迹。\n规则：${game.version==='A'?'每块矿石 10 分，拾取立即入账。遇险返回基地，不扣已入账分。':'每块矿石 10 分，先计入背包；返回基地后转入已入账分；遇险清空背包，不扣已入账分。'}\n验收：1. 采集一块后分数符合规则；2. 遇险与回基地分别测试；3. 45 秒自动结束，未带回分数单列；4. 暂停不走时，重开地图一致。\n请先给最小修改计划；确认后再执行。完成后回报改动、实测结果和未验证项。`;}
  $('taskButton').onclick=()=>{pause();$('taskText').value=task();$('copyStatus').textContent='';$('taskDialog').showModal();};
  $('closeTask').onclick=()=>$('taskDialog').close();
  $('copyTask').onclick=async()=>{try{await navigator.clipboard.writeText($('taskText').value);$('copyStatus').textContent='已复制';}catch{$('taskText').select();try{$('copyStatus').textContent=document.execCommand('copy')?'已复制':'请按 Ctrl+C 复制';}catch{$('copyStatus').textContent='请按 Ctrl+C 复制';}}};
  window.addEventListener('blur',pause);document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
  if('IntersectionObserver' in window)new IntersectionObserver(entries=>{if(entries[0].intersectionRatio<.35)pause();},{threshold:[.35]}).observe(stage);
  window.addEventListener('message',e=>{if(e.source!==parent)return;if(e.data?.type==='ARCADE_PAUSE')pause();if(e.data?.type==='ARCADE_DISPOSE'){pause();disposed=true;cancelAnimationFrame(raf);if(audio)audio.close().catch(()=>{});}});
  window.addEventListener('pagehide',()=>{disposed=true;cancelAnimationFrame(raf);if(audio)audio.close().catch(()=>{});});
  ready();results();raf=requestAnimationFrame(frame);
})();
