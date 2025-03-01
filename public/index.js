let nde;
let scenes;
let renderer;

let lobby;
let socket;

let world;
let player;
let id;
let idLookup = {};

let events = [];

let settings = JSON.parse(localStorage.getItem("avloppSettings") || '{"visibilitySamples": 1000, "renderResolution": 100, "lightingEnabled": true}');



document.body.onload = e => {
  nde = new NDE(document.getElementsByTagName("main")[0]);
  renderer = nde.renderer;
  preloadTextures();

  nde.debug = true;

  //nde.targetFPS = 60;

  nde.controls = {
    //General
    "Move Camera Up": "ArrowUp",
    "Move Camera Down": "ArrowDown",
    "Move Camera Left": "ArrowLeft",
    "Move Camera Right": "ArrowRight",
    "Debug Mode": "l",

    //Game
    "Move Up": "w",
    "Move Down": "s",
    "Move Left": "a",
    "Move Right": "d",
    
    "Pick Up": "f",
    "Drop Item": "g",
    "Use Item": "mouse0",
    "Run": "Shift",
    "Pause": "Escape",

    //Editor
    "Snap": "Control",
    "Paint Modifier": "Shift",
    "Move/Paint": "mouse0",
    "Object Picker": "q",
    "Delete": "Delete",
  };

  scenes = {
    editor: new SceneEditor(),
    objectPicker: new SceneObjectPicker(),
    texturePicker: new SceneTexturePicker(),
    game: new SceneGame(), 
    mainMenu: new SceneMainMenu(),
    lobbyPicker: new SceneLobbyPicker(),
    loading: new SceneLoading(),
    settings: new SceneSettings(),
    roomPicker: new SceneRoomPicker(),
  };

  nde.registerEvent("keydown", e => {
    if (nde.getKeyEqual(e.key,"Debug Mode")) nde.debug = !nde.debug;
  });

  nde.registerEvent("afterSetup", () => {
    lobby = document.location.pathname.split("/")[1];
  
    if (lobby == "") {
      nde.setScene(scenes.lobbyPicker);
    } else {
      nde.setScene(scenes.loading);
      

      socket = io(window.location.origin);

      socket.emit("join", {lobby: lobby});
      socket.on("join", (data) => {
        id = data.id;
        
        scenes.game.loadWorld(new World().from(data.world));
        nde.setScene(scenes.mainMenu);

        //scenes.editor.loadRoom(new Room().from(JSON.parse(allRooms[0])));
        //nde.setScene(scenes.editor);
      });
    }
  });

  nde.registerEvent("update", dt => {
    renderer.set("font", "16px monospace");
    renderer.set("imageSmoothing", false);
  });

  nde.registerEvent("resize", e => {
    return nde.w * settings.renderResolution / 100;
    //return 432; //new width
  });
};





function emitEvent(data) {
  events.push(data);
}
function emit(channel, data) {
  data.id = id;

  socket.emit(channel, data);
}


//https://gist.github.com/yomotsu/165ba9ee0dc991cb6db5
var getDeltaAngle = function () {
  var TAU = 2 * Math.PI;
  var mod = function (a, n) { return ( a % n + n ) % n; } // modulo
  var equivalent = function (a) { return mod(a + Math.PI, TAU) - Math.PI } // [-π, +π]
  return function (current, target) {
    return equivalent(target - current);
  }
}();


function RNG(num) {
  let str = num.toString();
  let h1 = 1779033703, h2 = 3144134277,
      h3 = 1013904242, h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
      k = str.charCodeAt(i);
      h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
      h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
      h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
      h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  h1 ^= (h2 ^ h3 ^ h4), h2 ^= h1, h3 ^= h1, h4 ^= h1;
  return [h1>>>0, h2>>>0, h3>>>0, h4>>>0];
}