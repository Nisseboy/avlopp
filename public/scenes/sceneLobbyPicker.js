class SceneLobbyPicker extends Scene {
  constructor() {
    super();

    this.cam = new Camera(new Vec(800, 450));
    this.cam.w = 1600;
  }

  start() {
    let buttonStyle = {
      padding: 10, 

      text: {font: "50px monospace", fill: 255}, 
      hover: {text: {fill: [255, 0, 0]}}
    };
    this.buttons = [
      new ButtonText(new Vec(50, 50), "Create Lobby", buttonStyle, function () {
        document.location.href = Math.floor(Math.random() * 100000);
      }),
      new ButtonText(new Vec(50, 150), "Join Lobby", buttonStyle, function () {
        let lobbyCode = prompt("Lobby code");

        document.location.href = lobbyCode;
      }),
    ];
  }

  update(dt) {

  }

  render() {
    let cam = this.cam;

    renderer.save();

    renderer.set("fill", 19);
    renderer.rect(new Vec(0, 0), new Vec(w, w / 16 * 9));
    
    renderer.restore();



    renderer.save();

    cam.applyTransform();
    renderer.set("lineWidth", cam.unScaleVec(new Vec(1)).x);

    this.buttons.forEach(e => e.render());

    renderer.restore();
  }
}