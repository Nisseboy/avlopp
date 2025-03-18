class SceneLobbyCreator extends Scene {
  constructor() {
    super();

    this.cam = new Camera(new Vec(800, 450));
    this.cam.w = 1600;
    this.cam.renderW = nde.w;

    this.lobbySettings = {};
  }

  start() {
    let buttonStyle = {
      padding: 10, 

      text: {font: "50px monospace", fill: 255}, 
      hover: {text: {fill: [255, 0, 0]}}
    };
    let settingCollectionStyle = {
      size: new Vec(500, 50),
      gap: 10,
      settingXOffset: 600,

      text: {
        font: "50px monospace",
      },

      setting: {
        padding: 10,

        range: {
          text: {
            width: 30,
          },
        },
        
        hover: { 
          stroke: "rgba(255, 0, 0, 1)", 
          checkbox: {
            stroke: "rgba(255, 0, 0, 1)", 
            fill: "rgba(255, 0, 0, 1)"
          },
          range: {
            fill: "rgba(255, 0, 0, 1)", 
            stroke: "rgba(255, 0, 0, 1)",
          },
        },
      }
    };
    this.buttons = [
      new ButtonText(new Vec(50, 50), "Back", buttonStyle, {mousedown: [function () {
        nde.transition = new TransitionSlide(scenes.lobbyPicker, new TimerTime(0.2));
      }]}),

      new ButtonText(new Vec(50, 150), "Create Lobby", buttonStyle, {mousedown: [() => {
        socket.emit("create lobby", this.lobbySettings);
        nde.setScene(scenes.loading);

        socket.on("create lobby", data => { 
          document.location.href = data.lobbyId;
        });
      }]}),

      new SettingCollection(new Vec(50, 250), this.lobbySettings, settingCollectionStyle, {
        public:           {type: SettingCheckbox,  name: "Public",              args: {default: false}, style: {size: new Vec(50, 50)}},
        maxPlayers:        {type: SettingRange,    name: "Max Players",         args: {default: 8, min: 1, max: 8}},
      }, {}),
    ];
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