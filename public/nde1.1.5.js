
/*
This is a built version of nde (Nils Delicious Engine) and is basically all the source files stitched together, go to the github for source



*/
/* src/ndv.js */
/*

All of these are valid:
let v = new Vec();
let v = new Vec(0);
let v = new Vec(0, 0);
let v = new Vec(0, 0, 0);
let v = new Vec(0, 0, 0, 0);

generally operations on vectors follow this style:
  * add: adds a scalar to each dimension of the vector
  * addV: adds two vectors together one dimension at a time, X3 = X2 + X1, Y3 = Y2 + Y1, Z3 = Z2 + Z1
  * _add: performs add but instead of mutating the vector it creates a copy of it first so the original vector is unchanged
  * _addV: performs addV but instead of mutating the vector it creates a copy of it first so the original vector is unchanged

*/

class Vec {
  constructor(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  /**
   * Creates a copy of this vector
   * 
   * @return {Vec} new vector
   */
  copy() {
    return new Vec(this.x, this.y, this.z, this.w);
  }
  /**
   * Creates an array representation of this vector
   * 
   * @return {Array<number>} array
   */
  toArray() {
    let a = [];
    if (this.x != undefined) a.push(this.x);
    if (this.y != undefined) a.push(this.y);
    if (this.z != undefined) a.push(this.z);
    if (this.w != undefined) a.push(this.w);
    
    return a;
  }
  /**
   * Creates a string representation of this vector
   * 
   * @return {string} formatted string
   */
  toString() {
    let a = "(";
    if (this.x != undefined) a += this.x;
    if (this.y != undefined) a += ", " + this.y;
    if (this.z != undefined) a += ", " + this.z;
    if (this.w != undefined) a += ", " + this.w;
    
    return a + ")";
  }
  /**
   * Sets each axis of this vector to each axis of v
   * 
   * @param {Vec} v
   * @return {Vec} this
   */
  from(v) {
    this.x = v.x != undefined ? parseFloat(v.x) : v.x;
    this.y = v.y != undefined ? parseFloat(v.y) : v.y;
    this.z = v.z != undefined ? parseFloat(v.z) : v.z;
    this.w = v.w != undefined ? parseFloat(v.w) : v.w;
    return this;
  }
  /**
   * Sets each axis of this vector
   * 
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} w
   * @return {Vec} this
   */
  set(x = undefined, y = undefined, z = undefined, w = undefined) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }

  /**
   * Return the square length of this vector
   * 
   * @return {number} Square length
   */
  sqMag() {
    let m = 0;
    if (this.x) m += this.x ** 2;
    if (this.y) m += this.y ** 2;
    if (this.z) m += this.z ** 2;
    if (this.w) m += this.w ** 2;
    return m;
  }
  /**
   * Return the length of this vector
   * 
   * @return {number} Length
   */
  mag() {
    return Math.sqrt(this.sqMag());
  }

  
  /**
   * Floors each axis of this vector
   * 
   * @return {Vec} this
   */
  floor() {
    if (this.x) this.x = Math.floor(this.x);
    if (this.y) this.y = Math.floor(this.y);
    if (this.z) this.z = Math.floor(this.z);
    if (this.w) this.w = Math.floor(this.w);
    return this;
  }

  /**
   * Adds each axis of this vector by val
   * 
   * @param {number} val Term
   * @return {Vec} this
   */
  add(val) {
    return this.addV(new Vec(val, val, val, val));
  }
  /**
   * Adds each axis of this vector by each axis of v
   * 
   * @param {Vec} v Terms
   * @return {Vec} this
   */
  addV(v) {
    if (this.x != undefined && v.x != undefined) this.x += v.x;
    if (this.y != undefined && v.y != undefined) this.y += v.y;
    if (this.z != undefined && v.z != undefined) this.z += v.z;
    if (this.w != undefined && v.w != undefined) this.w += v.w;

    return this;
  }

