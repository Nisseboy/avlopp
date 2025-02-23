let constants = {
  updateInterval: 1000 / 20,
  port: 80,

  itemAmount: 40,
  worldSize: 11,
}


function generateID() {
  return Math.floor(Math.random() * 1000000000);
}


if (global) {
  global.constants = constants;
  global.generateID = generateID;
}