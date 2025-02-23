//let worldData = '{"entities":[],"objects":[{"type":"ObjectText","pos":{"x":0,"y":-4.2},"size":{"x":8.25,"y":1},"text":"[w a s d shift]"},{"type":"ObjectWater","pos":{"x":7.585538576220649,"y":2.850540439806186},"size":{"x":10,"y":10},"texture":"water/1"},{"type":"ObjectWater","pos":{"x":-2.8421968691763335,"y":3.074972344390628},"size":{"x":3,"y":3},"texture":"water/1"},{"type":"ObjectText","pos":{"x":0,"y":-3.2},"size":{"x":3.299999952316284,"y":1},"text":"[e] Inventory"},{"type":"ObjectText","pos":{"x":0,"y":-2.2},"size":{"x":3.299999952316284,"y":1},"text":"[f] Interact"}]}';
//let worldData = '{"entities":[],"objects":[{"type":"ObjectText","pos":{"x":0,"y":-4.2},"size":{"x":8.25,"y":1},"text":"[w a s d shift]"}]}';







class WorldMaterial {
  constructor(solid, opaque, texture) {
    this.solid = solid;
    this.opaque = opaque;
    this.texture = texture;
  }
  render(pos) {
    renderer.image(tex[this.texture], pos, new Vec(1, 1));
  }
}


