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

    this.id = Math.floor(Math.random() * 100000000);
  }

  doMovement(dt) {
    if (this.movement.sqMag() < 0.01) return;

    let delta = this.movement._mul(this.speed * this.speedMult * dt);
    this.pos.x += delta.x;
    if (this.checkSolid(this.pos._floor())) this.pos.x -= delta.x;
    this.pos.y += delta.y;
    if (this.checkSolid(this.pos._floor())) this.pos.y -= delta.y;

    let diff = getDeltaAngle((Math.atan2(this.movement.y, this.movement.x)), this.dir);
    this.dir -= diff * 10 * dt;
  }

  checkSolid(pos) {
    let world = scenes.game.world;
    if (pos.x < 0 || pos.y < 0 || pos.x >= world.size.x || pos.y >= world.size.y) return true;

    return materials[world.grid[pos.x + pos.y * world.size.x]].solid;
  }

  update(dt) {
    this.doMovement(dt);
  }

  render(pos) {
    renderer.save();
    
    renderer.translate(pos);
    renderer.rotate(this.dir);
    renderer.translate(this.size._mul(-0.5));
    renderer.image(tex[this.texture], vecZero, this.size);

    renderer.restore();
  }

  from(data) {
    this.pos = new Vec().from(data.pos);
    this.dir = data.dir;

    this.id = data.id;

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



if (global) global.EntityBase = EntityBase;