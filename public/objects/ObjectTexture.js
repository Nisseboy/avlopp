

class ObjectTexture extends ObjectBase {
  constructor(pos, size, texture) {
    super(pos, size);
    this.texture = texture;
  }

  from(o) {
    super.from(o);
    if (o.texture) this.texture = o.texture; else this.texture = "duck/1";

    return this;
  }

  render(pos) {
    renderer.save();
    
    renderer.translate(pos);
    renderer.rotate(this.dir);
    renderer.translate(this.size._mul(-0.5));
    renderer.image(tex[this.texture], vecZero, this.size);

    renderer.restore();
  }
}


if (global) {
  global.ObjectTexture = ObjectTexture;
}