let allRooms = [
  '{"name":"Corridor Duck","weight":0.01,"size":{"x":5,"y":5},"grid":[2,4,4,4,2,4,1,1,1,4,4,1,1,1,4,4,1,1,1,4,2,4,4,4,2],"objects":[{"type":"ObjectTextureLight","pos":{"x":1.8,"y":1.8},"size":{"x":2,"y":2},"dir":0.7853981633974483,"texture":"duck/1","lightSize":{"x":8,"y":8},"lightStrength":1}]}',
  '{"name":"Corridor 1","weight":1,"size":{"x":5,"y":5},"grid":[2,4,4,4,2,4,1,1,1,4,4,1,1,1,4,4,1,1,1,4,2,4,4,4,2],"objects":[]}',
  '{"name":"Corridor 2","weight":0.2,"size":{"x":5,"y":5},"grid":[2,4,4,4,2,4,1,1,1,4,4,1,1,1,4,4,1,1,3,4,2,4,4,4,2],"objects":[]}',
  '{"name":"Pond","weight":1,"size":{"x":10,"y":10},"grid":[2,2,4,2,2,2,2,2,2,2,2,1,1,0,0,0,0,1,1,2,2,0,0,0,0,0,0,0,1,4,2,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,1,2,2,1,0,0,0,0,0,0,1,2,2,2,4,2,2,2,2,4,2,2],"objects":[{"type":"ObjectTextureLight","pos":{"x":5,"y":5},"size":{"x":6,"y":6},"dir":0,"texture":"water/1","lightSize":{"x":16,"y":16},"lightStrength":2}]}',
];

let allItems = [
  {name: "Flashlight", type: "EntityItemFlashlight", texture: "item/flashlight", size: new Vec(0.4, 0.4), value: 15, weight: 1,},
  {name: "AM6 Engine", type: "EntityItem", texture: "item/am6", size: new Vec(1, 1), value: 48, weight: 1,},
];




if (global) {
  global.allItems = allItems;
  global.allRooms = allRooms;
} 