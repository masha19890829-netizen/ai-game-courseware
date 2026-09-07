(function(){
  'use strict';
  const C=window.TUTORIAL_BUILD,M=window.TutorialModel,$=id=>document.getElementById(id),canvas=$('game'),ctx=canvas.getContext('2d');
  let g=M.createGame(C.stage,5050,!!C.fault),raf=0,last=0,keys={},target=null,disposed=false,enhanced=true,sound=false,audio=null,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const labels=['','01 · 第一版 / 30 秒','02 · 只改时间 / 45 秒','03 · 增加巡逻危险','04 · 带回基地才入账'];
  const rule=C.stage<3?'碰到一块黄色矿石 +10 分，矿石消失。':C.stage===3?'捡矿立即 +10 分。碰到带 ! 的巡逻怪返回基地，已得分不扣。':'矿石先放入背包。回到 BASE 虚线框内存分；遇险丢失背包，已入账分不扣。';
  $('build').textContent=C.fault?'教学故障样本 · 故意把 10 分写成 20 分':labels[C.stage];$('rules').textContent=rule;
  $('faultBanner').hidden=!C.fault;$('carryCell').hidden=C.stage!==4;$('feedback').hidden=C.stage<3;
  function clearInput(){keys={};target=null;}
  function beep(type){if(!sound)return;try{audio??=new (window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();const o=audio.createOscillator(),v=audio.createGain();o.type='square';o.frequency.value=type==='hit'?140:650;o.connect(v);v.connect(audio.destination);v.gain.setValueAtTime(.025,audio.currentTime);v.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.1);o.start();o.stop(audio.currentTime+.1);}catch{sound=false;$('sound').textContent='声音不可用';}}
  function halt(){cancelAnimationFrame(raf);raf=0;last=0;}
  function paint(){window.PixelWorld.draw(ctx,g,{time:g.elapsed,danger:C.stage>=3,gold:true,reduced,enhanced,moving:Object.keys(keys).length>0});$('timer').textContent=Math.ceil(g.duration-g.elapsed);$('score').textContent=g.banked;$('carry').textContent=g.carried;$('pause').disabled=!['running','paused'].includes(g.status);$('pause').textContent=g.status==='paused'?'继续 / P':'暂停 / P';$('start').textContent=g.status==='ready'?'开始游戏':'重新开始';
    const o=$('overlay');o.hidden=g.status==='running';if(g.status==='ready')o.innerHTML='<div><h2>像素矿工</h2><p>方向键 / WASD 移动，也可以点地面。</p><p>点击下方「开始游戏」 · '+g.duration+' 秒一局</p></div>';
    if(g.status==='paused')o.innerHTML='<div><h2>已暂停</h2><p>计时与巡逻都停止。点击「继续」或按 P。</p></div>';
    if(g.status==='ended')o.innerHTML='<div><h2>时间到 · 本局结束</h2><div class="result-grid"><span><b>'+g.collected+'</b>采集块数</span><span><b>'+g.banked+'</b>入账分数</span><span><b>'+g.lost+'</b>碰撞损失</span><span><b>'+g.carried+'</b>未带回</span><span><b>'+g.returns+'</b>返回次数</span></div><p>点击「重新开始」再试一次。这里是真实本局结果。</p></div>';
  }
  function events(){for(const e of g.events.splice(0)){if(e.type==='hit'){target=null;$('notice').textContent='遇险返回基地'+(C.stage===4?'，背包损失 '+e.value+' 分':'，已得分保留');}else if(e.type==='bank')$('notice').textContent='存入 '+e.value+' 分！背包已清空。';else if(e.type==='collect')$('notice').textContent=(C.stage===4?'背包':'得分')+' +'+e.value+(C.fault?'（注意：要求是一块 10 分）':'');else if(e.type==='finish')$('notice').textContent='本局已结束，移动和计分停止。';if(enhanced&&e.type!=='finish'){beep(e.type);if(!reduced){const p=document.createElement('span');p.className='pop';p.textContent=e.type==='hit'?'!':'+'+e.value;p.style.left=(e.x/960*100)+'%';p.style.top=(e.y/540*100)+'%';$('pops').append(p);setTimeout(()=>p.remove(),750);}}}}
  function tick(now){if(disposed||g.status!=='running'){halt();return;}const dt=last?(now-last)/1000:0;last=now;M.update(g,dt,{x:(keys.ArrowRight||keys.d?1:0)-(keys.ArrowLeft||keys.a?1:0),y:(keys.ArrowDown||keys.s?1:0)-(keys.ArrowUp||keys.w?1:0),target});events();paint();if(g.status==='running')raf=requestAnimationFrame(tick);else halt();}
  function run(){if(!raf&&!disposed){last=0;raf=requestAnimationFrame(tick);}}
  function pause(){if(g.status==='running'){M.pause(g);clearInput();halt();audio?.suspend();paint();}}
  $('start').onclick=()=>{g=M.createGame(C.stage,5050,!!C.fault);clearInput();$('notice').textContent='每块矿石 10 分。先靠近左上方第一块。';$('pops').replaceChildren();halt();M.start(g);paint();canvas.focus();run();};
  function toggle(){if(g.status==='paused'){M.resume(g);paint();canvas.focus();run();}else pause();}
  $('pause').onclick=toggle;$('sound').onclick=()=>{sound=!sound;$('sound').textContent=sound?'声音：开':'声音：关';if(sound)beep('collect');else audio?.suspend();};
  $('feedback').onclick=()=>{enhanced=!enhanced;$('feedback').textContent=enhanced?'表现：强化':'表现：基础';document.body.classList.toggle('plain',!enhanced);paint();};
  document.addEventListener('keydown',e=>{const key=e.key.length===1?e.key.toLowerCase():e.key;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','w','a','s','d','p'].includes(key)&&!['INPUT','TEXTAREA'].includes(e.target.tagName)){e.preventDefault();e.stopPropagation();if(key==='p'){if(!e.repeat)toggle();}else{keys[key]=true;target=null;}}});document.addEventListener('keyup',e=>{delete keys[e.key.length===1?e.key.toLowerCase():e.key];});
  function point(e){const r=canvas.getBoundingClientRect();target={x:(e.clientX-r.left)/r.width*960,y:(e.clientY-r.top)/r.height*540};}
  canvas.addEventListener('pointerdown',e=>{if(g.status==='running'){canvas.focus();point(e);canvas.setPointerCapture(e.pointerId);}});canvas.addEventListener('pointermove',e=>{if(e.buttons&&g.status==='running')point(e);});
  window.addEventListener('blur',pause);document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
  function dispose(){disposed=true;pause();halt();audio?.close();}
  window.addEventListener('pagehide',dispose);window.addEventListener('message',e=>{if(e.source!==window.parent)return;if(e.data?.type==='ARCADE_PAUSE')pause();if(e.data?.type==='ARCADE_DISPOSE')dispose();});
  if('IntersectionObserver'in window)new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)pause();},{threshold:.1}).observe(canvas);
  paint();
})();
