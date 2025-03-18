class SceneCharacter extends Scene {
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

    if (characterSettings.name == undefined) characterSettings.name = "Unnamed";
    
    this.buttons = [
      new ButtonText(new Vec(50, 50), "Back", buttonStyle, {mousedown: [function () {
        nde.transition = new TransitionSlide(scenes.lobbyPicker, new TimerTime(0.2));
      }]}),

      new ButtonText(new Vec(50, 150), "Name: " + characterSettings.name, buttonStyle, {mousedown: [() => {
        let newName = prompt("New name?");
        if (newName == "" || newName == null) return;

        characterSettings.name = newName;
        localStorage.setItem("avloppName", newName);
        this.buttons[1].text = "Name: " + newName;
        
        localStorage.setItem("characterSettings", JSON.stringify(characterSettings));
      }]}),

      new SettingCollection(new Vec(50, 250), characterSettings, settingCollectionStyle, {
        r:        {type: SettingRange,    name: "Color R",         args: {default: 255, min: 0, max: 255}},
        g:        {type: SettingRange,    name: "Color G",         args: {default: 255, min: 0, max: 255}, style: {setting: {hover: {range: {fill: "rgba(0, 255, 0, 1)", stroke: "rgba(0, 255, 0, 1)"}}}}},
        b:        {type: SettingRange,    name: "Color B",         args: {default: 255, min: 0, max: 255}, style: {setting: {hover: {range: {fill: "rgba(0, 0, 255, 1)", stroke: "rgba(0, 0, 255, 1)"}}}}},
      }, {
        change: [function (value) {
          localStorage.setItem("characterSettings", JSON.stringify(characterSettings));
        }],
      }),
    ];
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

    this.buttons.forEach(e => e.render());

    renderer.restore();
  }
}