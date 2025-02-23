class EntityBase {
  constructor(pos, type) {
    this.pos = pos;
    this.dir = 0;
    this.speedMult = 1;
    this.movement = new Vec(0, 0);

    
    this.type = type;

    this.size = undefined;
    this.speed = undefined;
    this.texture = undefined;

    this.slotAmount = 1;
    this.slots = [];
    this.slot = 0;


    this.id = generateID();
  }

  doMovement(dt, world) {
    if (this.movement.sqMag() < 0.01) return false;


    let delta = this.movement._mul(this.speed * this.speedMult * dt);

    let hitInfo;

    hitInfo = world.raycast(this.pos, Math.PI * (1 - Math.sign(delta.x)) / 2, delta.x);
    if (hitInfo.hit) delta.x = (hitInfo.length - 0.005) * Math.sign(delta.x);
    if (Math.abs(delta.x) < 0.01) delta.x = 0;
    this.pos.x += delta.x;
  
    hitInfo = world.raycast(this.pos, Math.PI * Math.sign(delta.y) / 2, delta.y);
    if (hitInfo.hit) delta.y = (hitInfo.length - 0.005) * Math.sign(delta.y);
    if (Math.abs(delta.y) < 0.01) delta.y = 0;
    this.pos.y += delta.y;


    let diff = getDeltaAngle((Math.atan2(this.movement.y, this.movement.x)), this.dir);
    this.dir -= diff * 10 * dt;

    return delta.x != 0 || delta.y != 0;
  }

  checkSolid(pos, world) {
    if (pos.x < 0 || pos.y < 0 || pos.x >= world.size.x || pos.y >= world.size.y) return true;

    return materials[world.grid[pos.x + pos.y * world.size.x]].solid;
  }

  serverUpdate(dt, world) {
    this.doMovement(dt, world);
  }
  clientUpdate(dt, world) {

  }

  load() {}
  unload() {}

  render(pos) {
    renderer.save();
    
    renderer.translate(pos);
    renderer.rotate(this.dir);
    renderer.translate(this.size._mul(-0.5));
    renderer.image(tex[this.texture], vecZero, this.size);

    renderer.restore();
  }

  from(data) {
    if (data.pos) this.pos = new Vec().from(data.pos); else this.pos = new Vec(0, 0);
    if (data.dir) this.dir = data.dir; else this.dir = 0;
    if (data.id) this.id = data.id; else this.id = generateID();
    if (data.slots) this.slots = data.slots; else this.slots = [];
    if (data.slot) this.slot = data.slot; else this.slot = 0;

    return this;
  }
}


/*

this.stepCooldown = undefined;
this.currentStepCooldown = undefined;


doMovement(dt) {
  if (this.movement.sqMag() > 0 && this.currentStepCooldown <= 0) {
    let mag = this.movement.mag();

    this.dir = Math.atan2(this.movement.y, this.movement.x) + ((Math.random() - 0.5) * 0.5 * mag);
    
    this.pos.addV(new Vec(Math.cos(this.dir), Math.sin(this.dir)).mul(this.speed * this.stepCooldown * mag));
    
    this.currentStepCooldown = this.stepCooldown;
  }
  
  this.currentStepCooldown -= dt * this.speedMult;
}
*/




function cloneEntity(data, typeOverride = undefined) {
  let type = typeOverride != undefined ? typeOverride : data.type;

  let e = new (eval(type))(data.pos, type).from(data);

  return e;
}



if (global) {
  global.EntityBase = EntityBase;
  global.cloneEntity = cloneEntity;
}