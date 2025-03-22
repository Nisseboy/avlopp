class SceneMainMenu extends Scene {
  constructor() {
    super();

    this.cam = new Camera(new Vec(800, 450));
    this.cam.w = 1600;
    this.cam.renderW = nde.w;
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
          text: "Exit Lobby: " + lobby,

          events: {mousedown: [() => {
            document.location = document.location.href.substring(0, document.location.href.lastIndexOf('/'));
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
          text: "Enter",

          events: {mousedown: [() => {
            nde.transition = new TransitionSlide(scenes.game, new TimerTime(0.2));
          }]},
        }),
        new UIButtonText({
          style: {...buttonStyle},
          textStyle: {...buttonStyle},
          text: "Editor",

          events: {mousedown: [() => {
            let newScene = scenes.editor.room == undefined ? scenes.roomPicker : scenes.editor;
            nde.transition = new TransitionSlide(newScene, new TimerTime(0.2));
          }]},
        }),
        new UIButtonText({
          style: {...buttonStyle},
          textStyle: {...buttonStyle},
          text: "Settings",

          events: {mousedown: [() => {
            nde.transition = new TransitionSlide(scenes.settings, new TimerTime(0.2));
          }]},
        }),
      ],
    });    
  }

  update(dt) {
    this.cam.pos.addV(new Vec(
      nde.getKeyPressed("Move Camera Right") - nde.getKeyPressed("Move Camera Left"),
      nde.getKeyPressed("Move Camera Down") - nde.getKeyPressed("Move Camera Up"),
    ).mul(dt * 500));
  }

  render() {
    let cam = this.cam;
    this.cam.renderW = nde.w;

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