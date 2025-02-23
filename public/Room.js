let allRooms = [
  '{"name":"Corridor Duck","weight":0.01,"size":{"x":5,"y":5},"grid":[2,4,4,4,2,4,1,1,1,4,4,1,1,1,4,4,1,1,1,4,2,4,4,4,2],"objects":[{"type":"ObjectTextureLight","pos":{"x":1.8,"y":1.8},"size":{"x":2,"y":2},"dir":0.7853981633974483,"texture":"duck/1","lightSize":{"x":8,"y":8},"lightStrength":1}]}',
  '{"name":"Corridor 1","weight":1,"size":{"x":5,"y":5},"grid":[2,4,4,4,2,4,1,1,1,4,4,1,1,1,4,4,1,1,1,4,2,4,4,4,2],"objects":[]}',
  '{"name":"Corridor 2","weight":0.2,"size":{"x":5,"y":5},"grid":[2,4,4,4,2,4,1,1,1,4,4,1,1,1,4,4,1,1,3,4,2,4,4,4,2],"objects":[]}',
  '{"name":"Pond","weight":1,"size":{"x":10,"y":10},"grid":[2,2,4,2,2,2,2,2,2,2,2,1,1,0,0,0,0,1,1,2,2,0,0,0,0,0,0,0,1,4,2,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,1,2,2,1,0,0,0,0,0,0,1,2,2,2,4,2,2,2,2,4,2,2],"objects":[{"type":"ObjectTextureLight","pos":{"x":5,"y":5},"size":{"x":6,"y":6},"dir":0,"texture":"water/1","lightSize":{"x":16,"y":16},"lightStrength":2}]}',

];

class Room {
  constructor(name, weight, size) {
    this.name = name;
    this.weight = weight;
    this.size = size;

    this.grid = undefined;
    this.objects = undefined;
  }
  

  generate() {
    this.grid = new Array(this.size.x * this.size.y).fill(1);
    this.objects = [];

    for (let x = 0; x < this.size.x; x++) {
      for (let y = 0; y < this.size.y; y++) {
        if (x == 0 || y == 0 || x == this.size.x - 1 || y == this.size.y - 1) this.grid[x + y * this.size.x] = 2;
      }
    }

    return this;
  }

  rotate(angle) {
    let newSize = this.size._rotateZAxis(angle).round();
    newSize.x = Math.abs(newSize.x);
    newSize.y = Math.abs(newSize.y);

    let halfSize = this.size._div(2);
    let newHalfSize = newSize._div(2);

    for (let e of this.objects) {
      e.pos.subV(halfSize).rotateZAxis(angle).addV(newHalfSize);
      e.dir += angle;
    }

    let newGrid = new Array(this.size.x * this.size.y);
    let pos = new Vec(0, 0);
    for (pos.x = 0; pos.x < this.size.x; pos.x++) {
      for (pos.y = 0; pos.y < this.size.y; pos.y++) {
        let newPos = pos._subV(halfSize).add(0.5).rotateZAxis(angle).addV(newHalfSize).sub(0.5).round();

        let material = this.grid[pos.x + pos.y * this.size.x];
        newGrid[newPos.x + newPos.y * newSize.x] = material;
        
      }
    }
    this.grid = newGrid;

    this.size = newSize;

    return this;
  }

  
  from(data) {
    this.name = data.name;
    this.weight = data.weight;
    this.size = new Vec().from(data.size);

    let obs = data.objects;
    this.objects = [];
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
  global.Room = Room;
  global.allRooms = allRooms;
}