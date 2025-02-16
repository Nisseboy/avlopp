let nde;
let scenes;
let renderer;

let lobby;
let id;
let socket;

let events = [];


document.body.onload = e => {
  nde = new NDE(document.getElementsByTagName("main")[0]);
  renderer = nde.renderer;
  preloadTextures();

  nde.debug = true;

  //nde.targetFPS = 60;

  nde.controls = {
    "Move Up": "w",
    "Move Down": "s",
    "Move Left": "a",
    "Move Right": "d",

    "Move Camera Up": "ArrowUp",
    "Move Camera Down": "ArrowDown",
    "Move Camera Left": "ArrowLeft",
    "Move Camera Right": "ArrowRight",

    "Ctrl": "Control",
    "mouse0": "mouse0",
    "Object Picker": "q",
    "Delete": "Delete",
    
    "Run": "Shift",
    "Interact": "f",
    "Pause": "Escape",
    "Debug Mode": "l",
  };

  scenes = {
    editor: new SceneEditor(),
    objectPicker: new SceneObjectPicker(),
    texturePicker: new SceneTexturePicker(),
    game: new SceneGame(), 
    mainMenu: new SceneMainMenu(),
    lobbyPicker: new SceneLobbyPicker(),
    loading: new SceneLoading(),
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
        scenes.game.loadWorld(data.world);
        scenes.editor.loadWorld(data.world);
        nde.setScene(scenes.mainMenu);
      });
    }
  });

  nde.registerEvent("update", dt => {
    renderer.set("font", "16px monospace");
    renderer.set("imageSmoothing", false);
  });

  nde.registerEvent("resize", e => {
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