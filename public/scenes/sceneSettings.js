class SceneSettings extends Scene {
  constructor() {
    super();

    this.cam = new Camera(new Vec(800, 450));
    this.cam.w = 1600;
    this.cam.renderW = nde.w;

    this.start();
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
            nde.transition = new TransitionSlide(scenes.mainMenu, new TimerTime(0.2));
          }]},
        }),

        new UISettingCollection({
          value: settings,
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
            new UISettingRange({
              name: "renderResolution", displayName: "Render Resolution",
              value: 100,
              min: 25, max: 100, step: 1,

              style: {...buttonStyle,

              },

              events: {
                change: [e=>{window.dispatchEvent(new Event('resize'));}]
              },
            }),
            
            new UISettingRange({
              name: "visibilitySamples", displayName: "Visibility Rays",
              value: 1000,
              min: 200, max: 10000, step: 100,

              style: {...buttonStyle,

              }
            }),

            new UISettingCheckbox({
              name: "lightingEnabled", displayName: "Lighting Enabled",
              value: true,

              style: {...buttonStyle,
              }
            }),
            
            new UISettingRange({
              name: "brightness", displayName: "Brightness",
              value: 100,
              min: 10, max: 200, step: 1,

              style: {...buttonStyle,

              },

              events: {change: [() => {for (let l of world.lights) l.oldDir = undefined;}]}
            }),
          ],

          events: {
            change: [function (value) {
              localStorage.setItem("avloppSettings", JSON.stringify(settings));      
            }],
          },
        }),
      ],
    });    
  }

  keydown(e) {
    if (nde.getKeyEqual(e.key,"Pause")) {
      nde.transition = new TransitionSlide(scenes.mainMenu, new TimerTime(0.2));
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

    this.ui.renderUI();

    renderer.restore();
  }
}