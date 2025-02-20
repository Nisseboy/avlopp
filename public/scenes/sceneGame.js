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

    this.visibilityMaskTexture = new Img(renderer.img.size);
    this.lightingTexture = new Img(renderer.img.size);
  }
  loadWorld(world) {    
    this.world = world;
    this.world.lights.push(new LightPoint(new Vec(8, 4.5), new Vec(8, 8), 0.1));
    this.world.lights.push(new LightPoint(new Vec(8, 4.5), new Vec(8, 8), 1));

    this.player = this.world.entities.find(e=>e.id == id);
    this.lastPlayer = cloneEntity(this.player);

    this.idLookup = {};
    for (let i in this.world.entities) {
      let e = this.world.entities[i];
      this.idLookup[e.id] = e;
    }

    socket.on("update", data => {
      for (let e of data.events) {
        switch (e.action) {
          case "connect":
            let newPlayer = cloneEntity(e.player, EntityPlayerOther);
            this.world.entities.push(newPlayer);
            this.idLookup[e.id] = newPlayer;
            break;
          case "disconnect":
            this.world.entities.splice(this.world.entities.findIndex(elem=>elem.id == e.id), 1);
            delete this.idLookup[e.id];
            break;

          case "move":
            let entity = this.idLookup[e.id];
            
            entity.newPos.from(e.pos);
            entity.diffPos = entity.newPos._subV(entity.pos);
            entity.moveTime = 0;
            
            break;
          case "vec":
            this.idLookup[e.id][e.path].from(e.vec);
            break;
          case "number":
            this.idLookup[e.id][e.path] = e.number;
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
  

  wheel(e) {
    if (!nde.debug) return;

    if (e.deltaY < 0) this.cam.w /= 1.2;
    else this.cam.w *= 1.2;
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
    this.world.lights[0].pos.from(player.pos);
    this.world.lights[0].cached = false;
    
    //this.cam.pos.addV(this.player.pos._subV(this.cam.pos).mul(dt * 1));
    this.cam.pos.from(this.player.pos);

    
    if (player.pos._subV(this.lastPlayer.pos).sqMag() > 0.0001) {      
      emitEvent({action: "move", pos: player.pos});
    }
    if (Math.abs(player.dir - this.lastPlayer.dir) > 0.0001) {
      emitEvent({action: "number", path: "dir", number: this.player.dir});
    }

    nde.debugStats.pos = this.cam.pos._floor().toString();
  }

  render() {
    let cam = this.cam;
    cam.renderW = nde.w;
    if (this.visibilityMaskTexture.size.x != renderer.img.size.x) this.visibilityMaskTexture.resize(renderer.img.size);
    if (this.lightingTexture.size.x != renderer.img.size.x) this.lightingTexture.resize(renderer.img.size);

    this.lightingTexture.ctx.fillStyle = "rgb(0, 0, 0)";
    this.lightingTexture.ctx.fillRect(0, 0, this.lightingTexture.size.x, this.lightingTexture.size.y);

    renderer.save();


    //renderer.set("fill", [100, 100, 50]);
    //renderer.rect(vecZero, new Vec(nde.w, nde.w / 16 * 9));



    renderer.save();

    cam.applyTransform();
    renderer.set("lineWidth", cam.unScaleVec(new Vec(1)).x);

    renderer.save();
    let tl = cam.pos._subV(new Vec(cam.w, cam.w / 16 * 9).mul(0.5)).floor();
    renderer.translate(tl);
    
    let v = new Vec();

    for (v.x = 0; v.x < cam.w + 1; v.x++) {
      for (v.y = 0; v.y < cam.w / 16 * 9 + 1; v.y++) {
        if (tl.x + v.x < 0 || tl.x + v.x >= this.world.size.x || tl.y + v.y < 0 || tl.y + v.y >= this.world.size.y) continue;

        materials[this.world.grid[tl.x + v.x + (tl.y + v.y) * this.world.size.x]].render(v);
      }
    }
    
    renderer.restore();


    

    for (let i = 0; i < this.world.objects.length; i++) {
      let o = this.world.objects[i];

      o.render(o.pos);
      
    }
    
    

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



    for (let i = 0; i < this.world.entities.length; i++) {
      let e = this.world.entities[i];
      e.render(e.pos);
    }


    if (settings.lightingEnabled) {
      renderer.img.ctx.globalCompositeOperation = "multiply";
      for (let i = 0; i < this.world.lights.length; i++) {
        let l = this.world.lights[i];
  
        l.render(l.pos, this.lightingTexture);
      }
      renderer.image(this.lightingTexture, cam.pos._subV(camSize._div(2)), camSize);
  
  
      createVisibilityMask(this.visibilityMaskTexture, cam.pos);
      renderer.image(this.visibilityMaskTexture, cam.pos._subV(camSize._div(2)), camSize);
    }


    renderer.restore();
  }
}