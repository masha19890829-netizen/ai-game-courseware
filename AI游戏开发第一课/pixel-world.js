(function(root){
  'use strict';
  const P={ink:'#10212c',dark:'#132c37',floor:'#1d3a42',rock:'#32505a',edge:'#497177',mint:'#8ce5b3',gold:'#ffd46b',cream:'#fff0cd',red:'#f37672'};
  const miner=['0000011111100000','0001122222211000','0012222222222100','0111113333111110','0001444444410000','0001451445410000','0001444444410000','0000144444100000','0001555555110000','0015566655551000','0145566655544100','0141566655144100','0001777777100000','0001770077100000','0011880088110000','0011110011110000'];
  const slime=['0000001111000000','0000112222110000','0001222222221000','0012233223322100','0122233223322210','0122222222222210','0122224444222210','0012222222222100','0011111111111100'];
  function rect(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h);}
  function sprite(c,data,x,y,s,colors,flip=false){c.save();c.translate(Math.round(x),Math.round(y));if(flip){c.translate(data[0].length*s,0);c.scale(-1,1);}data.forEach((r,j)=>[...r].forEach((v,i)=>{if(v!=='0')rect(c,i*s,j*s,s,s,colors[+v]);}));c.restore();}
  function crystal(c,x,y,small=false,phase=0,gold=false){
    const s=small?.6:1, yy=y+(Math.sin(phase)*2);
    c.save();c.translate(Math.round(x),Math.round(yy));c.scale(s,s);
    if(gold){rect(c,-15,14,30,6,'#102b35');rect(c,-9,-12,18,29,'#ab743b');rect(c,-6,-21,12,36,'#ffcc64');rect(c,-3,-25,6,37,'#fff0aa');rect(c,-15,-2,8,18,'#d79340');rect(c,10,-8,7,22,'#ffc35b');c.restore();return;}
    rect(c,-17,14,34,7,'#102b35');rect(c,-9,-16,18,33,'#226665');
    rect(c,-6,-22,12,40,'#65c991');rect(c,-3,-25,6,44,'#b0f3bd');
    rect(c,0,-13,8,25,'#90e8ad');rect(c,-15,-2,8,18,'#3a997e');rect(c,10,-8,7,22,'#61cba1');
    rect(c,-3,-19,4,12,'#e9ffcf');c.restore();
  }
  function draw(c,g,options={}){
    const t=options.reduced?0:(options.time||0), enhanced=options.enhanced!==false;
    c.imageSmoothingEnabled=false;
    rect(c,0,0,960,540,P.ink);
    // A hand-built pixel mine: surface horizon, cut rock strata and luminous ore.
    rect(c,0,0,960,48,'#25394a');
    for(let i=0;i<30;i++){const h=14+((i*13)%21);rect(c,i*32,48-h,35,h,'#43636a');rect(c,i*32,45,32,6,'#627c70');}
    rect(c,28,54,904,448,P.floor);
    for(let y=56;y<510;y+=24)for(let x=30;x<930;x+=24){const n=(x*17+y*31)%127;
      if(n<35)rect(c,x,y,22,22,'#203f45');else if(n<58)rect(c,x+4,y+5,6,3,'#2a4950');
      if(n>116)rect(c,x+9,y+13,3,3,'#42625f');}
    // Footpath from the lift to the deeper mine.
    for(let x=80;x<860;x+=25){rect(c,x,284+Math.round(Math.sin(x*.014)*20),23,18,'#29474a');rect(c,x+5,307+Math.round(Math.sin(x*.014)*20),16,5,'#355257');}
    // Border stones.
    for(let x=0;x<960;x+=32){for(const y of [48,509]){rect(c,x,y,30,28,'#29434f');rect(c,x+3,y+2,24,7,'#45636c');rect(c,x+25,y+9,5,17,'#1b313c');}}
    for(let y=72;y<510;y+=32)for(const x of [0,932]){rect(c,x,y,28,30,'#29434f');rect(c,x+2,y,7,27,'#45636c');}
    // Edge vegetation, rocks and mining details: outside playable centre.
    for(let i=0;i<18;i++){let x=48+i*49,y=i%2?488:77;rect(c,x,y,18,9,'#172f39');rect(c,x+3,y-5,12,8,'#4b6768');rect(c,x+6,y-7,7,3,'#6c8580');}
    for(const [x,y] of [[193,103],[353,468],[553,84],[883,470],[883,107]]){
      rect(c,x,y,4,17,'#1c6456');rect(c,x-6,y+3,7,4,'#49a375');rect(c,x+3,y-3,7,4,'#77c087');
    }
    // Rail line and mine elevator.
    rect(c,90,58,5,175,'#889087');rect(c,143,58,5,175,'#889087');
    for(let y=70;y<230;y+=25)rect(c,83,y,72,7,'#665843');
    rect(c,49,219,143,134,'#132b35');rect(c,55,225,130,122,'#2e544e');
    c.strokeStyle='#72b59c';c.lineWidth=3;c.setLineDash([7,6]);c.strokeRect(58,228,125,116);c.setLineDash([]);
    rect(c,70,230,103,9,'#e7bd69');rect(c,68,229,10,41,'#987651');rect(c,164,229,10,41,'#987651');
    rect(c,91,322,59,24,'#5a5746');rect(c,95,325,51,5,'#cda95a');rect(c,111,318,19,12,'#e4cb80');
    c.fillStyle='#a3d8b4';c.font='bold 14px monospace';c.textAlign='center';c.fillText(options.danger===false?'START':'BASE',121,256);
    // Patrol tracks are readable before a hit.
    c.strokeStyle='#e27c6640';c.lineWidth=2;c.setLineDash([5,9]);
    c.beginPath();if(options.danger!==false){c.moveTo(355,222);c.lineTo(665,222);c.moveTo(462,371);c.lineTo(782,371);c.moveTo(785,122);c.lineTo(785,358);}c.stroke();c.setLineDash([]);
    for(const ore of g.ores){
      if(ore.cooldown){rect(c,ore.x-10,ore.y+13,20,5,'#30545a');continue;}
      if(enhanced){c.fillStyle='#83e2a40c';c.fillRect(ore.x-27,ore.y-28,54,55);}
      crystal(c,ore.x,ore.y,false,t*2+ore.id,!!options.gold);
    }
    const enemies=options.danger===false?[]:root.MinerModel.hazards(g.elapsed);
    enemies.forEach((e,i)=>{
      rect(c,e.x-20,e.y+13,40,7,'#102b33');
      const squish=options.reduced?0:Math.round(Math.sin(t*6+i)*2);
      sprite(c,slime,e.x-24,e.y-15+squish,3,['','#291f34','#d56568','#ffe6bd','#6b354b']);
      c.fillStyle=P.gold;c.font='bold 16px monospace';c.textAlign='center';c.fillText('!',e.x,e.y-23);
    });
    const p=g.player;
    rect(c,p.x-16,p.y+15,33,6,'#0e2730');
    const blink=p.invulnerable>0&&Math.floor(t*14)%2;
    if(!blink){
      const bob=options.moving&&!options.reduced?Math.round(Math.sin(t*17)*2):0;
      sprite(c,miner,p.x-20,p.y-25+bob,2.5,['','#1b2633','#edb95d','#fff5bf','#e5b485','#64a9a0','#304f5b','#35415e','#907f73'],p.facing<0);
      if(g.carried){rect(c,p.x-27,p.y-4,10,17,'#bd9761');rect(c,p.x-26,p.y-10,8,10,'#9feaab');}
    }
    // Atmospheric fixtures; their glow never obscures the game.
    for(const [x,y] of [[24,164],[920,166],[24,432],[920,435]]){
      rect(c,x,y,12,20,'#6c5545');rect(c,x-3,y-7,18,13,'#b8784e');rect(c,x,y-12,12,15,P.gold);rect(c,x+3,y-15,6,12,P.cream);
    }
    c.textAlign='left';c.font='bold 11px monospace';c.fillStyle='#9ab4a4';c.fillText('MINING SECTOR / 5050',40,32);
    c.textAlign='right';c.fillStyle=P.gold;c.fillText('01  /  CRYSTAL CAVERN',918,32);
  }
  root.PixelWorld={draw,crystal,sprite,miner};
})(typeof globalThis!=='undefined'?globalThis:this);
