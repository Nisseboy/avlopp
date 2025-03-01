
let tex = {};
let texturePathsEntities = [
  "duck/1",
  "duck/foot",
];
let texturePathsItems = [
  "item/flashlight",

  "item/am6",
];
let texturePathsObjects = [
  "water/1",
];
let texturePathsMaterials = [
  "material/grass/1",
  "material/floor/1",
  "material/floor/drain",

  "material/wall/1",

  "material/shelf/middle",
  "material/shelf/middle/1",
  "material/shelf/middle/2",

  "material/marker/entrance",
];

let texturePaths = [
  ...texturePathsEntities,
  ...texturePathsItems,
  ...texturePathsObjects,
  ...texturePathsMaterials,
];

function preloadTextures() {
  for (let i = 0; i < texturePaths.length; i++) {
    tex[texturePaths[i]] = nde.loadImg("assets/textures/" + texturePaths[i] + ".png");
    
  }
}