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
    //Player light
    this.world.lights.push(new LightPoint(new Vec(8, 4.5), new Vec(8, 8), 0.3));

    this.world.objects.forEach(object => {object.load(world)});


    this.player = this.world.entities.find(e=>e.id == id);
    this.player.pos.from(this.world.lights[1].pos);

    //Create lookup table for all entities by id
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
          case "update slots":
            this.idLookup[e.id].slots = e.slots;
            this.idLookup[e.id].slot = e.slot;
            break;



          case "create entity":
            this.createEntity(e.entity);      
            break;

            
          case "vec":
            this.idLookup[e.entityId][e.path].from(e.vec);
            break;
          case "primitive":
            this.idLookup[e.entityId][e.path] = e.primitive;
            break;
          case "remove entity":
            this.removeEntity(e.entityId);      
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

      let sendEvents = [];
      for (let name in indices) {
        let i = indices[name];
        let e = events[i];

        sendEvents.push(e);
      }
      if (sendEvents.length != 0) emit("event", {events: sendEvents});

      events.length = 0;
      
    }, constants.updateInterval);
  }

  start() {
  
  }

  keydown(e) {
    this.handleInput(e.key);
  }

  mousedown(e) {
    this.handleInput("mouse" + e.button);
  }

  handleInput(key) {
    let player = this.player;
    let world = this.world;

    if (nde.getKeyEqual(key,"Pause")) {
      nde.transition = new TransitionSlide(scenes.mainMenu, new TimerTime(0.2));
    }

    if (nde.getKeyEqual(key,"Pick Up") && player.hoveredItem != undefined) {
      let emptySlot = undefined;
      for (let i = 0; i < player.slotAmount; i++) {if (player.slots[i] == undefined) emptySlot = i}
      if (emptySlot == undefined) return;
      

      this.removeEntity(player.hoveredItem.id);
      emitEvent({action: "remove entity", entityId: player.hoveredItem.id});

      
      let ent = cloneEntity(player.hoveredItem);
      ent.id = generateID();

      let entity = this.createEntity(ent);
      emitEvent({action: "create entity", entity: ent});

      player.slots[emptySlot] = entity.id;
      player.slot = emptySlot;

      emitEvent({action: "update slots", slots: player.slots, slot: player.slot});

      player.hoveredItem = undefined;
    }
    
    let heldItem = player.slots[player.slot];
    if (nde.getKeyEqual(key,"Drop Item") && heldItem != undefined) {
      player.slots[player.slot] = undefined;
      emitEvent({action: "update slots", slots: player.slots, slot: player.slot});

      let entity = this.idLookup[heldItem];
      emitEvent({action: "vec", entityId: entity.id, path: "pos", vec: entity.pos});
      emitEvent({action: "primitive", entityId: entity.id, path: "dir", primitive: entity.dir});
      
    }
    
    if (nde.getKeyEqual(key,"Use Item") && heldItem != undefined) {
      this.idLookup[heldItem].use();
      this.idLookup[heldItem].emitState();
    }
  }
  

  wheel(e) {
    if (!nde.debug) return;

    if (e.deltaY < 0) this.cam.w /= 1.2;
    else this.cam.w *= 1.2;
  }

  update(dt) {
    let player = this.player;
    
    player.movement = new Vec(
      nde.getKeyPressed("Move Right") - nde.getKeyPressed("Move Left"),
      nde.getKeyPressed("Move Down") - nde.getKeyPressed("Move Up"),
    ).normalize();
    player.speedMult = nde.getKeyPressed("Run") ? 2 : 1;


    //Update all the entities
    let entityGrid = [];
    for (let i = 0; i < this.world.entities.length; i++) {
      let e = this.world.entities[i];
      e.clientUpdate(dt, this.world);


      if (e instanceof EntityPlayer) {
        for (let i = 0; i < e.slotAmount; i++) {
          if (e.slots[i] == undefined) continue;
          let item = this.idLookup[e.slots[i]];

          if (i != e.slot) {item.pos.x = 1000; item.pos.y = 1000}
          else {
            let angle = e.dir + 0.7;
            let dist = 0.46;
            item.pos.from(e.pos).addV(new Vec(Math.cos(angle), Math.sin(angle)).mul(dist));
          }
        }
      }


      //Create entity grid
      let index = Math.floor(e.pos.x) + Math.floor(e.pos.y) * this.world.size.x;
      if (entityGrid[index] == undefined) entityGrid[index] = [];
      entityGrid[index].push(e.id);
    }    

    let heldItem = player.slots[player.slot];
    if (heldItem != undefined) {
      this.idLookup[heldItem].dir = Math.atan2(nde.mouse.y- nde.w / 16 * 9 / 2, nde.mouse.x - nde.w / 2);
    }

    //Move player light and cam to player
    this.cam.pos.from(this.player.pos);
    this.world.lights[0].pos.from(player.pos);
    this.world.lights[0].cached = false;


    //Find closest item to player;
    let closestSqDist = Infinity;
    for (let x = -1; x < 2; x++) {
      for (let y = -1; y < 2; y++) {
        let entities = entityGrid[Math.floor(player.pos.x + x) + Math.floor(player.pos.y + y) * this.world.size.x];
        if (!entities) continue;

        for (let eid of entities) {
          if (eid == player.id) continue;

          let e = this.idLookup[eid];

          if(!(e instanceof EntityItem)) continue;

          let held = false;
          for (let p of this.world.entities) {
            for (let i = 0; i < p.slotAmount; i++) {
              if (p.slots[i] == eid) held = true;
            }
          }
          if (held) continue;
          
          let sqd = e.pos._subV(player.pos).sqMag();

          if (sqd < closestSqDist) {
            closestSqDist = sqd;
            player.hoveredItem = e;
          }
        }
      }
    }



    nde.debugStats.pos = this.cam.pos._floor().toString();
  }

  render() {
    let cam = this.cam;
    let player = this.player;

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


    renderer.save();
    if (settings.lightingEnabled) {
      renderer.img.ctx.globalCompositeOperation = "multiply";
      let renderedLights = 0;
      for (let i = 0; i < this.world.lights.length; i++) {
        let l = this.world.lights[i];
        
        let sqd = l.pos._subV(cam.pos).sqMag();
        if (sqd > (Math.max(l.size.x, l.size.y) / 2 + cam.w / 2) ** 2) continue;

        l.render(l.pos, this.lightingTexture);
        renderedLights++;
      }
      renderer.image(this.lightingTexture, cam.pos._subV(camSize._div(2)), camSize);

      //console.log(`${renderedLights} Lights renderered this frame`);
      
  
  
      createVisibilityMask(this.visibilityMaskTexture, cam.pos, cam.w *0.6);
      renderer.image(this.visibilityMaskTexture, cam.pos._subV(camSize._div(2)), camSize);
    }
    renderer.restore();


    if (player.hoveredItem) {
      let emptySlot = false;
      for (let i = 0; i < player.slotAmount; i++) if (player.slots[i] == undefined) emptySlot = true;

      let text;
      if (emptySlot) text = `[${nde.getKeyCode("Pick Up")}] ${player.hoveredItem.name}`;
      else text = `[${nde.getKeyCode("Drop Item")}] to drop item`;

      renderer.set("font", "0.2px monospace");
      renderer.set("textAlign", ["left", "middle"]);
      renderer.set("fill", 255);
      renderer.text(text, player.hoveredItem.pos);
    }


    renderer.restore();
  }

  removeEntity(id) {
    let entity = this.idLookup[id];
    if (!entity) return false;

    entity.unload(this.world);

    this.world.entities.splice(this.world.entities.indexOf(entity), 1);
    delete this.idLookup[id];

    return true;
  }
  createEntity(entity) {
    let e = cloneEntity(entity);

    this.world.entities.push(e);
    this.idLookup[e.id] = e;

    return e;
  }
}