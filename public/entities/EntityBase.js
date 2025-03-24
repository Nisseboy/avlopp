class EntityBase {
  constructor(pos, type) {
    this.pos = pos;
    this.dir = 0;
    this.speedMult = 1;
    
    this.type = type;

    this.size = undefined;
    this.speed = undefined;
    this.texture = undefined;

    this.slotAmount = 1;
    this.slots = [];
    this.slot = 0;

    this.id = generateID();
    this.displayName = undefined;

    //For interpolating movement
    this.lerpDiffPos = new Vec(0, 0);
    this.lerpNewPos = new Vec(0, 0);
    if (this.pos) this.lerpNewPos.from(this.pos);
    this.lerpDiffDir = 0;
    this.lerpNewDir = this.dir;
    this.lerpMoveTime = 1;
  }

  move(movement, dt) {
    if (movement.sqMag() < 0.01) return false;


    let delta = movement._mul(dt);

    let hitInfo;

    hitInfo = world.raycast(this.pos, Math.PI * (1 - Math.sign(delta.x)) / 2, false, true, delta.x);
    if (hitInfo.hit) delta.x = (hitInfo.length - 0.005) * Math.sign(delta.x);
    if (Math.abs(delta.x) < 0.01) delta.x = 0;
    this.pos.x += delta.x;
  
    hitInfo = world.raycast(this.pos, Math.PI * Math.sign(delta.y) / 2, false, true, delta.y);
    if (hitInfo.hit) delta.y = (hitInfo.length - 0.005) * Math.sign(delta.y);
    if (Math.abs(delta.y) < 0.01) delta.y = 0;
    this.pos.y += delta.y;


    let diff = getDeltaAngle((Math.atan2(movement.y, movement.x)), this.dir);
    this.dir -= diff * 10 * dt;

    return delta.x != 0 || delta.y != 0;
  }

  checkSolid(pos) {
    if (pos.x < 0 || pos.y < 0 || pos.x >= world.size.x || pos.y >= world.size.y) return true;

    return materials[world.grid[pos.x + pos.y * world.size.x]].solid;
  }

  lerpData(dt) {
    if (this.lerpMoveTime < 1 && this.lerpMoveTime >= 0) {
      this.lerpMoveTime += dt / lastUpdateTime * 1000;
      if (this.lerpNewPos.x != 0) this.pos.from(this.lerpNewPos).subV(this.lerpDiffPos._mul(1-this.lerpMoveTime));
      if (this.lerpNewDir != 0) this.dir = this.lerpNewDir - this.lerpDiffDir * (1-this.lerpMoveTime);
    } if (this.lerpMoveTime >= 1) {
      if (this.lerpNewPos.x != 0) this.pos.from(this.lerpNewPos);
      if (this.lerpNewDir != 0) this.dir = this.lerpNewDir;
      this.lerpMoveTime = -1;

      this.lerpNewPos.set(0, 0);
      this.lerpNewDir = 0;
      
    }
  }

  serverUpdate(dt) {

  }
  clientUpdate(dt) {

  }

  load() {}
  unload() {}

  render(pos) {
    renderer.save();
    renderer.translate(pos);

    renderer.save();

    renderer.rotate(this.dir);
    renderer.translate(this.size._mul(-0.5));
    renderer.image(tex[this.texture], vecZero, this.size);

    renderer.restore();

    if (this.displayName && this.type != "EntityPlayer") {
      renderer.set("font", "0.3px monospace");
      if (this.color) renderer.set("fill", this.color);
      else renderer.set("fill", "rgb(255, 255, 255)");
      renderer.set("textAlign", ["center", "bottom"]);
      renderer.text(this.displayName, new Vec(0, -this.size.y / 2));
    }

    renderer.restore();
  }

  from(data) {
    if (data.pos) this.pos = new Vec().from(data.pos); else this.pos = new Vec(0, 0);
    if (data.dir) this.dir = data.dir;
    if (data.id) this.id = data.id; else this.id = generateID();
    if (data.slots) this.slots = data.slots;
    if (data.slot) this.slot = data.slot;
    if (data.displayName) this.displayName = data.displayName;

    return this;
  }

  getHeldItem() {
    if (this.slotAmount == 0) return undefined;

    let held = this.slots[this.slot];
    if (held == undefined) return undefined;

    return idLookup[held];
  }
}






function cloneEntity(data, typeOverride = undefined) {
  let type = typeOverride != undefined ? typeOverride : data.type;

  let e = new (eval(type))(data.pos, type).from(data);

  return e;
}



if (global) {
  global.EntityBase = EntityBase;
  global.cloneEntity = cloneEntity;
}