  /**
   * Subtracts each axis of this vector by val
   * 
   * @param {number} val Subtrahend
   * @return {Vec} this
   */
  sub(val) {
    return this.subV(new Vec(val, val, val, val));
  }
  /**
   * Subtracts each axis of this vector by each axis of v
   * 
   * @param {Vec} v Subtrahends
   * @return {Vec} this
   */
  subV(v) {
    if (this.x != undefined && v.x != undefined) this.x -= v.x;
    if (this.y != undefined && v.y != undefined) this.y -= v.y;
    if (this.z != undefined && v.z != undefined) this.z -= v.z;
    if (this.w != undefined && v.w != undefined) this.w -= v.w;

    return this;
  }

  /**
   * Multiplies each axis of this vector by val
   * 
   * @param {number} val Factor
   * @return {Vec} this
   */
  mul(val) {
    return this.mulV(new Vec(val, val, val, val));
  }
  /**
   * Multiplies each axis of this vector by each axis of v
   * 
   * @param {Vec} v Factors
   * @return {Vec} this
   */
  mulV(v) {
    if (this.x != undefined && v.x != undefined) this.x *= v.x;
    if (this.y != undefined && v.y != undefined) this.y *= v.y;
    if (this.z != undefined && v.z != undefined) this.z *= v.z;
    if (this.w != undefined && v.w != undefined) this.w *= v.w;

    return this;
  }

  /**
   * Divides each axis of this vector val
   * 
   * @param {number} val Divisor
   * @return {Vec} this
   */
  div(val) {
    val = 1 / val;
    return this.mulV(new Vec(val, val, val, val));
  }
  /**
   * Divides each axis of this vector by each axis of v
   * 
   * @param {Vec} v Divisors
   * @return {Vec} this
   */
  divV(v) {
    if (this.x != undefined && v.x != undefined) this.x /= v.x;
    if (this.y != undefined && v.y != undefined) this.y /= v.y;
    if (this.z != undefined && v.z != undefined) this.z /= v.z;
    if (this.w != undefined && v.w != undefined) this.w /= v.w;

    return this;
  }

  /**
   * Rotates this vector on the Y axis
   * 
   * @param {number} angle Angle in radians to rotate
   * @return {Vec} this
   */
  rotateYAxis(angle) {
    let x = this.x;
    let z = this.z;

    this.x = x * Math.cos(angle) - z * Math.sin(angle);
    this.z = x * Math.sin(angle) + z * Math.cos(angle);

    return this;
  }

  /**
   * Rotates this vector on the Z axis
   * 
   * @param {number} angle Angle in radians to rotate
   * @return {Vec} this
   */
  rotateZAxis(angle) {
    let x = this.x;
    let y = this.y;

    this.x = x * Math.cos(angle) - y * Math.sin(angle);
    this.y = x * Math.sin(angle) + y * Math.cos(angle);

    return this;
  }

  /**
   * Sets this vector to interpolation of this vector and v2
   * 
   * @param {Vec} v2
   * @param {number} i
   * @return {Vec} this
   */
  mix(v2, i) {
    if (this.x != undefined) this.x = this.x + (v2.x - this.x) * i;
    if (this.y != undefined) this.y = this.y + (v2.y - this.y) * i;
    if (this.z != undefined) this.z = this.z + (v2.z - this.z) * i;
    if (this.w != undefined) this.w = this.w + (v2.w - this.w) * i;
    return this;
  }


  _floor() {return this.copy().floor()}

  _add(val) {return this.copy().add(val)}
  _addV(v) {return this.copy().addV(v)}
  
  _sub(val) {return this.copy().sub(val)}
  _subV(v) {return this.copy().subV(v)}
  
  _mul(val) {return this.copy().mul(val)}
  _mulV(v) {return this.copy().mulV(v)}
  
  _div(val) {return this.copy().div(val)}
  _divV(v) {return this.copy().divV(v)}