let materials = [
  new WorldMaterial(false, false, "material/grass/1"), //0
  new WorldMaterial(false, false, "material/floor/1"), //1
  new WorldMaterial(true, true, "material/wall/1"), //2
  new WorldMaterial(false, false, "material/floor/drain"), //3
  new WorldMaterial(false, false, "material/marker/entrance"), //4
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
    this.size = new Vec(constants.worldSize*5, constants.worldSize*5);
    
    this.grid = new Array(this.size.x * this.size.y).fill(0).map(e=>{return Math.floor(Math.random() * 2.2)});
    this.entities = [];

    for (let x = 0; x < this.size.x; x++) {
      for (let y = 0; y < this.size.y; y++) {
        if (x == 0 || y == 0 || x == this.size.x - 1 || y == this.size.y - 1) this.grid[x + y * this.size.x] = 2;
      }
    }

    let mazeSize = new Vec(this.size.x / 5, this.size.y / 5);
    let maze = new Array(mazeSize.x).fill(undefined).map(e => {return new Array(mazeSize.y).fill(undefined)});
    let pos = mazeSize._div(2).floor();
    maze[pos.x][pos.y] = [false, false, false, false]; 

    let stack = [];

    while (true) {
      let current = maze[pos.x][pos.y];

      let neighbours = [];
      let dirs = [];
      if (pos.x > 0 && maze[pos.x - 1][pos.y] == undefined) {neighbours.push(new Vec(pos.x - 1, pos.y)); dirs.push(0); }
      if (pos.y > 0 && maze[pos.x][pos.y - 1] == undefined) {neighbours.push(new Vec(pos.x, pos.y - 1)); dirs.push(1); }
      if (pos.x < mazeSize.x - 1 && maze[pos.x + 1][pos.y] == undefined) {neighbours.push(new Vec(pos.x + 1, pos.y)); dirs.push(2); }
      if (pos.y < mazeSize.y - 1 && maze[pos.x][pos.y + 1] == undefined) {neighbours.push(new Vec(pos.x, pos.y + 1)); dirs.push(3); }

      if (neighbours.length == 0) {
        if (stack.length == 0) {
          break;
        }
        pos = stack.pop();
        
        continue;
      }
      if (neighbours.length > 1) {
        stack.push(pos);
      }

      let index = Math.floor(Math.random() * neighbours.length);
      let neighbour = neighbours[index];
      let dir = dirs[index];

      current[dir] = true;

      let other = [false, false, false, false];
      other[(dir + 2) % 4] = true;

      maze[neighbour.x][neighbour.y] = other;

      pos = new Vec(neighbour.x, neighbour.y);
    }


    let parsedRooms = [];
    let totalWeightAll = 0;
    for (let i in allRooms) {
      parsedRooms[i] = JSON.parse(allRooms[i]);
      totalWeightAll += parsedRooms[i].weight;
    }

    let occupied = new Array(mazeSize.x).fill(undefined).map(e => {return new Array(mazeSize.y).fill(false)});
    let gridPos = new Vec(0, 0);
    for (gridPos.x = 0; gridPos.x < mazeSize.x; gridPos.x++) {
      for (gridPos.y = 0; gridPos.y < mazeSize.y; gridPos.y++) {
        if (occupied[gridPos.x][gridPos.y]) continue;

        let pos = gridPos._mul(5);

        let remainingRooms = [...parsedRooms];
        let totalWeight = totalWeightAll;
        let remainingSpins = 0;

        let room;
        middle: while (true) {
          if (remainingSpins > 0) {
            room.rotate(Math.PI / 2);
            remainingSpins--;
          } else {
            let index;
            let rand = Math.random() * totalWeight;
            let cumWeight = 0;
  
            
            for (let i = 0; i < remainingRooms.length; i++) {
              let r = remainingRooms[i];
              cumWeight += r.weight;
              
              if (cumWeight > rand) { 
                index = i;
                break;
              }
            }

            room = new Room().from(remainingRooms[index]);
            remainingRooms.splice(index, 1);
            totalWeight -= room.weight;

            room.rotate(Math.floor(Math.random() * 4) * Math.PI / 2);
            remainingSpins = 3;
          }
          
          
          
          
          let roomPos = new Vec(0, 0);
          for (roomPos.x = 0; roomPos.x < room.size.x / 5; roomPos.x++) {
            for (roomPos.y = 0; roomPos.y < room.size.y / 5; roomPos.y++) {
              let gridPosActual = gridPos._addV(roomPos);
              if (gridPosActual.x > mazeSize.x - 1 || gridPosActual.y > mazeSize.y - 1 || occupied[gridPosActual.x][gridPosActual.y]) continue middle;
            }
          }
          

          let toReplace = [];

          roomPos = new Vec(0, 0);
          for (roomPos.y = 0; roomPos.y < room.size.y / 5; roomPos.y++) {
            let gridPosActual = gridPos._addV(roomPos);
            let block = maze[gridPosActual.x][gridPosActual.y];

            if (block[0]) {
              let roomPosActual = new Vec(roomPos.x * 5, roomPos.y * 5 + 2);
              if (room.grid[roomPosActual.x + roomPosActual.y * room.size.x] != 4 /*Entrance marker*/) continue middle;
              toReplace.push(roomPosActual);
            }
          }

          roomPos = new Vec(0, 0);
          for (roomPos.x = 0; roomPos.x < room.size.x / 5; roomPos.x++) {
            let gridPosActual = gridPos._addV(roomPos);
            let block = maze[gridPosActual.x][gridPosActual.y];

            if (block[1]) {
              let roomPosActual = new Vec(roomPos.x * 5 + 2, roomPos.y * 5);
              if (room.grid[roomPosActual.x + roomPosActual.y * room.size.x] != 4 /*Entrance marker*/) continue middle;
              toReplace.push(roomPosActual);
            }
          }

          roomPos = new Vec(room.size.x / 5 - 1, 0);
          for (roomPos.y = 0; roomPos.y < room.size.y / 5; roomPos.y++) {
            let gridPosActual = gridPos._addV(roomPos);
            let block = maze[gridPosActual.x][gridPosActual.y];

            if (block[2]) {
              let roomPosActual = new Vec(roomPos.x * 5 + 4, roomPos.y * 5 + 2);
              if (room.grid[roomPosActual.x + roomPosActual.y * room.size.x] != 4 /*Entrance marker*/) continue middle;
              toReplace.push(roomPosActual);
            }
          }

          roomPos = new Vec(0, room.size.y / 5 - 1);
          for (roomPos.x = 0; roomPos.x < room.size.x / 5; roomPos.x++) {
            let gridPosActual = gridPos._addV(roomPos);
            let block = maze[gridPosActual.x][gridPosActual.y];

            if (block[3]) {
              let roomPosActual = new Vec(roomPos.x * 5 + 2, roomPos.y * 5 + 4);
              if (room.grid[roomPosActual.x + roomPosActual.y * room.size.x] != 4 /*Entrance marker*/) continue middle;
              toReplace.push(roomPosActual);
            }
          }

          for (let p of toReplace) {
            room.grid[p.x + p.y * room.size.x] = 1;
            if (p.x > 0 && room.grid[(p.x - 1) + (p.y) * room.size.x] == 4)room.grid[(p.x - 1) + (p.y) * room.size.x] = 1;
            if (p.y > 0 && room.grid[(p.x) + (p.y - 1) * room.size.x] == 4)room.grid[(p.x) + (p.y - 1) * room.size.x] = 1;
            if (p.x < room.size.x - 1 && room.grid[(p.x + 1) + (p.y) * room.size.x] == 4)room.grid[(p.x + 1) + (p.y) * room.size.x] = 1;
            if (p.y < room.size.y - 1 && room.grid[(p.x) + (p.y + 1) * room.size.x] == 4)room.grid[(p.x) + (p.y + 1) * room.size.x] = 1;
          }

          
          roomPos = new Vec(0, 0);
          for (roomPos.x = 0; roomPos.x < room.size.x / 5; roomPos.x++) {
            for (roomPos.y = 0; roomPos.y < room.size.y / 5; roomPos.y++) {
              let gridPosActual = gridPos._addV(roomPos);
              occupied[gridPosActual.x][gridPosActual.y] = true;
            }
          }

          this.placeRoom(room, pos);


          break;
        }
      }
    }

    for (let i in this.grid) {
      if (this.grid[i] == 4 /*Entrance marker*/) this.grid[i] = 2; /*Wall*/
    }

    /*let str = "";
    for (let x = 0; x < mazeSize.x; x++) {
      for (let y = 0; y < mazeSize.y; y++) {
        let block = maze[x][y];
        str += block[0] ? 1 : 0;
        str += block[1] ? 1 : 0;
        str += block[2] ? 1 : 0;
        str += block[3] ? 1 : 0;

        str += " ";
      }
      str += "\n";
    }

    console.log(str);*/

    let totalWeightItems = 0;
    for (let i in allItems) {
      totalWeightItems += allItems[i].weight;
    }
    for (let i = 0; i < constants.itemAmount; i++) {
      let pos = new Vec(Math.random() * this.size.x, Math.random() * this.size.y);
      let fpos = pos._floor();

      if (materials[this.grid[fpos.x + fpos.y * this.size.x]].solid) {i--; continue;}

      
      let rand = Math.random() * totalWeightItems;
      let cumWeight = 0;

      for (let i = 0; i < allItems.length; i++) {
        let item = allItems[i];
        cumWeight += item.weight;
        
        if (cumWeight > rand) { 
          let e = cloneEntity(item);
          e.pos = pos;
          e.dir = Math.random() * Math.PI * 2;

          this.entities.push(e);          
        }
      }
    }


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
          length: maxLength,
          hitPos: new Vec(startPosx + dirx * maxLength, startPosy + diry * maxLength),
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

    this.grid = [...data.grid];

    return this;
  }
}

if (global) {
  global.World = World;
}