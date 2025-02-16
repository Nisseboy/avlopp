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

    this.pos.addV(this.movement._mul(this.speed * this.speedMult * dt));

    let diff = getDeltaAngle((Math.atan2(this.movement.y, this.movement.x)), this.dir);
    this.dir -= diff * 10 * dt;
  }

  update(dt) {
    this.doMovement(dt);
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