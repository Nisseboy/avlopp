class SceneGame extends Scene {
  constructor() {
    super();

    this.cam = new Camera(new Vec(0, 0));
    this.cam.w = 16;
    this.cam.renderW = nde.w;

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
    this.lastPlayer = cloneEntity(this.player);

    socket.on("update", data => {
      for (let e of data.events) {
        switch (e.action) {
          case "connect":
            this.world.entities.push(cloneEntity(e.player, EntityPlayerOther));
            break;
          case "disconnect":
            this.world.entities.splice(this.world.entities.findIndex(elem=>elem.id == e.id), 1);
            break;

          case "move":
            let entity = this.world.entities.find(elem=>elem.id == e.id);
            
            entity.newPos.from(e.pos);
            entity.diffPos = entity.newPos._subV(entity.pos);
            entity.moveTime = 0;
            
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

    setInterval(() => {
      let indices = {};

      for (let i = 0; i < events.length; i++) {
        let e = events[i];

        let name = (e.action + ", " + e.path);
        indices[name] = i;
      }

      for (let name in indices) {
        let i = indices[name];
        let e = events[i];

        emit("event", e);
      }

      events.length = 0;
      this.lastPlayer = cloneEntity(this.player);
      
    }, constants.updateInterval);
  }

  start() {
  
  }

  keydown(e) {
    if (nde.getKeyEqual(e.key,"Pause")) {
      nde.transition = new TransitionSlide(scenes.mainMenu, new TimerTime(0.2));
    }
  }

  update(dt) {
    let player = this.player;
    //this.cam.pos = this.car.pos.copy();
    
    player.movement = new Vec(
      nde.getKeyPressed("Move Right") - nde.getKeyPressed("Move Left"),
      nde.getKeyPressed("Move Down") - nde.getKeyPressed("Move Up"),
    ).normalize();
    player.speedMult = nde.getKeyPressed("Run") ? 2 : 1

    for (let o of this.world.objects) {
      if (o.type == "ObjectWater" && o.inBounds(player.pos) && player.movement.sqMag() != 0) {
        player.speedMult *= 0.7;
      }
    }

    for (let i = 0; i < this.world.entities.length; i++) {
      let e = this.world.entities[i];
      e.update(dt);
    }    
    
    //this.cam.pos.addV(this.player.pos._subV(this.cam.pos).mul(dt * 3));
    this.cam.pos.from(this.player.pos);
    
    if (player.pos._subV(this.lastPlayer.pos).sqMag() > 0.0001) {      
      emitEvent({action: "move", pos: player.pos});
    }
    if (Math.abs(player.dir - this.lastPlayer.dir) > 0.0001) {
      emitEvent({action: "number", path: "dir", number: this.player.dir});
    }
  }

  render() {
    let cam = this.cam;
    cam.renderW = nde.w;

    renderer.save();

    renderer.set("fill", [100, 100, 50]);
    renderer.rect(new Vec(0, 0), new Vec(nde.w, nde.w / 16 * 9));



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
      renderer.image(tex[e.texture], e.size._mul(-0.5), e.size);
      renderer.restore();
    }

    renderer.restore();
  }
}