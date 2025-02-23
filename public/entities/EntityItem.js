let allItems = [
  {name: "Flashlight", weight: 1, type: "EntityItemFlashlight", texture: "item/flashlight", size: new Vec(0.4, 0.4)},
];



class EntityItem extends EntityBase {
  constructor(pos, type) {
    super(pos, type);

    this.name = "Unnamed";
  }

  from(data) {
    super.from(data);

    if (data.name) this.name = data.name; else this.name = "Unnamed";

    if (data.texture) this.texture = data.texture;
    if (data.size) this.size = new Vec().from(data.size);

    return this;
  }

  serverUpdate(dt, world) {}

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

  clientUpdate(dt, world) {
    super.clientUpdate(dt, world);

    if (this.on && !this.lastOn) {
      this.addAssets(world);
    }
    if (this.lastOn && !this.on) {
      this.removeAssets(world);
    }

    this.lastOn = this.on;
  }

  use() {
    this.on = !this.on;
  }

  unload(world) {    
    if (this.on) this.removeAssets(world);
  }

  emitState() {
    emitEvent({action: "primitive", entityId: this.id, path: "on", primitive: this.on});
  }


  addAssets(world) {}
  removeAssets(world) {}
}

class EntityItemFlashlight extends EntityItemToggle {
  constructor(pos, type) {
    super(pos, type);

    this.light = undefined;
  }

  clientUpdate(dt, world) {
    super.clientUpdate(dt, world);

    if (this.light != undefined) {
      this.light.dir = this.dir;
      this.light.cached = false;
    }
  }
  
  addAssets(world) {    
    this.light = new LightBeam(this.pos, new Vec(16, 16), 3);
    world.lights.push(this.light);
  }
  removeAssets(world) {    
    world.lights.splice(world.lights.indexOf(this.light), 1);
    this.light = undefined;
  }
}

if (global) {
  global.allItems = allItems;
  global.EntityItem = EntityItem;
  global.EntityItemToggle = EntityItemToggle;
  global.EntityItemFlashlight = EntityItemFlashlight;
} 