  _rotateYAxis(angle) {return this.copy().rotateYAxis(angle)}
  _rotateZAxis(angle) {return this.copy().rotateZAxis(angle)}

  _mix(v2, i) {return this.copy().mix(v2, i)}
}







/* src/img.js */
class Img {
  constructor(size) {
    this.size = size.copy();

    this.canvas = document.createElement("canvas");
    this.canvas.width = size.x;
    this.canvas.height = size.y;

    this.ctx = this.canvas.getContext("2d");
    if (this.ctx == null) throw new Error("2d context not supported?");

    this.loading = false;
    this.path = "";
  }

  resize(size) {
    this.size = size.copy();

    this.canvas.width = size.x;
    this.canvas.height = size.y;
  }
}

function loadImg(path) {
  let img = new Img(new Vec(1, 1));
  img.loading = true;
  img.path = path;
  unloadedAssets.push(img);

  let image = new Image();
  image.src = path;

  image.onload = e => {
    img.resize(new Vec(image.width, image.height));
    img.ctx.drawImage(image, 0, 0);
    img.loading = false;

    unloadedAssets.splice(unloadedAssets.indexOf(img));
  };
  image.onerror = e => {
    console.error(`"${path}" not found`);

    unloadedAssets.splice(unloadedAssets.indexOf(img));
  };

  return img;
}





/* src/camera.js */
class Camera {
  constructor(pos) {
    this.pos = pos;

    this.w = 16;

    this.dir = 0;
  }

  /**
   * Transforms world pos to screen pos
   * 
   * @param {Vec} v World pos
   * @return {Vec} Screen pos
   */
  to(v) {
    v = v._subV(this.pos);
    v.addV(new Vec(this.w / 2 / this.scale, this.w / 2 / 16 * 9));
    v.mul(w / this.w);

    return v;
  }
  /**
   * Transforms screen pos to world pos
   * 
   * @param {Vec} v Screen pos
   * @return {Vec} World pos
   */
  from(v) {
    v = v._div(w / this.w);
    v.subV(new Vec(this.w / 2, this.w / 2 / 16 * 9));
    v.addV(this.pos);

    return v;
  }

  /**
   * Scales all axes of a vector to camera scale
   * 
   * @param {Vec} v Unscaled vector
   * @return {Vec} Scaled vector
   */
  scaleVec(v) {
    return v._mul(w / this.w);
  }
  /**
   * Scales all axes of a vector from camera scale
   * 
   * @param {Vec} v Scaled vector
   * @return {Vec} Unscaled vector
   */
  unScaleVec(v) {
    return v._div(w / this.w);
  }

  /**
   * Scales renderer transform
   */
  scaleTransform() {
    renderer.scale(new Vec(w / this.w, w / this.w));
  }
  /**
   * Unscales renderer transform
   */
  unScaleTransform() {
    renderer.scale(new Vec(1, 1)._div(w / this.w));
  }

  /**
   * Applies camera transform to renderer
   */
  applyTransform() {
    this.scaleTransform();
    renderer.translate(new Vec(this.w / 2, this.w / 2 / 16 * 9));

    renderer.rotate(-this.dir);
    renderer.translate(this.pos._mul(-1));
  }
}





/* src/scenes/scene.js */
class Scene {
  constructor() {
    this.hasStarted = false;    
  }

  
/**
 * Scene started
 */
  start() {}
  
/**
 * Scene stopped
 */
  stop() {}
 
/**
 * @param {UIEvent} e
 */
  windowResized(e) {}
 
/**
 * @param {KeyboardEvent} e
 */
  keydown(e) {}
  
/**
 * @param {KeyboardEvent} e
 */
  keyup(e) {}
 
/**
 * @param {MouseEvent} e
 */
  mousemove(e) {}
  
/**
 * @param {MouseEvent} e
 */
  mousedown(e) {}
  
/**
 * @param {MouseEvent} e
 */
  mouseup(e) {}
  
/**
 * Mouse scrolled
 * 
 * @param {WheelEvent} e
 */
  wheel(e) {}
 
/**
 * Update scene here, called every frame
 * 
 * @param {number} dt Time in seconds since last frame
 */
  update(dt) {}
  
/**
 * Render scene here, called after update
 */
  render() {}
}







