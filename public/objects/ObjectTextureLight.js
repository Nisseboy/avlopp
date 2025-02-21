

class ObjectTextureLight extends ObjectTexture {
  constructor(pos, size, texture, lightSize, lightStrength) {
    super(pos, size, texture);

    this.lightSize = lightSize;
    this.lightStrength = lightStrength;
  }

  from(o) {
    super.from(o);

    if (o.lightSize) this.lightSize = new Vec().from(o.lightSize); else this.lightSize = new Vec(8, 8);
    if (o.lightStrength) this.lightStrength = o.lightStrength; else this.lightStrength = 1;
    
    return this;
  }
  

  onLoad() {
    let world = scenes.game.world;

    this.light = new LightPoint(this.pos, this.lightSize, this.lightStrength);
    world.lights.push(this.light);
  }
  onUnload() {
    world.lights.splice(world.lights.indexOf(this.light), 1);
  }
}


if (global) {
  global.ObjectTextureLight = ObjectTextureLight;
}