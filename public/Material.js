
class Material {
  constructor(textures, options = {solid: false, opaque: false, randomTextures: [], randomRotations: []}) {
    this.textures = textures;

    this.solid = options.solid;
    this.opaque = options.opaque;
    this.randomTextures = options.randomTextures;
    this.randomRotations = options.randomRotations;
  }

  transform(pos, rot) {
    renderer.translate(pos._addV(vecHalf));
    if (rot) renderer.rotate(rot);
    renderer.translate(vecHalf._mul(-1));
  }

  render(pos, rot) {
    renderer.save();


    if (this.randomRotations) {
      let rand = (RNG(pos.x + " " + pos.y * world.size.x)[0] / 1000) % 1;

      let index = Math.floor(rand * this.randomRotations.length);
      let rotation = this.randomRotations[index];

      rot += rotation;
    }

  
    this.transform(pos, rot);
    for (let t of this.textures) {
      renderer.image(tex[t], vecZero, vecOne._add(0.01));
    }

    if (this.randomTextures) {
      let rand = (RNG(pos.x + " " + pos.y * world.size.x)[0] / 1000) % 1;
  
      let index = Math.floor(rand * this.randomTextures.length);
      let texture = this.randomTextures[index];
  
      renderer.image(tex[texture], vecZero, vecOne);
    }


    renderer.restore();
  }
}

let materials = [
  new Material(["material/grass/1"], {solid: false, opaque: false}), //0
  new Material(["material/floor/1"], {solid: false, opaque: false}), //1
  new Material(["material/wall/1"], {solid: true, opaque: true}), //2
  new Material(["material/floor/drain"], {solid: false, opaque: false}), //3
  new Material(["material/marker/entrance"], {solid: false, opaque: false}), //4
  new Material(["material/floor/1", "material/shelf/middle"], {solid: true, opaque: false, randomTextures: ["empty", "material/shelf/middle/1", "material/shelf/middle/2"], randomRotations: [0, Math.PI]}), //5
  new Material(["material/floor/1", "material/shelf/corner"], {solid: true, opaque: false}), //6
];

if (global) {
  global.materials = materials;
}