/* src/renderers/rendererBase.js */
class RendererBase {
  constructor() {
    this.img = new Img(new Vec(1, 1));
    
    this.set("fill", 255);
    this.set("stroke", 0);
    this.set("lineWidth", 1);
    this.set("textAlign", ["left", "top"]);
    this.set("font", "16px monospace");
    this.set("imageSmoothing", true);
    this.set("filter", "none");
  }

  parseColor(c) {}

  set(property, val) {}

  translate(pos) {}
  rotate(radians) {}
  scale(scale) {}
  resetTransform() {}

  measureText(text) {}

  applyStyles(styles) {
    for (let s in styles) {      
      this.set(s, styles[s]);
    }
  }

  getTransform() {}
  setTransform(transform) {}

  save() {}
  restore() {}

  rect(pos, size) {}
  ellipse(pos, size) {}
  text(t, pos) {}
  image(img, pos, size) {}

  display(targetImg) {
    targetImg.ctx.imageSmoothingEnabled = false;
    targetImg.ctx.drawImage(this.img.canvas, 0, 0, targetImg.size.x, targetImg.size.y);
  }
}





/* src/renderers/rendererCanvas.js */
class RendererCanvas extends RendererBase {
  constructor() {
    super();
  }

  parseColor(...args) {
    if (args.length == 1) {
      if (typeof args[0] == "number") return `rgba(${args[0]},${args[0]},${args[0]},1)`;
      if (typeof args[0] == "object") return `rgba(${args[0][0]},${args[0][1]},${args[0][2]},${args[0][3] == undefined ? 1 : args[0][3]})`;
    }
    return `rgba(${args[0]},${args[1]},${args[2]},${args[3] == undefined ? 1 : args[3]})`;
  }

  
  translate(pos) {
    this.img.ctx.translate(pos.x, pos.y);
  }
  rotate(radians) {
    this.img.ctx.rotate(radians);
  }
  scale(scale) {
    if (scale.x == undefined) scale = new Vec(scale, scale);
    this.img.ctx.scale(scale.x, scale.y);
  }
  resetTransform() {
    this.img.ctx.resetTransform();
  }

  set(property, value) {
    switch (property) {
      case "fill":
        this.img.ctx.fillStyle = this.parseColor(value);
        break;
      case "stroke":
        this.img.ctx.strokeStyle = this.parseColor(value);
        break;
      case "lineWidth":
        this.img.ctx.lineWidth = value;
        break;
      case "textAlign":
        this.img.ctx.textAlign = value[0];
        this.img.ctx.textBaseline = value[1];
        break;
      case "font":
        this.img.ctx.font = value;
        break;
      case "imageSmoothing":
        this.img.ctx.imageSmoothingEnabled = value;
        break;
      case "filter":
        this.img.ctx.filter = value;
        break;
    }
  }

  measureText(text) {
    return this.img.ctx.measureText(text);
  }

  getTransform() {
    return this.img.ctx.getTransform();
  }
  setTransform(transform) {
    this.img.ctx.setTransform(transform);
  }

  save() {
    this.img.ctx.save();
  }
  restore() {
    this.img.ctx.restore();
  }

  rect(pos, size) {    
    this.img.ctx.beginPath();    
    this.img.ctx.rect(pos.x, pos.y, size.x, size.y);
    this.img.ctx.fill();
    this.img.ctx.stroke();
  }
  ellipse(pos, size) {    
    this.img.ctx.beginPath();    
    this.img.ctx.ellipse(pos.x, pos.y, size.x, size.y, 0, 0, Math.PI * 2);
    this.img.ctx.fill();
    this.img.ctx.stroke();
  }

