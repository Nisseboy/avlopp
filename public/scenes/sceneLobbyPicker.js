class SceneLobbyPicker extends Scene {
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
          text: "Customize Character",

          events: {mousedown: [() => {
            nde.transition = new TransitionSlide(scenes.character, new TimerTime(0.2));
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
          text: "Create Lobby",

          events: {mousedown: [() => {
            nde.transition = new TransitionSlide(scenes.lobbyCreator, new TimerTime(0.2));
          }]},
        }),
        new UIButtonText({
          style: {...buttonStyle},
          textStyle: {...buttonStyle},
          text: "Join Lobby",

          events: {mousedown: [() => {
            gotoLobbyFinder();
          }]},
        }),
      ],
    });    
  }

  update(dt) {

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