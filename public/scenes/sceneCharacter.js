class SceneCharacter extends Scene {
  constructor() {
    super();

    this.cam = new Camera(new Vec(800, 450));
    this.cam.w = 1600;
    this.cam.renderW = nde.w;

    this.start();
  }

  start() {
    if (characterSettings.name == undefined) characterSettings.name = "Unnamed";
    
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
          value: characterSettings,
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
              text: "Name: " + characterSettings.name,

              style: {...buttonStyle},
              textStyle: {...buttonStyle},

              events: {mousedown: [() => {
                let newName = prompt("New name?");
                if (newName == "" || newName == null) return;
        
                characterSettings.name = newName;
                localStorage.setItem("avloppName", newName);
                this.ui.children[1].children[0].children[0].children[0].text = "Name: " + newName;
                this.ui.initUI();
                
                
                localStorage.setItem("characterSettings", JSON.stringify(characterSettings));
              }]},
            }),
            
            new UISettingRange({
              name: "r", displayName: "Color R",
              value: 19,
              min: 0, max: 255, step: 1,

              style: {...buttonStyle,

              }
            }),
            new UISettingRange({
              name: "g", displayName: "Color G",
              value: 19,
              min: 0, max: 255, step: 1,

              style: {...buttonStyle,

                hover: {slider: { active: {
                  fill: "rgb(0, 255, 0)",
                  stroke: "rgb(0, 255, 0)",
                }}},
              }
            }),
            new UISettingRange({
              name: "b", displayName: "Color B",
              value: 19,
              min: 0, max: 255, step: 1,

              style: {...buttonStyle,

                hover: {slider: { active: {
                  fill: "rgb(0, 0, 255)",
                  stroke: "rgb(0, 0, 255)",
                }}},
              }
            }),
          ],

          events: {
            change: [function (value) {
              localStorage.setItem("characterSettings", JSON.stringify(characterSettings));      
            }],
          },
        }),
      ],
    });    
  }

  keydown(e) {
    if (nde.getKeyEqual(e.key,"Pause")) {
      nde.transition = new TransitionSlide(scenes.lobbyPicker, new TimerTime(0.2));
    }
  }

  update(dt) {
    this.cam.pos.addV(new Vec(
      nde.getKeyPressed("Move Camera Right") - nde.getKeyPressed("Move Camera Left"),
      nde.getKeyPressed("Move Camera Down") - nde.getKeyPressed("Move Camera Up"),
    ).mul(dt * 500));
  }

  render() {
    let cam = this.cam;
    cam.renderW = nde.w;

    renderer.save();

    renderer.set("fill", 19);
    renderer.rect(vecZero, new Vec(nde.w, nde.w / 16 * 9));
    
    renderer.restore();



    renderer.save();

    cam.applyTransform();
    renderer.set("lineWidth", cam.unScaleVec(new Vec(1)).x);

    //this.buttons.forEach(e => e.render());
    this.ui.renderUI();

    renderer.restore();
  }
}