/* Pure, deterministic rules for the four downloadable teaching builds. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TutorialModel=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const WIDTH=960,HEIGHT=540,SPEED=170,BASE={x:120,y:290,radius:63};
  const POINTS=[[266,175],[292,365],[402,109],[445,284],[450,425],[578,151],[599,341],[686,440],[762,111],[813,265],[840,424],[704,283]];
  function rng(seed){let n=seed>>>0;return()=>((n=(Math.imul(n,1664525)+1013904223)>>>0)/4294967296);}
  function createGame(stage=1,seed=5050,fault=false){stage=[1,2,3,4].includes(stage)?stage:1;const r=rng(seed);return {stage,seed,fault,duration:stage===1?30:45,version:stage===4?'B':'A',status:'ready',elapsed:0,player:{x:BASE.x,y:BASE.y,invulnerable:0,facing:1},ores:POINTS.map(([x,y],id)=>({id,x:x+Math.floor(r()*13)-6,y:y+Math.floor(r()*13)-6,cooldown:0})),collected:0,banked:0,carried:0,lost:0,returns:0,hits:0,insideBase:true,events:[],finished:false};}
  function hazards(t){return [{x:510+155*Math.sin(t*.7),y:222},{x:622+160*Math.sin(t*.61+2),y:371},{x:785,y:240+118*Math.sin(t*.64+1)}];}
  function start(g){if(g.status==='ready')g.status='running';}
  function pause(g){if(g.status==='running')g.status='paused';}
  function resume(g){if(g.status==='paused')g.status='running';}
  function hit(g){if(g.player.invulnerable>0)return;const n=g.carried;g.lost+=n;g.carried=0;g.hits++;g.events.push({type:'hit',value:n,x:g.player.x,y:g.player.y});Object.assign(g.player,{x:BASE.x,y:BASE.y,invulnerable:1.5});g.insideBase=true;}
  function update(g,dt,input={}){
    if(g.status!=='running'||!Number.isFinite(dt)||dt<=0)return;
    dt=Math.min(dt,.1,g.duration-g.elapsed);g.elapsed+=dt;const p=g.player;p.invulnerable=Math.max(0,p.invulnerable-dt);
    let dx=input.x||0,dy=input.y||0;
    if(!dx&&!dy&&input.target){const x=input.target.x-p.x,y=input.target.y-p.y,d=Math.hypot(x,y);if(d>3){const scale=Math.min(1,d/(SPEED*dt||1));dx=x/d*scale;dy=y/d*scale;}}
    const len=Math.hypot(dx,dy);if(len>1){dx/=len;dy/=len;}if(dx)p.facing=dx>0?1:-1;
    p.x=Math.max(37,Math.min(WIDTH-37,p.x+dx*SPEED*dt));p.y=Math.max(63,Math.min(HEIGHT-42,p.y+dy*SPEED*dt));
    for(const ore of g.ores)if(!ore.cooldown&&Math.hypot(p.x-ore.x,p.y-ore.y)<24){ore.cooldown=1;g.collected++;const n=g.fault?20:10;if(g.stage===4)g.carried+=n;else g.banked+=n;g.events.push({type:'collect',x:ore.x,y:ore.y,value:n});}
    const inside=Math.hypot(p.x-BASE.x,p.y-BASE.y)<BASE.radius;if(inside&&!g.insideBase)g.returns++;
    if(inside&&g.carried){g.banked+=g.carried;g.events.push({type:'bank',value:g.carried,x:p.x,y:p.y});g.carried=0;}g.insideBase=inside;
    if(g.stage>=3&&!inside)for(const enemy of hazards(g.elapsed))if(Math.hypot(p.x-enemy.x,p.y-enemy.y)<27){hit(g);break;}
    if(g.elapsed>=g.duration-1e-8){g.elapsed=g.duration;g.finished=true;g.status='ended';g.events.push({type:'finish'});}
  }
  function result(g){return g.finished?{stage:g.stage,version:g.version,seed:g.seed,duration:g.duration,collected:g.collected,banked:g.banked,unbanked:g.carried,lost:g.lost,returns:g.returns,hits:g.hits}:null;}
  return {WIDTH,HEIGHT,SPEED,BASE,rng,createGame,hazards,start,pause,resume,update,result};
});
