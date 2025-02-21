
let tex = {};
let texturePaths = [
  "duck/1",

  "water/1",

  "material/grass/1",

  "material/wall/1",

  "material/floor/1",
  "material/floor/drain",

  "material/marker/entrance",
];

function preloadTextures() {
  for (let i = 0; i < texturePaths.length; i++) {
    tex[texturePaths[i]] = nde.loadImg("assets/textures/" + texturePaths[i] + ".png");
    
  }
}