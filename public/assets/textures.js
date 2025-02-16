
let tex = {};
let texturePaths = [
  "duck/1",
  "water/1"
];

function preloadTextures() {
  for (let i = 0; i < texturePaths.length; i++) {
    tex[texturePaths[i]] = nde.loadImg("assets/textures/" + texturePaths[i] + ".png");
  }
}