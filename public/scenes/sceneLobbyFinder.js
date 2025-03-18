class SceneLobbyFinder extends Scene {
  constructor() {
    super();

    this.cam = new Camera(new Vec(800, 450));
    this.cam.w = 1600;
    this.cam.renderW = nde.w;

    this.lobbies = [];
  }

  start() {
    let buttonStyle = {
      padding: 10, 

      text: {font: "50px monospace", fill: 255}, 
      hover: {text: {fill: [255, 0, 0]}}
    };
    this.buttons = [
      new ButtonText(new Vec(50, 50), "Back", buttonStyle, {mousedown: [function () {
        nde.transition = new TransitionSlide(scenes.lobbyPicker, new TimerTime(0.2));
      }]}),

      new ButtonText(new Vec(50, 150), "Manual", buttonStyle, {mousedown: [function () {
        let lobbyCode = prompt("Lobby code");

        if (lobbyCode == "" || lobbyCode == null) return;

        document.location.href = lobbyCode;
      }]}),

      new ButtonText(new Vec(50, 250), "Refresh", buttonStyle, {mousedown: [function () {
        gotoLobbyFinder();
      }]}),
    ];

    let buttonStyle2 = {
      padding: 10, 

      text: {font: "20px monospace", fill: 255}, 
      hover: {text: {fill: [255, 0, 0]}}
    };
    let y = 350;    
    for (let lobby of this.lobbies) {
      let text = `${rpad(lobby.lobbyId, " ", 6)}: ${lobby.playerCount}/${lobby.maxPlayers}`;

      let button = new ButtonText(new Vec(50, y), text, buttonStyle2, {mousedown: [function () {
        document.location.href = lobby.lobbyId;
      }]});

      this.buttons.push(button);

      y+=50;
    }   
  }

  update(dt) {

  }

  render() {
    let cam = this.cam;

    renderer.save();

    renderer.set("fill", 19);
    renderer.rect(vecZero, new Vec(nde.w, nde.w / 16 * 9));
    
    renderer.restore();



    renderer.save();

    cam.applyTransform();
    renderer.set("lineWidth", cam.unScaleVec(new Vec(1)).x);

    this.buttons.forEach(e => e.render());

    renderer.restore();
  }
}

function gotoLobbyFinder() {  
  socket.emit("get lobbies");
  nde.setScene(scenes.loading);

  socket.on("get lobbies", data => { 
    scenes.lobbyFinder.lobbies = data.lobbies;
    nde.setScene(scenes.lobbyFinder);
  });
}

function rpad(str, char, length) {
  str = str + "";

  if (str.length > length) return str.substring(0, length);

  while (str.length < length) {
    str = str + char;
  }
  
  return str;
}