  text(t, pos) {
    this.img.ctx.fillText(t, pos.x, pos.y);    
  }

  image(img, pos, size) {
    this.img.ctx.drawImage(img.canvas, pos.x, pos.y, size.x, size.y);
  }

  display(targetImg) {
    super.display(targetImg);
  }
}





/* src/buttons/buttonBase.js */
class ButtonBase {
  constructor(pos, size, callback) {
    this.pos = pos;
    this.size = size;
    this.callback = callback;

    this.hovered = false;

    this.defaultStyle = {
      padding: 0,

      fill: 0,
      stroke: 0,
    };

    this.style = {hover: {}};
  }

  fillStyle(style) {
    function f(style, parent, defaultStyle) {
      for (let i in defaultStyle) {
        let s = style[i];
        parent[i] = s;

        if (typeof s == "object" && !Array.isArray(s) && i != "hover") {
          f(s, parent[i], defaultStyle[i]);
        } else {
          if (parent[i] == undefined) parent[i] = defaultStyle[i];
        }
      }
    }

    f(style, this.style, this.defaultStyle);

    f(style.hover, this.style.hover, this.style);
  }

  render() {
    this.hovered = false;

    let mousePoint = new DOMPoint(mouse.x, mouse.y);
    let transformedMousePoint = mousePoint.matrixTransform(renderer.getTransform().inverse());
    if (
      transformedMousePoint.x > this.pos.x && 
      transformedMousePoint.x < this.pos.x + this.size.x + this.style.padding * 2 &&
      transformedMousePoint.y > this.pos.y && 
      transformedMousePoint.y < this.pos.y + this.size.y + this.style.padding * 2
    ) {
      this.hovered = true;
      hoveredButton = this;
    }

    renderer.applyStyles(this.hovered ? this.style.hover : this.style);
    
    renderer.rect(this.pos, this.size._add(this.style.padding * 2));    
  }
}





/* src/buttons/buttonText.js */
class ButtonText extends ButtonBase {
  constructor(pos, text, style, callback) {
    super(pos, new Vec(0, 0), callback);

    this.defaultStyle.text = {
      fill: 255,
      stroke: 0,
      font: "16px monospace",
      textAlign: ["left", "top"],
    };

    this.fillStyle(style);

    this.text = text;
  }


  render() {
    renderer.applyStyles(this.hovered ? this.style.hover.text : this.style.text);
    let size = renderer.measureText(this.text);
    
    this.size = new Vec(size.width, size.fontBoundingBoxAscent + size.fontBoundingBoxDescent );
    
    
    super.render();
    
    renderer.applyStyles(this.hovered ? this.style.hover.text : this.style.text);
    renderer.text(this.text, this.pos._add(this.style.padding));
  }
}





/* src/buttons/buttonImage.js */
class ButtonImage extends ButtonBase {
  constructor(pos, size, img, style, callback) {
    super(pos, size, callback);

    this.defaultStyle.image = {
      imageSmoothing: true,
    };
    
    this.fillStyle(style);

    this.img = img;
  }

  render() {
    super.render();

    renderer.applyStyles(this.hovered ? this.style.hover.image : this.style.image);
    
    renderer.image(this.img, this.pos._add(this.style.padding), this.size);
  }
}





/* src/timers/timerBase.js */
class TimerBase {
  constructor(callback = (timer) => {}) {
    this.elapsedFrames = 0;
    this.elapsedTime = 0;
    this.progress = 0;

    this.callback = callback;

    timers.push(this);
  }

  tick(dt) {
    this.elapsedFrames++; 
    this.elapsedTime += dt;
  }
  
  stop() {
    let index = timers.indexOf(this);
    if (index != -1) timers.splice(index, 1);
  }

  reset() {
    this.elapsedFrames = 0;
    this.elapsedTime = 0;
    this.progress = 0;

    let index = timers.indexOf(this);
    if (index != -1) timers.splice(index, 1);

    timers.push(this);
  }
}





