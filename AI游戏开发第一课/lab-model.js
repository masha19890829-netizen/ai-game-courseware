/* Deterministic simulation. Rendering, sound and feedback never change the rules. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MinerModel = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const WIDTH = 960, HEIGHT = 540, DURATION = 45, SPEED = 170;
  const BASE = { x: 120, y: 290, radius: 63 };
  const ORE_POINTS = [[266,175],[292,365],[402,109],[445,284],[450,425],
    [578,151],[599,341],[686,440],[762,111],[813,265],[840,424],[704,283]];
  function rng(seed) {
    let n = seed >>> 0;
    return function () { n = (Math.imul(n, 1664525) + 1013904223) >>> 0; return n / 4294967296; };
  }
  function createGame(version = 'A', seed = 5050) {
    const random = rng(seed);
    return { version: version === 'B' ? 'B' : 'A', seed, status: 'ready', elapsed: 0,
      player: { x: BASE.x, y: BASE.y, invulnerable: 0, facing: 1 },
      ores: ORE_POINTS.map(([x,y], id) => ({id, x: x + Math.floor(random()*13)-6,
        y: y + Math.floor(random()*13)-6, cooldown: 0})),
      collected: 0, banked: 0, carried: 0, lost: 0, returns: 0, hits: 0,
      insideBase: true, events: [], finished: false };
  }
  function hazards(time) {
    return [{x:510+155*Math.sin(time*.7),y:222},
      {x:622+160*Math.sin(time*.61+2),y:371},
      {x:785,y:240+118*Math.sin(time*.64+1)}];
  }
  function start(g) { if (g.status === 'ready') g.status = 'running'; }
  function pause(g) { if(g.status === 'running') g.status = 'paused'; }
  function resume(g) { if(g.status === 'paused') g.status = 'running'; }
  function collect(g, ore) {
    if(ore.cooldown > 0) return;
    ore.cooldown = DURATION; g.collected++;
    if(g.version === 'A') g.banked += 10; else g.carried += 10;
    g.events.push({type:'collect',x:ore.x,y:ore.y,value:10});
  }
  function hit(g) {
    if(g.player.invulnerable > 0) return;
    const amount = g.carried;
    g.lost += amount; g.carried = 0; g.hits++;
    g.events.push({type:'hit',x:g.player.x,y:g.player.y,value:amount});
    g.player.x = BASE.x; g.player.y = BASE.y; g.player.invulnerable = 1.5;
    g.insideBase = true;
  }
  function finish(g) {
    if(g.finished) return;
    g.finished = true; g.status = 'ended'; g.elapsed = DURATION;
    g.events.push({type:'finish'});
  }
  function update(g, dt, input = {}) {
    if(g.status !== 'running' || dt <= 0) return;
    dt = Math.min(dt, .1, DURATION - g.elapsed);
    g.elapsed += dt;
    const p = g.player;
    p.invulnerable = Math.max(0,p.invulnerable-dt);
    let dx = input.x || 0, dy = input.y || 0;
    if(!dx && !dy && input.target) {
      const tx = input.target.x-p.x, ty=input.target.y-p.y, distance=Math.hypot(tx,ty);
      if(distance > 3) { const scale=Math.min(1,distance/(SPEED*dt||1)); dx=tx/distance*scale;dy=ty/distance*scale; }
    }
    const length = Math.hypot(dx,dy);
    if(length>1) {dx/=length;dy/=length;}
    if(dx) p.facing = dx>0?1:-1;
    p.x=Math.max(37,Math.min(WIDTH-37,p.x+dx*SPEED*dt));
    p.y=Math.max(63,Math.min(HEIGHT-42,p.y+dy*SPEED*dt));
    for(const ore of g.ores) {
      ore.cooldown=Math.max(0,ore.cooldown-dt);
      if(!ore.cooldown && Math.hypot(p.x-ore.x,p.y-ore.y)<24) collect(g,ore);
    }
    const inside = Math.hypot(p.x-BASE.x,p.y-BASE.y) < BASE.radius;
    if(inside && !g.insideBase) g.returns++;
    if(inside && g.carried) {
      const amount=g.carried;g.banked+=amount;g.carried=0;
      g.events.push({type:'bank',x:p.x,y:p.y,value:amount});
    }
    g.insideBase=inside;
    if(!inside) for(const enemy of hazards(g.elapsed)) {
      if(Math.hypot(p.x-enemy.x,p.y-enemy.y)<27) {hit(g);break;}
    }
    if(g.elapsed>=DURATION-1e-8) finish(g);
  }
  function result(g) {
    if(!g.finished) return null;
    return {version:g.version,seed:g.seed,collected:g.collected,banked:g.banked,
      lost:g.lost,unbanked:g.carried,returns:g.returns,hits:g.hits,duration:DURATION};
  }
  return {WIDTH,HEIGHT,DURATION,SPEED,BASE,rng,createGame,hazards,start,pause,resume,update,result};
});
