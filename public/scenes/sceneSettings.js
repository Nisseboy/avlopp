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
      padding: 10, 

      text: {font: "50px monospace", fill: "rgb(255, 255, 255)"}, 
      hover: {text: {fill: "rgb(255, 0, 0)"}}
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
            width: 140,
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
        nde.transition = new TransitionSlide(scenes.mainMenu, new TimerTime(0.2));
      }]}),

      new SettingCollection(new Vec(50, 150), settings, settingCollectionStyle, {
        visibilitySamples:  {type: SettingRange,     args: {min: 200, max: 10000, default: 1000, step: 100}, name: "Visibility rays"},
        renderResolution:   {type: SettingRange,     args: {min: 25, max: 100, default: 100, step: 1},       name: "Render Resolution", events: {change: [e=>{window.dispatchEvent(new Event('resize'));}]}},
        lightingEnabled:    {type: SettingCheckbox,  args: {default: true},                                  name: "Lighting Enabled", style: {size: new Vec(50, 50)}},
        brightness:         {type: SettingRange,     args: {min: 0, max: 200, default: 100, step: 1},        name: "Brightness", events: {change: [() => {for (let l of world.lights) l.oldDir = undefined;}]}},
      }, {
        change: [function (value) {
          localStorage.setItem("avloppSettings", JSON.stringify(settings));
        }],
      }),
    ];
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

    this.buttons.forEach(e => e.render());

    renderer.restore();
  }
}