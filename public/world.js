let worldData = '{"entities":[],"objects":[{"objectType":"ObjectText","pos":{"x":0,"y":-4.2},"size":{"x":8.25,"y":1},"text":"[w a s d shift]"},{"objectType":"ObjectWater","pos":{"x":7.585538576220649,"y":2.850540439806186},"size":{"x":10,"y":10},"texture":"water/1"}]}';


class World {
  constructor() {
    let data = JSON.parse(worldData);
    this.entities = data.entities;
    this.objects = data.objects;
  }

  from(data) {
    let e = data.entities;
    for (let i = 0; i < e.length; i++) {
      let type = e[i].id == id ? EntityPlayer : Entity;
      this.entities[i] = new type().from(e[i]);
    }

    let obs = data.objects;
    for (let i = 0; i < obs.length; i++) {
      let o = obs[i];

      let ob = (new objectTypes[o.objectType]()).from(o);
      
      this.objects[i] = ob;
    }

    return this;
  }
}

if (exports) {
  exports.World = World;
}