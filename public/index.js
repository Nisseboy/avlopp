let scenes = {
  editor: new SceneEditor(),
  objectPicker: new SceneObjectPicker(),
  game: new SceneGame(), 
  mainMenu: new SceneMainMenu(),
  lobbyPicker: new SceneLobbyPicker(),
  loading: new SceneLoading(),
};

let lobby;
let id;
let socket;

let updateInterval = 100;
let updates = [];

function preload() {
  renderer = new RendererCanvas();

  preloadTextures();

  debug = true;

  //targetFPS = 60;

  controls = {
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
}
document.addEventListener("keydown", e => {
  if (getKeyEqual(e.key,"Debug Mode")) debug = !debug;
});

function beforeSetup() {

}
function afterSetup() {
  lobby = document.location.pathname.split("/")[1];
  
  if (lobby == "") {
    setScene(scenes.lobbyPicker);
  } else {
    setScene(scenes.loading);
    

    socket = io(window.location.origin);

    socket.emit("join", {lobby: lobby});
    socket.on("join", (data) => {
      id = data.id;
      scenes.game.loadWorld(data.world);
      scenes.editor.loadWorld(data.world);
      setScene(scenes.mainMenu);
    });
  }
}

function beforeUpdate() {
  renderer.set("font", "16px monospace");
  renderer.set("imageSmoothing", false);
}
function afterUpdate() {
  
}

function beforeRender() {
  
}
function afterRender() {
  
}

function beforeResize(e) {
  //return 432; //new width
  
  return w;
}
function afterResize(e) {
  
}




function emit(channel, data) {
  data.id = id;

  socket.emit(channel, data);
}