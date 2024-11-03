let tex = {};
let texturePaths = [
  "duck/1",
  "water/1"
];

function preloadTextures() {
  for (let i = 0; i < texturePaths.length; i++) {
    tex[texturePaths[i]] = loadImg("assets/textures/" + texturePaths[i] + ".png");
  }
}