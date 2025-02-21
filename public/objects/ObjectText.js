
class ObjectText extends ObjectBase {
  constructor(pos, size, text) {
    super(pos, size);
    this.text = text;
  }

  from(o) {
    super.from(o);
    if (o.text) this.text = o.text; else this.text = "no text";

    if (o.size) this.size = new Vec().from(o.size);
    else {
      renderer.save();
      renderer.set("font", "1px monospace");
      renderer.set("textAlign", ["center", "middle"]);
      let size = renderer.measureText(this.text);
      this.size = new Vec(size.width, size.fontBoundingBoxAscent + size.fontBoundingBoxDescent );
      renderer.restore();
    }
    

    return this;
  }

  render(pos) {
    renderer.save();

    renderer.set("font", "1px monospace");
    renderer.set("textAlign", ["center", "middle"]);
    renderer.set("fill", 255);
    renderer.translate(pos);
    renderer.rotate(this.dir);
    renderer.text(this.text, vecZero);    
    
    renderer.restore();
  }
}


if (global) {
  global.ObjectText = ObjectText;
}