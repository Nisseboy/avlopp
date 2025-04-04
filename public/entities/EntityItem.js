class EntityItem extends EntityBase {
  constructor(pos, type) {
    super(pos, type);

    this.name = "Unnamed";
    this.weight = 1;
    this.value = 1;
  }

  from(data) {
    super.from(data);

    if (data.name) this.name = data.name;
    if (data.value) this.weight = data.weight;
    if (data.value) this.value = data.value;

    if (data.texture) this.texture = data.texture;
    if (data.size) this.size = new Vec().from(data.size);

    return this;
  }

  clientUpdate(dt) {
    this.lerpData(dt);
  }
  serverUpdate(dt) {}

  use() {}

  emitState() {}
}



class EntityItemToggle extends EntityItem {
  constructor(pos, type) {
    super(pos, type);

    this.lastOn = false;
    this.on = false;
  }

  from(data) {
    super.from(data);

    if (data.on) this.on = data.on; else this.on = false;

    return this;
  }

  clientUpdate(dt) {
    super.clientUpdate(dt);

    if (this.on && !this.lastOn) {
      this.addAssets();
    }
    if (this.lastOn && !this.on) {
      this.removeAssets();
    }

    this.lastOn = this.on;
  }

  use() {
    this.on = !this.on;
  }

  unload() {    
    if (this.on) this.removeAssets();
  }

  emitState() {
    emitEvent({action: "primitive", entityId: this.id, path: "on", primitive: this.on});
  }


  addAssets() {}
  removeAssets() {}
}

class EntityItemFlashlight extends EntityItemToggle {
  constructor(pos, type) {
    super(pos, type);

    this.light = undefined;
  }

  clientUpdate(dt) {
    super.clientUpdate(dt);

    if (this.light != undefined) {
      this.light.pos = this.pos._addV(new Vec(Math.cos(this.dir), Math.sin(this.dir)).mul(0.15));
      this.light.dir = this.dir;
    }
  }
  
  addAssets() {    
    this.light = new LightBeam(this.pos, new Vec(16, 16), 3);
    world.lights.push(this.light);    
  }
  removeAssets() {    
    world.lights.splice(world.lights.indexOf(this.light), 1);
    this.light = undefined;
  }
}

if (global) {
  global.EntityItem = EntityItem;
  global.EntityItemToggle = EntityItemToggle;
  global.EntityItemFlashlight = EntityItemFlashlight;
} 