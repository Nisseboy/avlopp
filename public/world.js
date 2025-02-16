//let worldData = '{"entities":[],"objects":[{"type":"ObjectText","pos":{"x":0,"y":-4.2},"size":{"x":8.25,"y":1},"text":"[w a s d shift]"},{"type":"ObjectWater","pos":{"x":7.585538576220649,"y":2.850540439806186},"size":{"x":10,"y":10},"texture":"water/1"},{"type":"ObjectWater","pos":{"x":-2.8421968691763335,"y":3.074972344390628},"size":{"x":3,"y":3},"texture":"water/1"},{"type":"ObjectText","pos":{"x":0,"y":-3.2},"size":{"x":3.299999952316284,"y":1},"text":"[e] Inventory"},{"type":"ObjectText","pos":{"x":0,"y":-2.2},"size":{"x":3.299999952316284,"y":1},"text":"[f] Interact"}]}';
let worldData = '{"entities":[],"objects":[{"type":"ObjectText","pos":{"x":0,"y":-4.2},"size":{"x":8.25,"y":1},"text":"[w a s d shift]"}]}';

class World {
  constructor() {
    let data = JSON.parse(worldData);
    this.entities = data.entities;
    this.objects = data.objects;
  }

  from(data) {
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

    return this;
  }
}

if (global) global.World = World;