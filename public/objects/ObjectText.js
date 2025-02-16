
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