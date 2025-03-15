class Room {
  constructor(name, weight, size) {
    this.name = name;
    this.weight = weight;
    this.size = size;

    this.grid = undefined;
    this.rotGrid = undefined;
    this.objects = undefined;
  }
  

  generate() {
    this.grid = new Array(this.size.x * this.size.y).fill(1);
    this.rotGrid = new Array(this.size.x * this.size.y).fill(0);
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
    let newRotGrid = new Array(this.size.x * this.size.y);
    let pos = new Vec(0, 0);
    for (pos.x = 0; pos.x < this.size.x; pos.x++) {
      for (pos.y = 0; pos.y < this.size.y; pos.y++) {
        let newPos = pos._subV(halfSize).add(0.5).rotateZAxis(angle).addV(newHalfSize).sub(0.5).round();

        let material = this.grid[pos.x + pos.y * this.size.x];
        newGrid[newPos.x + newPos.y * newSize.x] = material;

        let rot = this.rotGrid[pos.x + pos.y * this.size.x];
        newRotGrid[newPos.x + newPos.y * newSize.x] = rot + angle;
        
      }
    }
    this.grid = newGrid;
    this.rotGrid = newRotGrid;

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

    if (data.rotGrid) 
      this.rotGrid = [...data.rotGrid];
    else
      this.rotGrid = new Array(this.size.x * this.size.y).fill(0);

    return this;
  }
}


if (global) {
  global.Room = Room;
}