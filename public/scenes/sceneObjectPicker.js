class SceneObjectPicker extends Scene {
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


    let types = [];
    for (let i in objectPrefabs) {
      let op = objectPrefabs[i];
      if (!types.includes(op.type)) types.push(op.type);
    }


    let y = 50;
    for (let ot of types) {
      let x = 49;

      if (ot != "ObjectBase")this.buttons.push(new ButtonText(new Vec(x, y), ot, buttonStyle, e => {}));
      y += 40;

      for (let i = 0; i < objectPrefabs.length; i++) {
        let o = objectPrefabs[i];
        if (o.type != ot) continue;

        let texture = o.texture ? tex[o.texture] : new Img(new Vec(10, 10));

        this.buttons.push(new ButtonImage(new Vec(x, y), new Vec(100, 100), texture, buttonStyle, {mouseup: [e => {
          let ob = cloneObject(o);
          ob.pos = scenes.editor.cam.pos.copy();

          scenes.editor.world.objects.push(ob);
          nde.setScene(scenes.editor);
        }]}));
        
        x += 130;
        if (x > this.cam.w - 200) {
          x = 50;
          y += 180;
        }
      }

      if (x != 49) y += 130 + 40;
    }
  }

  keydown(e) {
    if (nde.getKeyEqual(e.key,"Pause") || nde.getKeyEqual(e.key,"Object Picker")) {
      nde.setScene(scenes.editor);
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
    renderer.rect(new Vec(0, 0), new Vec(nde.w, nde.w / 16 * 9));
    
    renderer.restore();



    renderer.save();

    cam.applyTransform();
    renderer.set("lineWidth", cam.unScaleVec(new Vec(1)).x);

    this.buttons.forEach(e => e.render());

    renderer.restore();
  }
}