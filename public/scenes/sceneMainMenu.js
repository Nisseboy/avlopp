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

      text: {font: "50px monospace", fill: 255}, 
      hover: {text: {fill: [255, 0, 0]}}
    };
    this.buttons = [
      new ButtonText(new Vec(50, 50), "Exit Lobby", buttonStyle, {mousedown: [function () {
        document.location = document.location.href.substring(0, document.location.href.lastIndexOf('/'));
      }]}),
      new ButtonText(new Vec(50, 250), "Enter", buttonStyle, {mousedown: [function () {
        nde.transition = new TransitionSlide(scenes.game, new TimerTime(0.2));
      }]}),
      new ButtonText(new Vec(50, 340), "Editor", buttonStyle, {mousedown: [function () {
        nde.transition = new TransitionSlide(scenes.roomPicker, new TimerTime(0.2));
      }]}),
      new ButtonText(new Vec(50, 550), "Settings", buttonStyle, {mousedown: [function () {
        nde.transition = new TransitionSlide(scenes.settings, new TimerTime(0.2));
      }]}),
    ];
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

    this.buttons.forEach(e => e.render());

    renderer.restore();
  }
}