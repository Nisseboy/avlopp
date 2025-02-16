class SceneEditor extends Scene {
  constructor() {
    super();

    this.cam = new Camera(new Vec(0, 0));
    this.cam.w = 16;
    this.cam.renderW = nde.w;

    this.uicam = new Camera(new Vec(800, 450));
    this.uicam.w = 1600;
    this.uicam.renderW = nde.w;

    this.hoveredObject = undefined;
    this.selectedObjects = [];
    this.selectedObjectsOffsets = [];
  }
  loadWorld(world) {
    this.world = new World().from(world);
    this.world.entities = [];
  }

  start() {
    this.buttonStyle = {
      padding: 10, 
      fill: [0, 0, 0, 0.3],
      stroke: 255,

      text: {font: "20px monospace", fill: 255}, 
      hover: {text: {fill: [255, 0, 0]}}
    };
    this.buttons = [
      new ButtonText(new Vec(25, 25), "Exit", this.buttonStyle, {mousedown: [function () {
        transition = new TransitionSlide(scenes.mainMenu, new TimerTime(0.2));
      }]}),
      new ButtonText(new Vec(25, 75), "Export", this.buttonStyle, {mousedown: [() => {
        console.log(`'${JSON.stringify(this.world)}'`);
      }]}),
    ];
  }

  keydown(e) {
    let objects = this.world.objects;

    if (nde.getKeyEqual(e.key,"Pause")) {
      nde.transition = new TransitionSlide(scenes.mainMenu, new TimerTime(0.2));
    }
    if (nde.getKeyEqual(e.key,"Object Picker")) {
      nde.setScene(scenes.objectPicker);
    }

    if (nde.getKeyEqual(e.key, "Delete")) {
      for (let o of this.selectedObjects) {
        objects.splice(objects.indexOf(o), 1);
      }
    }
  }

  update(dt) {
    let cam = this.cam;
    let objects = this.world.objects;

    cam.pos.addV(new Vec(
      nde.getKeyPressed("Move Right") - nde.getKeyPressed("Move Left"),
      nde.getKeyPressed("Move Down") - nde.getKeyPressed("Move Up"),
    ).mul(dt / 16 * cam.w * 10 * (nde.getKeyPressed("Run") ? 2.5 : 1)));

    this.hoveredObject = undefined;
    for (let o of objects) {
      if (o.inBounds(cam.from(nde.mouse))) this.hoveredObject = o;
    }

    if (nde.getKeyPressed("mouse0")) {
      for (let i = 0; i < this.selectedObjects.length; i++) {
        let o = this.selectedObjects[i];
        
        o.pos = cam.from(nde.mouse)._addV(this.selectedObjectsOffsets[i]);

        if (nde.getKeyPressed("Ctrl")) {
          o.pos.mul(5).floor().div(5);
        }
      }
    }
  }

  wheel(e) {
    if (e.deltaY < 0) this.cam.w /= 1.2;
    else this.cam.w *= 1.2;
  }

  mousedown(e) {
    let cam = this.cam;
    let objects = this.world.objects;

    let ctrlPressed = nde.getKeyPressed("Ctrl");
    let selected = this.selectedObjects.includes(this.hoveredObject);
    

    if (!this.hoveredObject) {
      if (!ctrlPressed) this.selectedObjects.length = 0;
      return;
    }

    if (e.button == 0) {
      if (ctrlPressed) {      
        if (selected) this.selectedObjects.splice(this.selectedObjects.indexOf(this.hoveredObject));
      } else if (!selected) {
        this.selectedObjects.length = 0;
      }
      
      if (!selected) {
        this.selectedObjects.push(this.hoveredObject);
      }
      

      for (let i = 0; i < this.selectedObjects.length; i++) {
        this.selectedObjectsOffsets[i] = this.selectedObjects[i].pos._subV(cam.from(nde.mouse));
      }
    }

    if (e.button == 2) {
      objects.splice(objects.indexOf(this.hoveredObject), 1);
    }
  }

  render() {
    let cam = this.cam;
    this.cam.renderW = nde.w;
    this.uicam.renderW = nde.w;

    renderer.save();

    renderer.set("fill", [100, 100, 50]);
    renderer.rect(new Vec(0, 0), new Vec(nde.w, nde.w / 16 * 9));

    renderer.restore();



    renderer.save();

    cam.applyTransform();
    renderer.set("lineWidth", cam.unScaleVec(new Vec(1)).x);



    let camSize = new Vec(16, 9);
    let noiseImg = scenes.game.noiseImg;
    let pos = cam.pos._divV(camSize).floor().mulV(camSize);

    renderer.save();
    renderer.translate(pos);
    renderer.image(noiseImg, camSize._div(-2), camSize);
    renderer.translate(new Vec(camSize.x, 0));
    renderer.image(noiseImg, camSize._div(-2), camSize);
    renderer.translate(new Vec(0, camSize.y));
    renderer.image(noiseImg, camSize._div(-2), camSize);
    renderer.translate(new Vec(-camSize.x, 0));
    renderer.image(noiseImg, camSize._div(-2), camSize);
    renderer.restore();



    for (let i = 0; i < this.world.objects.length; i++) {
      let o = this.world.objects[i];
      
      renderer.save();
      renderer.translate(o.pos);
      o.render();

      renderer.set("stroke", 255);
      renderer.set("fill", [0, 0, 0, 0]);
      if (this.selectedObjects.includes(o)) renderer.set("stroke", [0, 0, 255]);
      if (o == this.hoveredObject) renderer.set("stroke", [255, 0, 0]);

      renderer.rect(o.size._mul(-0.5), o.size);

      renderer.restore();
    }

    renderer.save();
    renderer.set("fill", [200, 100, 100]);
    
    renderer.image(tex["duck/1"], new Vec(-0.5, -0.5), new Vec(1, 1));
    renderer.restore();

    renderer.restore();

    renderer.save();
    this.uicam.applyTransform();
    this.buttons.forEach(e => e.render());

    if (this.selectedObjects.length != 0) {
      let w = 500;

      renderer.translate(new Vec(this.uicam.w - w, 0));

      renderer.set("fill", [0, 0, 0, 0.3]);
      renderer.rect(new Vec(0, 0), new Vec(w, this.uicam.w / 16 * 9));


      let props = ["type", "size", "text", "texture", ];

      for (let o of this.selectedObjects) {
        for (let i = 0; i < props.length; i++) {
          if (o[props[i]] == undefined) {
            props.splice(i, 1);
            i--;
          }
        }
      }
      if (props.includes("text")) props.splice(props.indexOf("size"), 1);
      
      renderer.set("fill", 255);

      for (let i = 0; i < props.length; i++) {
        let prop = props[i];

        renderer.text(prop, new Vec(25, 25 + this.buttonStyle.padding));

        switch(prop) {
          case "type":
            renderer.text(this.selectedObjects[0].type, new Vec(w / 3, 25 + this.buttonStyle.padding));
            break;

          case "size":
            new ButtonText(new Vec(w / 3, 25), "Edit", this.buttonStyle, {mousedown: [() => {
              let text = prompt("New size", this.selectedObjects[0].size.x + "," + this.selectedObjects[0].size.y);
              if (text == null || text == "") return;
              let axes = text.split(",").map(parseFloat);
              
              for (let o of this.selectedObjects) o.size = new Vec(axes[0], axes[1]);
            }]}).render();
            break;

          case "text":
            new ButtonText(new Vec(w / 3, 25), "Edit", this.buttonStyle, {mousedown: [() => {
              let text = prompt("New text", this.selectedObjects[0].text);
              if (text == null || text == "") return;
              for (let o of this.selectedObjects) o.text = text;
            }]}).render();
            break;
            
          case "texture":
            new ButtonText(new Vec(w / 3, 25), "Edit", this.buttonStyle, {mousedown: [() => {
              nde.setScene(scenes.texturePicker);
              scenes.texturePicker.callback = (newTex) => {for (let o of this.selectedObjects) o.texture = newTex;};
            }]}).render();
            break;
        }

        renderer.translate(new Vec(0, 50));
      }
    }
    renderer.restore();
  }
}