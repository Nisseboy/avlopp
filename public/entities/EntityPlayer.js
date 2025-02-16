

class EntityPlayer extends EntityBase {
  constructor(pos, type) {
    super(pos, type);

    this.size = new Vec(1, 1);
    this.speed = 4;
    this.texture = "duck/1";
  }
}


class EntityPlayerOther extends EntityPlayer {
  constructor(pos, type) {
    super(pos, type);

    this.diffPos = undefined;
    this.newPos = new Vec().from(pos);
    this.moveTime = 1;
  }

  update(dt) {
    if (this.moveTime < 1 && this.moveTime >= 0) {
      this.moveTime += dt / constants.updateInterval * 1000;
      this.pos = this.newPos._subV(this.diffPos._mul(1-this.moveTime));
    } if (this.moveTime >= 1) {
      this.pos.from(this.newPos);
      this.moveTime = -1;
    }    
  }
}

if (global) global.EntityPlayer = EntityPlayer;