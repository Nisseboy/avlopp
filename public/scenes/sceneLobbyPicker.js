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

      text: {font: "50px monospace", fill: 255}, 
      hover: {text: {fill: [255, 0, 0]}}
    };
    this.buttons = [
      new ButtonText(new Vec(50, 50), "Name: " + playerName, buttonStyle, {mousedown: [() => {
        let newName = prompt("New name?");
        if (newName == "" || newName == null) return;

        playerName = newName;
        localStorage.setItem("avloppName", playerName);
        this.buttons[0].text = "Name: " + playerName;
      }]}),
      new ButtonText(new Vec(50, 250), "Create Lobby", buttonStyle, {mousedown: [function () {
        document.location.href = generateID();
      }]}),
      new ButtonText(new Vec(50, 350), "Join Lobby", buttonStyle, {mousedown: [function () {
        let lobbyCode = prompt("Lobby code");

        document.location.href = lobbyCode;
      }]}),
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