/* src/timers/timerFrames.js */
class TimerFrames extends TimerBase {
  constructor(frames, callback) {
    super(callback);

    this.lengthFrames = frames;
  }

  tick(dt) {
    super.tick(dt);

    this.progress = Math.min(this.elapsedFrames / this.lengthFrames, 1);

    this.callback(this);

    if (this.progress >= 1) {
      this.stop();
    }
  }
}





/* src/timers/timerTime.js */
class TimerTime extends TimerBase {
  constructor(seconds, callback) {
    super(callback);

    this.lengthTime = seconds;
  }

  tick(dt) {
    super.tick(dt);

    this.progress = Math.min(this.elapsedTime / this.lengthTime, 1);

    this.callback(this);

    if (this.progress >= 1) {
      this.stop();
    }
  }
}





/* src/transitions/transitionBase.js */
class TransitionBase {
  constructor(newScene, timer) {
    this.oldImg = new Img(new Vec(w, w / 16 * 9));
    this.newImg = new Img(this.oldImg.size);

    this.timer = timer;

    renderGame();
    renderer.display(this.oldImg);

    setScene(newScene);
    newScene.update(1/60);
    renderGame();
    renderer.display(this.newImg);
  }

  render() {
    renderer.set("fill", 0);
    renderer.rect(new Vec(0, 0), mainImg.size);

    if (this.timer.progress == 1) transition = undefined;
  }
}





/* src/transitions/transitionFade.js */
class TransitionFade extends TransitionBase {
  constructor(newScene, timer) {
    super(newScene, timer);
  }

  render() {
    super.render();
    
    renderer.save();

    renderer.set("filter", `opacity(${(1-this.timer.progress) * 100}%)`);
    renderer.image(this.oldImg, new Vec(0, 0), this.oldImg.size);
    renderer.set("filter", `opacity(${this.timer.progress * 100}%)`);
    renderer.image(this.newImg, new Vec(0, 0), this.newImg.size);
    
    renderer.restore();
  }
}





/* src/transitions/transitionSlide.js */
class TransitionSlide extends TransitionBase {
  constructor(newScene, timer) {
    super(newScene, timer);
  }

  render() {
    super.render();

    let a = this.oldImg.size.x * this.timer.progress;
    let b = this.oldImg.size.x * (1 - this.timer.progress);

    let ctx = renderer.img.ctx;

    renderer.save();
    ctx.beginPath();
    ctx.rect(0, 0, a, this.oldImg.size.y);
    ctx.clip();
    renderer.image(this.newImg, new Vec(0, 0), this.oldImg.size);
    renderer.restore();
    
    renderer.save();
    ctx.beginPath();
    ctx.rect(a, 0, b, this.oldImg.size.y);
    ctx.clip();
    renderer.image(this.oldImg, new Vec(0, 0), this.oldImg.size);
    renderer.restore();
  }
}





/* src/transitions/transitionNoise.js */
class TransitionNoise extends TransitionBase {
  constructor(newScene, timer) {
    super(newScene, timer);
  }

  render() {
    super.render();

    let a = this.oldImg.ctx.getImageData(0, 0, this.oldImg.size.x, this.oldImg.size.y);
    let b = this.newImg.ctx.getImageData(0, 0, this.newImg.size.x, this.newImg.size.y);

    let lastRandom = 0;
    const random = () => {
      lastRandom = (1103515245  * lastRandom + 12345) % (2 ** 31);
      return lastRandom / 10000000 % 1;
    };

    let i = 0;
    while (i < a.data.length) {
      if (random() < this.timer.progress) {
        a.data[i  ] = b.data[i  ];
        a.data[i+1] = b.data[i+1];
        a.data[i+2] = b.data[i+2];
        a.data[i+3] = b.data[i+3];
      }
      i += 4;
    }

    renderer.img.ctx.putImageData(a, 0, 0);

  }
}





