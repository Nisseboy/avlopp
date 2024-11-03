class ObjectBase {
  constructor(pos, size) {
    this.objectType = this.constructor.name;
    this.pos = pos;
    this.size = size;
  }

  inBounds(pos) {
    return (pos.x > this.pos.x - this.size.x / 2 && pos.x < this.pos.x + this.size.x / 2 && pos.y > this.pos.y - this.size.y / 2 && pos.y < this.pos.y + this.size.y / 2);
  }

  from(o) {
    this.objectType = o.objectType;
    if (o.pos) this.pos = new Vec().from(o.pos); else this.pos = new Vec(1, 1);
    if (o.size) this.size = new Vec().from(o.size); else this.size = new Vec(1, 1);

    return this;
  }
  
  render() {}
}

class ObjectTexture extends ObjectBase {
  constructor(pos, size, texture) {
    super(pos, size);
    this.texture = texture;
  }

  from(o) {
    super.from(o);
    this.texture = o.texture;

    return this;
  }

  render() {
    renderer.image(tex[this.texture], this.size._mul(-0.5), this.size);
  }
}

class ObjectText extends ObjectBase {
  constructor(pos, size, text) {
    super(pos, size);
    this.text = text;
  }

  from(o) {
    super.from(o);
    this.text = o.text;

    renderer.save();
    renderer.set("font", "1px monospace");
    renderer.set("textAlign", ["center", "middle"]);
    let size = renderer.measureText(this.text);
    this.size = new Vec(size.width, size.fontBoundingBoxAscent + size.fontBoundingBoxDescent );
    renderer.restore();
    

    return this;
  }

  render() {
    renderer.set("font", "1px monospace");
    renderer.set("textAlign", ["center", "middle"]);
    renderer.set("fill", 255);
    renderer.text(this.text, new Vec(0, 0));
  }
}

class ObjectWater extends ObjectTexture {
  constructor(pos, size, texture) {
    super(pos, size, texture);
  }

  inBounds(pos) {
    let bb = super.inBounds(pos);
    if (!bb) return false;

    let relative = pos._subV(this.pos).divV(this.size).add(0.5).mulV(tex[this.texture].size).floor();
    
    return tex[this.texture].ctx.getImageData(relative.x, relative.y, 1, 1).data[3];
    
    
  }
}

let objectTypes = {
  "ObjectBase": ObjectBase,
  "ObjectText": ObjectText,
  "ObjectTexture": ObjectTexture,
  "ObjectWater": ObjectWater,
};

let objectPrefabs = [
  {objectType: "ObjectText", text: "duck/1"},

  {objectType: "ObjectTexture", size: new Vec(1, 1), texture: "duck/1"},
  {objectType: "ObjectWater", size: new Vec(10, 10), texture: "water/1"},
];