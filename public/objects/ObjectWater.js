
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