/* src/index.js */
/*
This engine uses NDV (Nils Delicious Vectors), see engine/ndv.js


scene: the current active scene, is set by setScene, see engine/scenes/scene.js for base class

w: how many pixels are across the screen, is updated automatically on resize

targetFPS: if this is not undefined, the game will try to run at that fps and the deltaTime will be fixed so it will be deterministic

controls: map of control names along with key codes, set by you and used in getKeyPressed
pressed: array of all the currently pressed key codes, accessed with getKeyPressed

mouse: a vector of the mouse position
hoveredButton: the currently hovered button, but you can't see which one it is sucker

timers: array of all currently active timers, to add a timer call new TimerWhatever, see engine/timers/timerWhatever.js for details

transition: the currently active transition, set this to a new TransitionWhatever which usually takes (newScene, timerWhatever) and it will transition, see engine/transitions/transitionBase.js for base class

debug: if debugStats are shown
debugStats: map thats cleared each frame where you can put debug info

renderer: which renderer to use, pass all drawing code into this pls, see engine/renderers/rendererBase.js for base class

preload: called before anything else to load assets

beforeSetup: called before canvas has been initialized and framerate set
afterSetup: after
beforeUpdate: called before the scene gets updated every frame
afterUpdate: after
beforeRender: called before the scene gets rendered every frame
afterRender: after
beforeResize: called before screen gets resized, you can return a value for the width here to render at a lower resolution
afterResize: after


use these to handle key input:
getKeyCode: Get keycode from control name
getKeyPressed: Get if key corresponding to control name is pressed
getKeyEqual: Get if keycode is same as controlName



important classes:
SceneBase: base class of all scenes, new SceneGame()
RendererBase: base class of all renderers, new RendererCanvas()
TimerBase: base class of all timers, new TimerTime(seconds, callback)
TransitionBase: base class of all transitions, new TransitionSlide(newScene, timer)

Vec: vector, see ndv.js

Img: image, see img.js

Camera: an object that can transform points and apply transformations to renderer, new Camera(pos), see camera.js



Recommended project structure:

Project:
  nde.js
  scenes:
    sceneGame.js
    sceneMainMenu.js
    ...
  buttons:
    buttomCustom.js
    ...
  timers:
    timerCustom.js
    ...
  transitions:
    transitionCustom.js
    ...
  renderers:
    rendererCustom.js
    ...
  index.js
  index.html
  style.css
  ...

*/  



let scene;

let w;

let targetFPS;

let controls = {};
let pressed = {};

let mouse;
let hoveredButton;

let timers = [];

let transition;

let debug = true;
let debugStats = {};

let renderer;



let mainElem = document.getElementsByTagName("main")[0];
let mainImg = new Img(new Vec(1, 1));
let unloadedAssets = [];

let lastFrameTime = 0;
let latestDts = [];

document.body.onload = e => {
  setScene(new Scene());
  mouse = new Vec(0, 0);

  preload();

  let i = 0;
  let interval = setInterval(e => {
    if (unloadedAssets.length == 0) {clearInterval(interval); setup();}
    if (i >= 200) {clearInterval(interval); console.error("assets could not be loaded: " + unloadedAssets.map(e => e.path))}
    
    i++;
  }, 16);
};

function setup() {
  beforeSetup();

  renderer = new RendererCanvas();
  mainElem.appendChild(mainImg.canvas);
  windowResized();

  renderer.set("renderer.", "16px monospace");
  renderer.set("textAlign", ["left", "top"]);
  renderer.set("imageSmoothing", false);
  
  afterSetup();

  lastFrameTime = performance.now();
  requestAnimationFrame(draw);
}

function setScene(newScene) {
  if (scene) scene.stop();
  scene = newScene;
  scene.start();
  scene.hasStarted = true;
}

