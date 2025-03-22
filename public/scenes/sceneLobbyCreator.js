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
      minSize: new Vec(50, 50),

      padding: 10,

      fill: "rgb(0, 0, 0)",

      text: {font: "50px monospace"},

      hover: {
        text: {fill: "rgb(255, 0, 0)"},

        checkbox: {checked: {
          fill: "rgb(255, 0, 0)",
          stroke: "rgb(255, 0, 0)",
        }},

        slider: { active: {
          fill: "rgb(255, 0, 0)",
          stroke: "rgb(255, 0, 0)",
        }},
      },
    };

    this.ui = new UIRoot({
      pos: new Vec(50, 50),


      style: {
        direction: "column",

        gap: 10,
      },

      children: [
        new UIButtonText({
          text: "Back",

          style: {...buttonStyle},
          textStyle: {...buttonStyle},

          events: {mousedown: [() => {
            nde.transition = new TransitionSlide(scenes.lobbyPicker, new TimerTime(0.2));
          }]},
        }),

        new UISettingCollection({
          value: this.lobbySettings,
          hasLabels: true,

          style: {
            gap: 10,

            row: {
              gap: 10,
            },
            label: {...buttonStyle,
            },
          },

          children: [
            new UIButtonText({
              text: "Create Lobby",

              style: {...buttonStyle},
              textStyle: {...buttonStyle},

              events: {mousedown: [() => {
                socket.emit("create lobby", this.lobbySettings);
                nde.setScene(scenes.loading);
        
                socket.on("create lobby", data => { 
                  document.location.href = data.lobbyId;
                });
              }]},
            }),

            new UISettingCheckbox({
              name: "public", displayName: "Public",
              value: false,

              style: {...buttonStyle,
              }
            }),
            
            new UISettingRange({
              name: "maxPlayers", displayName: "Max Players",
              value: 8,
              min: 1, max: 8, step: 1,

              style: {...buttonStyle,

              }
            }),
          ],
        }),
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