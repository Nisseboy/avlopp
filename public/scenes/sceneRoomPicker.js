class SceneRoomPicker extends Scene {
  constructor() {
    super();

    this.cam = new Camera(new Vec(800, 450));
    this.cam.w = 1600;
    this.cam.renderW = nde.w;
  }

  start() {
    let buttonStyle = {
      padding: 10, 

      fill: 0, 
      image: {imageSmoothing: false},
      hover: {fill: [255, 0, 0]}
    };
    this.buttons = [];




    let y = 50;
    for (let room of allRooms) {
      this.buttons.push(new ButtonText(new Vec(50, y), JSON.parse(room).name, buttonStyle, {mouseup: [e => {
        scenes.editor.loadRoom(new Room().from(JSON.parse(room)));
        nde.setScene(scenes.editor);
      }]}));
      y += 50;
    }

    this.buttons.push(new ButtonText(new Vec(50, y), "+", buttonStyle, {mouseup: [e => {
      let name = prompt("Name");
      let size = prompt("Size (divisible by 5)", "5,5");

      if (name != "" && size != "" && name != null && size != null) {
        let axes = size.split(",").map(parseFloat);

        let room = new Room(name, 1, new Vec(axes[0], axes[1])).generate();
        
        scenes.editor.loadRoom(room);
        nde.setScene(scenes.editor);
      }
    }]}));
  }

  keydown(e) {
    if (nde.getKeyEqual(e.key,"Pause") || nde.getKeyEqual(e.key,"Object Picker")) {
      nde.setScene(scenes.mainMenu);
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