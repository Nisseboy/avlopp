//let worldData = '{"entities":[],"objects":[{"type":"ObjectText","pos":{"x":0,"y":-4.2},"size":{"x":8.25,"y":1},"text":"[w a s d shift]"},{"type":"ObjectWater","pos":{"x":7.585538576220649,"y":2.850540439806186},"size":{"x":10,"y":10},"texture":"water/1"},{"type":"ObjectWater","pos":{"x":-2.8421968691763335,"y":3.074972344390628},"size":{"x":3,"y":3},"texture":"water/1"},{"type":"ObjectText","pos":{"x":0,"y":-3.2},"size":{"x":3.299999952316284,"y":1},"text":"[e] Inventory"},{"type":"ObjectText","pos":{"x":0,"y":-2.2},"size":{"x":3.299999952316284,"y":1},"text":"[f] Interact"}]}';
//let worldData = '{"entities":[],"objects":[{"type":"ObjectText","pos":{"x":0,"y":-4.2},"size":{"x":8.25,"y":1},"text":"[w a s d shift]"}]}';







class WorldMaterialBase {
  constructor(solid, opaque) {
    this.solid = solid;
    this.opaque = opaque;
  }
  render(pos) {

  }
}
class WorldMaterialColor extends WorldMaterialBase {
  constructor(solid, opaque, color) {
    super(solid, opaque);
    this.color = color;
  }
  render(pos) {
    renderer.set("lineWidth", 0);
    renderer.set("stroke", this.color);
    renderer.set("fill", this.color);
    renderer.rect(pos, new Vec(1, 1));
  }
}


let materials = [
  new WorldMaterialColor(false, false, "rgb(100, 100, 50)"), //0, Grass
  new WorldMaterialColor(false, false, "rgb(100, 100, 100)"), //1, Floor
  new WorldMaterialColor(true, true, "rgb(50, 50, 50)"), //2, Wall
];


class World {
  constructor() {
    this.grid = [];
    this.entities = [];
    this.objects = [];

    this.lights = [];

    this.size = new Vec(1, 1);
  }

  random() {
    this.size = new Vec(21, 21);
    
    this.grid = new Array(this.size.x * this.size.y).fill(0).map(e=>{return Math.floor(Math.random() * 2.2)});
    this.entities = [];

    for (let x = 0; x < this.size.x; x++) {
      for (let y = 0; y < this.size.y; y++) {
        if (x == 0 || y == 0 || x == this.size.x - 1 || y == this.size.y - 1) this.grid[x + y * this.size.x] = 2;
      }
    }

    this.placeRoom(new Room().from(JSON.parse(allRooms[0])).rotate(Math.PI / 2), new Vec(8, 8));

    return this;
  }

  placeRoom(room, pos) {
    let p = new Vec(0, 0);
    for (p.x = 0; p.x < room.size.x; p.x++) {
      for (p.y = 0; p.y < room.size.y; p.y++) {
        let material = room.grid[p.x + p.y * room.size.x];

        this.grid[p.x + pos.x + (p.y + pos.y) * this.size.x] = material;
      }
    }

    for (let o of room.objects) {
      let ob = cloneObject(o);
      ob.pos.addV(pos);
      this.objects.push(ob);
    }
  }

  raycast(startPos, angle, maxLength = 10000) {
    let dirx = Math.cos(angle);
    let diry = Math.sin(angle);
    if (dirx == 0) dirx = 0.001;
    if (diry == 0) diry = 0.001;

    let small = 0.0000000001;

    let startPosx = startPos.x;
    let startPosy = startPos.y;

    let sizex = this.size.x;
    let sizey = this.size.y;

    let posx = startPos.x;
    let posy = startPos.y;

    let signx = Math.sign(dirx);
    let signy = Math.sign(diry);
    let fx = (signx == 1) ? Math.ceil : Math.floor;
    let fy = (signy == 1) ? Math.ceil : Math.floor;
    
    while (true) {
      let a = fx(posx + small * signx);
      let b = fy(posy + small * signy);

      let ny = this.lineFuncY(startPosx, startPosy, dirx, diry, a);
      let nx = this.lineFuncX(startPosx, startPosy, dirx, diry, b);

      if (nx * signx > fx(posx + small * signx) * signx) { 
        posx = a;
        posy = ny;
        //uv = ny % 1;
      } 
      else {
        posy = b;
        posx = nx;
        //uv = nx % 1;
      }
      
      let sqd = (posx - startPosx) ** 2 + (posy - startPosy) ** 2;
      let newPosx = Math.floor(posx + signx * small);
      let newPosy = Math.floor(posy + signy * small);

      if (newPosx < 0 || newPosx >= sizex || newPosy < 0 || newPosy >= sizey || sqd > maxLength ** 2) {
        return {
          length: Math.sqrt(sqd),
          hitPos: new Vec(posx, posy),
          blockPos: new Vec(newPosx, newPosy),
          hit: false,
        };
      }

      if (materials[this.grid[newPosx + newPosy * this.size.x]].solid) {
        return {
          length: Math.sqrt(sqd),
          hitPos: new Vec(posx, posy),
          blockPos: new Vec(newPosx, newPosy),
          hit: true,
        };
      }
    }
  }
  lineFuncY(startPosx, startPosy, dirx, diry, x) {
    return (diry / dirx) * (x - startPosx) + startPosy;
  }
  lineFuncX(startPosx, startPosy, dirx, diry, y) {
    return (dirx / diry) * (y - startPosy) + startPosx;
  }

  from(data) {
    this.size = new Vec().from(data.size);

    let e = data.entities;
    for (let i = 0; i < e.length; i++) {      
      this.entities[i] = cloneEntity(e[i], ((e[i].type == "EntityPlayer" && e[i].id != id) ? EntityPlayerOther : e[i].type));
    }

    let obs = data.objects;
    for (let i = 0; i < obs.length; i++) {
      let o = obs[i];

      let ob = cloneObject(o);
      
      this.objects[i] = ob;
    }

    this.grid = data.grid;

    return this;
  }
}

if (global) {
  global.World = World;
}