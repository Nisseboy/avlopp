

class LightBase {
  constructor(pos, size, strength) {
    this.pos = pos;
    this.size = size;
    this.strength = strength;

    this.tex = undefined;
    this.cachedLightTexture = undefined;
    this.cached = false;
  }

  render(pos, lightingTexture) {
    if (this.cachedLightTexture == undefined) {
      this.cachedLightTexture = new Img(renderer.img.size);
    }
    if (this.cachedLightTexture.size.x != renderer.img.size.x) {
      this.cachedLightTexture.resize(renderer.img.size);
      this.cached = false;
    }

    let cam = scenes.game.cam;

    let mask = this.cachedLightTexture;
    let img = lightingTexture;

    img.ctx.setTransform(renderer.img.ctx.getTransform());

    if (!this.cached) {
      renderer.save();
      renderer.translate(cam.pos._subV(pos));
      createVisibilityMask(mask, pos, Math.max(this.size.x, this.size.y) / 2);
      renderer.restore();

      mask.ctx.save();
      mask.ctx.globalCompositeOperation = "destination-in";
      mask.ctx.fillStyle = "rgb(255, 255, 255)";
      mask.ctx.fillRect(pos.x - this.size.x / 2 + 0.1, pos.y - this.size.y / 2 + 0.1, this.size.x - 0.2, this.size.y - 0.2);
      mask.ctx.globalCompositeOperation = "multiply";
      mask.ctx.filter = `brightness(${this.strength * 100}%)`
      mask.ctx.drawImage(this.tex.canvas, pos.x - this.size.x / 2, pos.y - this.size.y / 2, this.size.x, this.size.y);
      mask.ctx.restore();

      this.cached = true;
    }
    

    img.ctx.save();
    img.ctx.globalCompositeOperation = "lighter";
    img.ctx.drawImage(mask.canvas, pos.x - cam.w / 2, pos.y - cam.w / 16 * 9 / 2, cam.w, cam.w / 16 * 9);
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

function createVisibilityMask(visibilityMaskTexture, pos, maxLength = 10000) {
  let img = visibilityMaskTexture;
  img.ctx.fillStyle = "rgb(0, 0, 0)";
  img.ctx.fillRect(0, 0, img.size.x, img.size.y);

  img.ctx.setTransform(renderer.img.ctx.getTransform());

  img.ctx.fillStyle = "rgb(255, 255, 255)";
  img.ctx.strokeStyle = "rgb(255, 255, 255)";
  img.ctx.lineWidth = 0.3;
  img.ctx.beginPath();
  for (let i = 0; i < settings.visibilitySamples; i++) {
    let hitInfo = scenes.game.world.raycast(pos, i / settings.visibilitySamples * Math.PI * 2, maxLength);

    img.ctx.lineTo(hitInfo.hitPos.x, hitInfo.hitPos.y);
  }
  img.ctx.fill();
  img.ctx.stroke();

  return img;
}