function windowResized(e) {
  w = Math.min(window.innerWidth, window.innerHeight / 9 * 16);
  mainImg.resize(new Vec(w, w / 16 * 9));

  w = beforeResize(e) || w;
  
  renderer.img.resize(new Vec(w, w / 16 * 9));
  
  if (!transition) scene.windowResized(e);

  afterResize(e);
}
window.addEventListener("resize", windowResized);

document.addEventListener("keydown", e => {
  if (debug) console.log(e.key);

  pressed[e.key.toLowerCase()] = true;

  if (!transition) scene.keydown(e);
  
});
document.addEventListener("keyup", e => {
  delete pressed[e.key.toLowerCase()];

  if (!transition) scene.keyup(e);
});

document.addEventListener("mousemove", e => {
  mouse.x = e.clientX / mainImg.size.x * w;
  mouse.y = e.clientY / mainImg.size.x * w;
  
  if (!transition) scene.mousemove(e);
});
document.addEventListener("mousedown", e => {
  if (hoveredButton) {
    if (!transition) hoveredButton.callback();
    return;
  }

  if (debug) console.log("mouse" + e.button);

  pressed["mouse" + e.button] = true;

  if (!transition) scene.mousedown(e);
});
document.addEventListener("mouseup", e => {
  delete pressed["mouse" + e.button];

  if (!transition) scene.mouseup(e);
});
document.addEventListener("wheel", e => {
  if (!transition) scene.wheel(e);
});

/**
 * Gets keycode of a control
 * 
 * @param {string} controlName
 * @return {string} keyCode
 */
function getKeyCode(controlName) {
  return controls[controlName].toLowerCase();
}
/**
 * Gets if a key is pressed
 * 
 * @param {string} controlName
 * @return {boolean} pressed
 */
function getKeyPressed(controlName) {
  return !!pressed[getKeyCode(controlName)];
}
/**
 * Gets if keycode is equal to control keycode
 * 
 * @param {string} keyCode
 * @param {string} controlName
 * @return {boolean} equal
 */
function getKeyEqual(keyCode, controlName) {
  return keyCode.toLowerCase() == getKeyCode(controlName);
}

function draw(time) {
  requestAnimationFrame(draw);

  if (time == undefined) time = performance.now();
  
  let dt = Math.min(time - lastFrameTime, 200);

  if (targetFPS != undefined) {
    if ((time + 0.1) - lastFrameTime < 1000 / targetFPS) return; 
  }

  lastFrameTime = time;

  updateGame(dt);
}

function updateGame(dt) {
  latestDts.push(dt);
  if (latestDts.length > 10) latestDts.shift();
  let averageDt = latestDts.reduce((partialSum, a) => partialSum + a, 0) / latestDts.length;
  
  hoveredButton = undefined;
  debugStats = {};
  debugStats["frameTime"] = Math.round(averageDt);
  debugStats["fps"] = Math.round(1000 / averageDt);

  if (targetFPS != undefined) {
    debugStats["target frameTime"] = 1000 / targetFPS;
    debugStats["target fps"] = targetFPS;
  }

  let gameDt = (targetFPS == undefined) ? dt * 0.001 : 1 / targetFPS;


  renderer.save();

  beforeUpdate();
  if (!transition) scene.update(gameDt);  

  for (let i = 0; i < timers.length; i++) timers[i].tick(gameDt);
  afterUpdate();

  beforeRender();
  if (!transition) renderGame();
  else transition.render();
  afterRender();

  renderer.set("fill", 255);
  renderer.set("stroke", 0);
  renderer.set("font", "16px monospace");
  renderer.set("textAlign", ["left", "top"]);
  if (debug) {
    let n = 0;
    for (let i in debugStats) {
      renderer.text(`${i}: ${JSON.stringify(debugStats[i])}`, new Vec(0, n * 16));
      n++;
    }
  }
  
  renderer.restore();

  renderer.display(mainImg);
}

function renderGame() {
  scene.render();
}

window.oncontextmenu = (e) => {
  e.preventDefault(); 
  e.stopPropagation(); 
  return false;
};





