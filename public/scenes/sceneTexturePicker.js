class SceneTexturePicker extends Scene {
  constructor() {
    super();

    this.cam = new Camera(new Vec(800, 450));
    this.cam.w = 1600;

    this.callback = (newTex) => {};
  }

  start() {
    let buttonStyle = {
      padding: 10, 

      fill: 0, 
      image: {imageSmoothing: false},
      hover: {fill: [255, 0, 0]}
    };
    this.buttons = [];

    let x = 50;
    let y = 50;

    for (let texture in tex) {
      this.buttons.push(new ButtonImage(new Vec(x, y), new Vec(100, 100), tex[texture], buttonStyle, e => {
        this.callback(texture);
        setScene(scenes.editor);
      }));
      
      x += 130;
      if (x > this.cam.w - 200) {
        x = 50;
        y += 130;
      }
    }

    if (x != 49) y += 130 + 40;
  }

  keydown(e) {
    if (getKeyEqual(e.key,"Pause") || getKeyEqual(e.key,"Object Picker")) {
      setScene(scenes.editor);
    }
  }

  update(dt) {
    this.cam.pos.addV(new Vec(
      getKeyPressed("Move Camera Right") - getKeyPressed("Move Camera Left"),
      getKeyPressed("Move Camera Down") - getKeyPressed("Move Camera Up"),
    ).mul(dt * 500));
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