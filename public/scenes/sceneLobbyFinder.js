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

      fill: "rgb(0, 0, 0)",

      text: {font: "50px monospace"},

      hover: {
        text: {fill: "rgb(255, 0, 0)"}
      }
    };

    let lobbies = new UIBase({
      style: {
        direction: "column",
        gap: 10,
        
        growY: true,
      },
    });
    for (let lobby of this.lobbies) {
      let textStyle = {
        text: {font: "20px monospace"},
        hover: {
          text: {fill: "rgb(255, 0, 0)"},
        },
      };

      let element = new UIButton({
        style: {...buttonStyle,

          padding: 10,
          gap: 10,
          growX: true,
          minSize: new Vec(200, 0),
        },

        children: [
          new UIText({
            text: lobby.lobbyId + ": ",

            style: textStyle,
          }),
          new UIBase({
            style: {growX: true},
          }),
          new UIText({
            text: lobby.playerCount + "/" + lobby.maxPlayers,

            style: textStyle,
          }),
        ],

        events: {mousedown: [function () {
          document.location.href = lobby.lobbyId;
        }]},
      });

      lobbies.children.push(element);
    }   


    this.ui = new UIRoot({
      pos: new Vec(50, 50),


      style: {
        direction: "column",

        gap: 10,
      },

      children: [
        new UIButtonText({
          style: {...buttonStyle},
          textStyle: {...buttonStyle},
          text: "Back",

          events: {mousedown: [() => {
            nde.transition = new TransitionSlide(scenes.lobbyPicker, new TimerTime(0.2));
          }]},
        }),


        new UIBase({
          style: {
            minSize: new Vec(50, 50),
          },
        }),


        new UIButtonText({
          style: {...buttonStyle},
          textStyle: {...buttonStyle},
          text: "Manual",

          events: {mousedown: [() => {
            let lobbyCode = prompt("Lobby code");
    
            if (lobbyCode == "" || lobbyCode == null) return;
    
            document.location.href = lobbyCode;
          }]},
        }),


        new UIButtonText({
          style: {...buttonStyle},
          textStyle: {...buttonStyle},
          text: "Refresh",

          events: {mousedown: [() => {
            gotoLobbyFinder();
          }]},
        }),

        
        lobbies,
      ],
    });    
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

    this.ui.renderUI();

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