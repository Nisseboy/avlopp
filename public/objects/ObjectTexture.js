

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