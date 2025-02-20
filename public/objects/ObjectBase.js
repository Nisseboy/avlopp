class ObjectBase {
  constructor(pos, size) {
    this.type = this.constructor.name;
    this.pos = pos;
    this.size = size;

    this.dir = 0;
  }

  inBounds(pos) {
    return (pos.x > this.pos.x - this.size.x / 2 && pos.x < this.pos.x + this.size.x / 2 && pos.y > this.pos.y - this.size.y / 2 && pos.y < this.pos.y + this.size.y / 2);
  }

  from(o) {
    if (o.pos) this.pos = new Vec().from(o.pos); else this.pos = new Vec(1, 1);
    if (o.size) this.size = new Vec().from(o.size); else this.size = new Vec(1, 1);
    this.dir = o.dir;

    return this;
  }
  
  render(pos) {}
}


function cloneObject(data) {
  let o = new (eval(data.type))().from(data);
  o.type = data.type;

  return o;
}


let objectPrefabs = [
  {type: "ObjectText", text: "duck/1"},

  {type: "ObjectTexture", size: new Vec(1, 1), texture: "duck/1"},
  {type: "ObjectWater", size: new Vec(10, 10), texture: "water/1"},
];


if (global) {
  global.ObjectBase = ObjectBase;
  global.cloneObject = cloneObject;
}