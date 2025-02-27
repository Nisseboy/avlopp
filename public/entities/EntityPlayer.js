

class EntityPlayer extends EntityBase {
  constructor(pos, type) {
    super(pos, type);

    this.size = new Vec(1, 1);
    this.speed = 4;
    this.texture = "duck/1";
    this.footTexture = "duck/foot";
    this.slotAmount = 4;
    
    this.hardHoldWeight = 10;

    this.hoveredItem = undefined;

    this.timeSinceStep = 0;
    this.footstepTime = 0.1;
    this.footDist = 0.6;
    this.feet = [{pos: vecZero.copy(), offset: new Vec(0, -0.2), dir: this.dir}, {pos: vecZero.copy(), offset: new Vec(0, 0.2), dir: this.dir}];
  }

  doMovement(dt) {
    let moved = super.doMovement(dt);

    if (moved) {
      emitEvent({action: "move", pos: this.pos});
      emitEvent({action: "primitive", entityId: this.id, path: "dir", primitive: this.dir});
    }
  }

  serverUpdate(dt) {

  }
  clientUpdate(dt) {
    this.doMovement(dt);

    this.updateFeet(dt);
    
    this.hoveredItem = undefined;
  }

  render(pos) {
    for (let f of this.feet) {
      renderer.save();

      renderer.translate(f.pos);
      renderer.rotate(f.dir);
      renderer.translate(this.size._mul(-0.15));
      renderer.image(tex[this.footTexture], vecZero, this.size._mul(0.3));

      renderer.restore();
    }

    super.render(pos);
  }

  updateFeet(dt) {
    this.timeSinceStep += dt * this.speedMult;
    if (this.timeSinceStep > this.footstepTime) {
      let largestDist = 0;
      let foot;
      for (let f of this.feet) {
        let sqd = this.pos._subV(f.pos).sqMag();
        if (sqd > largestDist ** 2) {
          largestDist = Math.sqrt(sqd);
          foot = f;
        }
      }

      if (largestDist >= this.footDist) {
        let target = this.pos._addV(foot.offset._addV(new Vec(this.footDist, 0)).rotateZAxis(this.dir));
        foot.pos.from(target);
        foot.dir = this.dir;

        this.timeSinceStep = 0;
        
      }
    }
  }
}


class EntityPlayerOther extends EntityPlayer {
  constructor(pos, type) {
    super(pos, type);

    this.diffPos = undefined;
    this.newPos = new Vec().from(pos);
    this.moveTime = 1;
  }

  serverUpdate(dt) {
    
  }
  clientUpdate(dt) {
    if (this.moveTime < 1 && this.moveTime >= 0) {
      this.moveTime += dt / constants.updateInterval * 1000;
      this.pos = this.newPos._subV(this.diffPos._mul(1-this.moveTime));
    } if (this.moveTime >= 1) {
      this.pos.from(this.newPos);
      this.moveTime = -1;
    }    

    this.updateFeet(dt);
  }
}

if (global) global.EntityPlayer = EntityPlayer;