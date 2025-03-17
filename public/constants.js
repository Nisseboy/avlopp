let constants = {
  updateInterval: 1000 / 20,
  lobbyDeleteTime: 60000,
  port: 80,

  itemAmount: 40,
  worldSize: 11,
}



let vecZero = new Vec(0, 0);
let vecHalf = new Vec(0.5, 0.5);
let vecOne = new Vec(1, 1);


function generateID() {
  return Math.floor(Math.random() * 1000000000);
}


if (global) {
  global.constants = constants;
  global.generateID = generateID;
  global.vecZero = vecZero;
}