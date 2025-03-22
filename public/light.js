

class LightBase {
  constructor(pos, size, strength) {
    this.pos = pos;
    this.dir = 0;
    this.size = size;
    this.strength = strength;

    this.oldPos = new Vec(0, 0);
    this.oldDir = 0;

    this.tex = undefined;
    this.cachedLightTexture = undefined;

    this.ignoreWalls = false;

    this.fov = Math.PI * 2;
  }

  render(pos, lightingTexture) {
    if (this.cachedLightTexture == undefined) {
      this.cachedLightTexture = new Img(new Vec(renderer.img.size.x, renderer.img.size.x));

    }
    if (this.cachedLightTexture.size.x != renderer.img.size.x) {
      this.cachedLightTexture.resize(new Vec(renderer.img.size.x, renderer.img.size.x));
      this.oldDir = undefined;
    }

    let cam = scenes.game.cam;

    let mask = this.cachedLightTexture;
    let img = lightingTexture;

    img.ctx.setTransform(renderer.img.ctx.getTransform());

    if (this.oldPos.x != this.pos.x || this.oldPos.y != this.pos.y || this.oldDir != this.dir) {
      renderer.save();
      renderer.translate(cam.pos._subV(pos));

      mask.ctx.setTransform(renderer.img.ctx.getTransform());
      //mask.ctx.translate(0, (renderer.img.size.x - renderer.img.size.y) / 2);
      
      mask.ctx.translate(0, 3.5); //(16, 9) -> (16, 16)   (+0*2, +3.5*2)
      if (!this.ignoreWalls) createVisibilityMask(mask, pos, this.dir, this.fov, Math.max(this.size.x, this.size.y) / 2, true);
      renderer.restore();

      

      mask.ctx.save();


      let size = mask.size._div(cam.w).mulV(this.size);      
      
      mask.ctx.resetTransform();
      if (this.ignoreWalls) {
        mask.ctx.fillStyle = "rgb(255, 255, 255)";
        mask.ctx.fillRect(0, 0, mask.size.x, mask.size.y);
      }
      mask.ctx.translate(mask.size.x / 2, mask.size.y / 2);
      mask.ctx.rotate(this.dir);

      mask.ctx.globalCompositeOperation = "destination-in";
      mask.ctx.drawImage(this.tex.canvas, -size.x / 2 + 1, -size.y / 2 + 1, size.x - 2, size.y- 2);

      mask.ctx.globalCompositeOperation = "multiply";
      mask.ctx.filter = `brightness(${this.strength * (settings.brightness / 100) * 100}%)`;
      mask.ctx.drawImage(this.tex.canvas, -size.x / 2, -size.y / 2, size.x, size.y);


      mask.ctx.restore();
      
      this.oldPos.from(this.pos);
      this.oldDir = this.dir;
    }
    

    img.ctx.save();
    img.ctx.globalCompositeOperation = "lighter";
    img.ctx.drawImage(mask.canvas, pos.x - cam.w / 2, pos.y - cam.w / 2, cam.w, cam.w);
    img.ctx.restore();

    return lightingTexture;
  }
}

let lightPointTexture = createLightGradient(new Vec(320, 320), new Vec(255, 220, 100), 100);
class LightPoint extends LightBase {
  constructor(pos, size, strength) {
    super(pos, size, strength);
    
    this.tex = lightPointTexture;
  }
}

let lightBeamTexture = createLightBeam(new Vec(320, 320), new Vec(255, 220, 100), 100, Math.PI / 4);
class LightBeam extends LightBase {
  constructor(pos, size, strength) {
    super(pos, size, strength);
    
    this.tex = lightBeamTexture;

    this.fov = Math.PI / 4;
  }
}


function createLightGradient(size, color, strength) {
  let img = new Img(size);
  let middle = size._div(2);
  let imageData = img.ctx.getImageData(0, 0, size.x, size.y);
  let data = imageData.data;

  let smallest = Math.min(size.x, size.y);

  let pos = new Vec(0, 0);
  for (pos.x = 0; pos.x < size.x; pos.x++) {
    for (pos.y = 0; pos.y < size.y; pos.y++) {
      let d = pos._subV(middle).mag();

      let m = Math.min(Math.max(1 - (d / smallest * 200 / strength) ** 0.25, 0), 1);

      let k = (pos.x + pos.y * size.x) * 4;
      data[k++] = color.x * m;
      data[k++] = color.y * m;
      data[k++] = color.z * m;
      if (color.w) data[k++] = color.w * m;
      else data[k++] = 255;
      
    }
  }
  
  img.ctx.putImageData(imageData, 0, 0);

  return img;
}

function createLightBeam(size, color, strength, fov) {
  let img = new Img(size);
  let middle = size._div(2);
  let imageData = img.ctx.getImageData(0, 0, size.x, size.y);
  let data = imageData.data;

  let smallest = Math.min(size.x, size.y);

  let pos = new Vec(0, 0);
  for (pos.x = 0; pos.x < size.x; pos.x++) {
    for (pos.y = 0; pos.y < size.y; pos.y++) {
      let diff = pos._subV(middle);
      let d = diff.mag();

      let angle = Math.atan2(diff.y, diff.x);

      let m = Math.min(Math.max(1 - (d / smallest * 200 / strength) ** 0.25, 0) * (1 - Math.abs(angle / (fov / 2))), 1);

      let k = (pos.x + pos.y * size.x) * 4;
      data[k++] = color.x * m;
      data[k++] = color.y * m;
      data[k++] = color.z * m;
      if (color.w) data[k++] = color.w * m;
      else data[k++] = 255;
      
    }
  }
  
  img.ctx.putImageData(imageData, 0, 0);

  return img;
}


function createVisibilityMask(visibilityMaskTexture, pos, dir, fov, maxLength, transformOverride = false) {  
  let img = visibilityMaskTexture;
  img.ctx.fillStyle = "rgb(0, 0, 0)";
  img.ctx.fillRect(0, 0, img.size.x, img.size.y);

  if (!transformOverride) img.ctx.setTransform(renderer.img.ctx.getTransform());

  img.ctx.fillStyle = "rgb(255, 255, 255)";
  img.ctx.strokeStyle = "rgb(255, 255, 255)";
  img.ctx.lineWidth = 0.3;
  img.ctx.beginPath();
  
  let full = Math.PI * 2;
  let step = full / settings.visibilitySamples;
  for (let i = 0; i < full; i += step) {
    if (getDeltaAngle(i, dir) > fov / 2) continue;

    let hitInfo = world.raycast(pos, i, true, false, maxLength);

    img.ctx.lineTo(hitInfo.hitPos.x, hitInfo.hitPos.y);
  }
  
  
  img.ctx.fill();
  img.ctx.stroke();

  return img;
}