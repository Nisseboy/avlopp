class SceneGame extends Scene {
  constructor() {
    super();

    this.cam = new Camera(new Vec(0, 0));
    this.cam.w = 16;

    this.noiseImg = new Img(new Vec(432, 432 / 16 * 9));
    let imageData = this.noiseImg.ctx.getImageData(0, 0, this.noiseImg.size.x, this.noiseImg.size.y);
    let pxls = imageData.data;
    for (let i = 0; i < this.noiseImg.size.x * this.noiseImg.size.y * 4;) {
      let c = Math.random() * 255;
      pxls[i++] = c;
      pxls[i++] = c;
      pxls[i++] = c;
      pxls[i++] = 20;
    }
    this.noiseImg.ctx.putImageData(imageData, 0, 0);
  }
  loadWorld(world) {
    this.world = new World().from(world);

    this.player = this.world.entities.find(e=>e.id == id);
    this.lastPlayer = new Entity().from(this.player);

    socket.on("update", data => {
      for (let e of data.events) {
        switch (e.action) {
          case "connect":
            this.world.entities.push(new Entity().from(e.player));
            break;
          case "disconnect":
            this.world.entities.splice(this.world.entities.findIndex(elem=>elem.id == e.id), 1);
            break;

          case "vec":
            this.world.entities.find(elem=>elem.id == e.id)[e.path].from(e.vec);
            break;
          case "number":
            this.world.entities.find(elem=>elem.id == e.id)[e.path] = e.number;
            break;
        }        
      }
    });

    setInterval(e => {
      if (this.lastPlayer.pos._subV(this.player.pos).mag() > 0.01) {
        this.lastPlayer.pos.from(this.player.pos);
        
        emit("update", {action: "vec", path: "pos", vec: this.player.pos});
        emit("update", {action: "number", path: "dir", number: this.player.dir});
        
      }
      
    }, updateInterval);
  }

  start() {
  
  }

  keydown(e) {
    if (getKeyEqual(e.key,"Pause")) {
      transition = new TransitionSlide(scenes.mainMenu, new TimerTime(0.2));
    }
  }

  update(dt) {
    let player = this.player;
    //this.cam.pos = this.car.pos.copy();
    
    player.movement = new Vec(
      getKeyPressed("Move Right") - getKeyPressed("Move Left"),
      getKeyPressed("Move Down") - getKeyPressed("Move Up"),
    );
    player.speedMult = getKeyPressed("Run") ? 2.5 : 1

    for (let o of this.world.objects) {
      if (o.objectType == "ObjectWater" && o.inBounds(player.pos) && player.movement.sqMag() != 0) {
        player.stepCooldown = 0.1;
        
        let movementDir = Math.atan2(player.movement.y, player.movement.x);
        player.dir += (movementDir - player.dir) * dt * 5;
        
        player.pos.addV(new Vec(Math.cos(player.dir), Math.sin(player.dir))._mul(player.speedMult * 2 * dt));
        
      }
    }

    this.cam.pos.addV(this.player.pos._subV(this.cam.pos).mul(dt * 3));

    for (let i = 0; i < this.world.entities.length; i++) {
      let e = this.world.entities[i];
      e.update(dt);
    }    
  }

  render() {
    let cam = this.cam;

    renderer.save();

    renderer.set("fill", [100, 100, 50]);
    renderer.rect(new Vec(0, 0), new Vec(w, w / 16 * 9));



    renderer.save();

    cam.applyTransform();
    renderer.set("lineWidth", cam.unScaleVec(new Vec(1)).x);
    
    
    let camSize = new Vec(cam.w, cam.w / 16 * 9);
    let noiseImg = this.noiseImg;
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
      renderer.restore();
    }

    for (let i = 0; i < this.world.entities.length; i++) {
      let e = this.world.entities[i];

      renderer.save();
      renderer.translate(e.pos);
      renderer.rotate(e.dir);
      renderer.image(tex[e._type.texture], e._type.size._mul(-0.5), e._type.size);
      renderer.restore();
    }

    renderer.restore();
  }
}