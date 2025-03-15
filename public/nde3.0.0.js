
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
   * Normalizes this vector
   * 
   * @return {Vec} this
   */
  normalize() {
    let mag = this.mag();
    if (mag != 0) this.div(mag);
    return this;
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
   * Rounds each axis of this vector
   * 
   * @return {Vec} this
   */
  round() {
    if (this.x) this.x = Math.round(this.x);
    if (this.y) this.y = Math.round(this.y);
    if (this.z) this.z = Math.round(this.z);
    if (this.w) this.w = Math.round(this.w);
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
  _round() {return this.copy().round()}

  _normalize() {return this.copy().normalize()}

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







/* src/camera.js */
class Camera {
  constructor(pos) {
    this.pos = pos;

    this.w = 16;

    this.dir = 0;

    this.renderW;
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
    v.mul(this.renderW / this.w);

    return v;
  }
  /**
   * Transforms screen pos to world pos
   * 
   * @param {Vec} v Screen pos
   * @return {Vec} World pos
   */
  from(v) {
    v = v._div(this.renderW / this.w);
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
    return v._mul(this.renderW / this.w);
  }
  /**
   * Scales all axes of a vector from camera scale
   * 
   * @param {Vec} v Scaled vector
   * @return {Vec} Unscaled vector
   */
  unScaleVec(v) {
    return v._div(this.renderW / this.w);
  }

  /**
   * Scales renderer transform
   */
  scaleTransform() {
    renderer.scale(new Vec(this.renderW / this.w, this.renderW / this.w));
  }
  /**
   * Unscales renderer transform
   */
  unScaleTransform() {
    renderer.scale(new Vec(1, 1)._div(this.renderW / this.w));
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
   * 
   */
  beforeSetup() {}
    
/**
 * 
 */
  afterSetup() {}

  
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
  resize(e) {}
 
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
   * 
   * 
   * @param {number} dt Time in seconds since last frame
   */
  afterUpdate(dt) {}
    
/**
 * Render scene here, called after update
 */
  render() {}

    
/**
 * 
 */
  afterRender() {}
}







/* src/assets/asset.js */
class Asset {
  constructor() {
    this.loading = false;
    this.path = "";
  }
}





/* src/assets/img.js */
class Img extends Asset {
  constructor(size) {
    super();

    this.size = size.copy();

    this.canvas = document.createElement("canvas");
    this.canvas.width = size.x;
    this.canvas.height = size.y;

    this.ctx = this.canvas.getContext("2d");
    if (this.ctx == null) throw new Error("2d context not supported?");
  }

  resize(size) {
    this.size = size.copy();

    this.canvas.width = size.x;
    this.canvas.height = size.y;
  }
}





/* src/assets/aud.js */
class Aud extends Asset {
  constructor() {
    super();

    this.duration = undefined;

    this.audio = new Audio();

    this.instances = [];
  }

  play() {
    if (this.audio.paused) this.audio.play();
    else {
      let audio = new Audio(this.path);
      this.instances.push(audio);
      audio.play();

      audio.onended = () => {
        let index = this.instances.indexOf(audio);
        if (index != -1)
          this.instances.splice(index, 1);
      }
    }
  }
  stop() {    
    this.audio.stop();

    for (let i = 0; i < this.instances.length; i++) {
      this.instances[i].stop();
      this.instances.splice(i, 1);
      i--;
    }
  }
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
      if (typeof args[0] == "string") return args[0];
      if (typeof args[0] == "number") return `rgba(${args[0]},${args[0]},${args[0]},1)`;
      if (args[0] instanceof Vec) return `rgba(${args[0].x},${args[0].y},${args[0].z},${args[0][3] == undefined ? 1 : args[0].w})`;
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





/* src/ui/UIElementBase.js */
class UIElementBase {
  constructor(pos, size, events) {
    this.pos = pos;
    this.size = size;
    this.events = events;

    this.hovered = false;
    this.forceHover = false;

    this.defaultStyle = {
      padding: 0,

      fill: "rgba(0, 0, 0, 1)",
      stroke: "rgba(0, 0, 0, 1)",
    };

    this.style = {hover: {}};
  }

  fillStyle(style) {
    nestedObjectAssign(this.style, this.defaultStyle, style);

    delete this.style.hover;
    this.style.hover = nestedObjectAssign({}, this.style, style.hover);
  }

  registerEvent(eventName, func) {
    if (!this.events[eventName]) this.events[eventName] = [];
    this.events[eventName].push(func);
  }
  fireEvent(eventName, ...args) {    
    let events = this.events[eventName];
    if (events) 
      for (let e of events) e(...args);
  }

  checkHovered() {
    this.hovered = false;
    
    let mousePoint = new DOMPoint(nde.mouse.x, nde.mouse.y);
    let transformedMousePoint = mousePoint.matrixTransform(renderer.getTransform().inverse());
    if (
      transformedMousePoint.x > this.pos.x && 
      transformedMousePoint.x < this.pos.x + this.size.x + this.style.padding * 2 &&
      transformedMousePoint.y > this.pos.y && 
      transformedMousePoint.y < this.pos.y + this.size.y + this.style.padding * 2
    ) {
      this.hovered = true;
      nde.hoveredUIElement = this;
    }

    if (this.forceHover) this.hovered = true;
  }

  render() {
    renderer.applyStyles(this.hovered ? this.style.hover : this.style);
    
    renderer.rect(this.pos, this.size._add(this.style.padding * 2));    
  }
}




function nestedObjectAssign(dest, target, source) {  
  Object.assign(dest, target, source);
  if (target == undefined || source == undefined) return dest;

  for (let key in dest) {
    let ob = dest[key];
    
    if (ob instanceof Vec) {
      dest[key] = new Vec().from(ob);
    }
    else if (Array.isArray(ob)) {
      
    }
    else if (ob instanceof Object) {
      dest[key] = nestedObjectAssign({}, target[key], source[key]);
    }
  }

  return dest;
}





/* src/ui/buttonBase.js */
class ButtonBase extends UIElementBase {
  constructor(pos, size, events) {
    super(pos, size, events);
  }

  render() {
    super.checkHovered();
    super.render();  
  }
}





/* src/ui/buttonText.js */
class ButtonText extends ButtonBase {
  constructor(pos, text, style, events) {
    super(pos, new Vec(0, 0), events);

    this.defaultStyle.text = {
      fill: "rgba(255, 255, 255, 1)",
      stroke: "rgba(0, 0, 0, 1)",
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





/* src/ui/buttonImage.js */
class ButtonImage extends ButtonBase {
  constructor(pos, size, img, style, events) {
    super(pos, size, events);

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





/* src/ui/settings/settingCollection.js */
class SettingCollection extends UIElementBase {
  constructor(pos, value, style, settingsTemplate, events) {
    super(pos, new Vec(0, 0), events);

    this.value = value;

    this.defaultStyle = {
      hover: {}, //Irrelevant

      size: new Vec(500, 50),
      gap: 10,
      settingXOffset: 600,

      text: {
        font: "50px monospace",
        textAlign: ["left", "top"],
        fill: "rgba(255, 255, 255, 1)",
      },

      setting: {
        padding: 0,
      },
    };
    this.fillStyle(style);
    this.settingsTemplate = settingsTemplate;

    

    this.elements = {};

    let y = 0;
    for (let i in settingsTemplate) {
      let setting = settingsTemplate[i];   

      let settingStyle = style;
      if (setting.style) {        
        settingStyle = nestedObjectAssign({}, style, setting.style);
      }
      
      let events = setting.events || {};

      if (!events.input) events.input = [];
      if (!events.change) events.change = [];
      events.input.push(value => {
        this.value[i] = value;
        this.fireEvent("input", this.value);
      });
      events.change.push(value => {
        this.value[i] = value;
        this.fireEvent("change", this.value);
      });
      
      this.elements[i] = new setting.type(new Vec(pos.x + settingStyle.settingXOffset, pos.y + y), settingStyle.size, settingStyle.setting, setting.args, events);

      if (value[i] != undefined) this.elements[i].setValue(value[i]);

      this.value[i] = this.elements[i].value;

      
      y += settingStyle.size.y + settingStyle.gap + settingStyle.setting.padding * 2;
      
    }
  }

  render() {
    for (let i in this.elements) {
      let elem = this.elements[i];      
      renderer.applyStyles(this.style.text);
      renderer.text(this.settingsTemplate[i].name || i, new Vec(this.pos.x, elem.pos.y));

      elem.render();
    }
  }
}







/* src/ui/settings/SettingBase.js */
class SettingBase extends UIElementBase {
  constructor(pos, size, events, value) {
    super(pos, size, events);

    this.value = value;
  }

  setValue(newValue) {
    let old = this.value;
    this.value = newValue;

    if (old != this.value) this.fireEvent("input", this.value);
  }

  change() {
    this.fireEvent("change", this.value);
  }
}





/* src/ui/settings/SettingCheckbox.js */
class SettingCheckbox extends SettingBase {
  constructor(pos, size, style, args, events) {
    super(pos, size, events, args.default);


    this.defaultStyle.checkbox = {
      fill: "rgba(255, 255, 255, 1)",
      stroke: "rgba(255, 255, 255, 1)",
    };
    
    this.fillStyle(style);
    
    this.setValue(args.default);

    this.funcA = e=>this.mouseup2(e);
    this.registerEvent("mouseup", e=>{this.mouseup1(e)});
    this.registerEvent("mousedown", e=>{
      this.forceHover = true;

      nde.registerEvent("mouseup", this.funcA);
    });
  }

  mouseup1(e) {
    if (!this.forceHover) return;

    this.setValue(!this.value);
    this.change();
  }

  mouseup2(e) {
    this.forceHover = false;

    nde.unregisterEvent("mouseup", this.funcA);
  }

  render() {
    super.checkHovered();
    super.render();  
    this.rendererTransform = renderer.getTransform();

    this.renderContent();
  }

  renderContent() {
    renderer.applyStyles(this.hovered ? this.style.hover.checkbox : this.style.checkbox);

    if (this.value) renderer.rect(this.pos._add(this.style.padding), this.size);   
  }
}





/* src/ui/settings/SettingRange.js */
class SettingRange extends SettingBase {
  constructor(pos, size, style, args, events) {
    super(pos, size, events, args.default);

    this.defaultStyle.range = {
      fill: "rgba(255, 255, 255, 1)",
      stroke: "rgba(255, 255, 255, 1)",

      text: {
        margin: 10,
        width: 50,
        
        font: "50px monospace",
        textAlign: ["right", "middle"],
        fill: "rgba(255, 255, 255, 1)",
      },

      hover: {}
    };
    
    this.fillStyle(style);
    
    this.rangeSizeTotal = new Vec(size.x - this.style.range.text.margin - this.style.range.text.width - this.style.padding, size.y);
    
    this.rangeSize = new Vec(size.y, size.y);

    this.min = args.min;
    this.max = args.max;
    this.step = args.step || 1;
    this.setValue(args.default);

    this.rendererTransform = undefined;

    this.funcA = e=>this.mousemove(e);
    this.funcB = e=>this.mouseup(e);

    this.registerEvent("mousedown", e=>{
      this.forceHover = true;

      this.mousemove(e);

      nde.registerEvent("mousemove", this.funcA);
      nde.registerEvent("mouseup", this.funcB);
    });
  }

  mousemove(e) {
    let mousePoint = new DOMPoint(nde.mouse.x, nde.mouse.y);
    let transformedMousePoint = mousePoint.matrixTransform(this.rendererTransform.inverse());
    
    let progress = Math.min(Math.max((transformedMousePoint.x - this.pos.x - this.style.padding) / this.rangeSizeTotal.x, 0), 1);
    this.setValue(progress * (this.max - this.min) + this.min);
  }

  mouseup(e) {
    this.forceHover = false;

    nde.unregisterEvent("mousemove", this.funcA);
    nde.unregisterEvent("mouseup", this.funcB);

    this.change();
  }

  setValue(newValue) {
    super.setValue(Math.round(newValue / this.step) * this.step);

    this.rangeSize.x = (this.value - this.min) / (this.max - this.min) * this.rangeSizeTotal.x;
  }

  render() {
    super.checkHovered();

    this.rendererTransform = renderer.getTransform();

    renderer.applyStyles(this.hovered ? this.style.hover : this.style);
    renderer.rect(this.pos, this.rangeSizeTotal._add(this.style.padding * 2));
    
    let numberPos = new Vec(this.pos.x + this.rangeSizeTotal.x + this.style.padding * 2 + this.style.range.text.margin, this.pos.y);
    renderer.rect(numberPos, new Vec(this.style.range.text.width, this.size.y).add(this.style.padding * 2));

    this.renderContent();

    renderer.applyStyles(this.hovered ? this.style.hover.range.text : this.style.range.text);
    renderer.text(this.value, numberPos._addV(new Vec(this.style.padding + this.style.range.text.width, this.size.y / 2 + this.style.padding)));
  }

  renderContent() {
    renderer.applyStyles(this.hovered ? this.style.hover.range : this.style.range);

    if (this.value > this.min) renderer.rect(this.pos._add(this.style.padding), this.rangeSize);   
  }
}





/* src/timers/timerBase.js */
class TimerBase {
  constructor(callback = (timer) => {}) {
    this.elapsedFrames = 0;
    this.elapsedTime = 0;
    this.progress = 0;

    this.callback = callback;

    nde.timers.push(this);
  }

  tick(dt) {
    this.elapsedFrames++; 
    this.elapsedTime += dt;
  }
  
  stop() {
    let index = nde.timers.indexOf(this);
    if (index != -1) nde.timers.splice(index, 1);
  }

  reset() {
    this.elapsedFrames = 0;
    this.elapsedTime = 0;
    this.progress = 0;

    let index = nde.timers.indexOf(this);
    if (index != -1) nde.timers.splice(index, 1);

    nde.timers.push(this);
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
    this.oldImg = new Img(new Vec(nde.w, nde.w / 16 * 9));
    this.newImg = new Img(this.oldImg.size);

    this.timer = timer;

    nde.fireEvent("render");
    renderer.display(this.oldImg);

    nde.setScene(newScene);
    newScene.update(1/60);
    nde.fireEvent("render");
    renderer.display(this.newImg);
  }

  render() {
    renderer.set("fill", 0);
    renderer.rect(new Vec(0, 0), nde.mainImg.size);

    if (this.timer.progress == 1) nde.transition = undefined;
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
hoveredUIElement: the currently hovered ui element, but you can't see which one it is sucker

timers: array of all currently active timers, to add a timer call new TimerWhatever, see engine/timers/timerWhatever.js for details

transition: the currently active transition, set this to a new TransitionWhatever which usually takes (newScene, timerWhatever) and it will transition, see engine/transitions/transitionBase.js for base class

debug: if debugStats are shown
debugStats: map thats cleared each frame where you can put debug info

renderer: which renderer to use, pass all drawing code into this pls, see engine/renderers/rendererBase.js for base class



Events:
beforeSetup
afterSetup
keydown
keyup
mousemove
mousedown
mouseup
wheel
resize
update
afterUpdate
render
afterRender



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

class NDE {
  constructor(mainElem) {
    this.scene = undefined;
    this.w = undefined;
    this.targetFPS = undefined;
    this.hoveredUIElement = undefined;
    this.transition = undefined;
    this.renderer = new RendererCanvas();

    this.events = {};

    this.mouse = new Vec(0, 0);

    this.controls = {};
    this.pressed = {};

    this.timers = [];

    this.debug = false;
    this.debugStats = {};

    
    this.mainElem = mainElem;
    this.mainImg = new Img(new Vec(1, 1));
    this.unloadedAssets = [];

    this.lastFrameTime = 0;
    this.latestDts = [];

    this.setScene(new Scene());

    let i = 0;
    let lastLength = Infinity;
    let interval = setInterval(e => {
      if (this.unloadedAssets.length == 0) {
        clearInterval(interval);
        
        this.fireEvent("beforeSetup");

        this.mainElem.appendChild(this.mainImg.canvas);
        this.resize();
      
        this.renderer.set("renderer.", "16px monospace");
        this.renderer.set("textAlign", ["left", "top"]);
        this.renderer.set("imageSmoothing", false);
        
        this.fireEvent("afterSetup");


        this.setupHandlers();

      
        this.lastFrameTime = performance.now();
        requestAnimationFrame(time => {this.draw(time)});
      }
      if (i >= 100) {
        if (this.unloadedAssets.length < lastLength) {
          i = 0;
          lastLength = this.unloadedAssets.length;
        } else {
          clearInterval(interval); 
          console.error("assets could not be loaded: " + this.unloadedAssets.map(e => e.path))
        }
      }
      
      i++;
    }, 50);
  }

  setupHandlers() {
    window.addEventListener("resize", e => {this.resize(e)});

    document.addEventListener("keydown", e => {
      if (this.debug) console.log(e.key);
    
      this.pressed[e.key.toLowerCase()] = true;
    
      this.fireEvent("keydown", e);
      
    });
    document.addEventListener("keyup", e => {
      delete this.pressed[e.key.toLowerCase()];
    
      this.fireEvent("keyup", e);
    });
    
    document.addEventListener("mousemove", e => {
      this.mouse.x = e.clientX / this.mainImg.size.x * this.w;
      this.mouse.y = e.clientY / this.mainImg.size.x * this.w;


      if (this.hoveredUIElement) {
        if (!this.transition) this.hoveredUIElement.fireEvent("mousemove", e);
      }
      
      this.fireEvent("mousemove", e);
    });
    document.addEventListener("mousedown", e => {
      if (this.hoveredUIElement) {
        if (!this.transition) this.hoveredUIElement.fireEvent("mousedown", e);
        return;
      }
    
      if (this.debug) console.log("mouse" + e.button);

      this.pressed["mouse" + e.button] = true;
      this.fireEvent("mousedown", e);
    });
    document.addEventListener("mouseup", e => {
      delete this.pressed["mouse" + e.button];

      if (this.hoveredUIElement) {
        if (!this.transition) this.hoveredUIElement.fireEvent("mouseup", e);
      }
      
      this.fireEvent("mouseup", e);
    });
    document.addEventListener("wheel", e => {
      this.fireEvent("wheel", e);
    });

    
    window.oncontextmenu = (e) => {
      e.preventDefault(); 
      e.stopPropagation(); 
      return false;
    };
  }

  setScene(newScene) {
    if (this.scene) this.scene.stop();
    this.scene = newScene;
    this.scene.start();
    this.scene.hasStarted = true;
  }

  registerEvent(eventName, func) {
    if (!this.events[eventName]) this.events[eventName] = [];
    this.events[eventName].push(func);

    if (this.debug) console.log(`NDE: Registered an event on ${eventName}`);
  }
  unregisterEvent(eventName, func) {
    let events = this.events[eventName];
    if (!events) return false;

    let index = events.indexOf(func);
    if (index == -1) return false;

    events.splice(index, 1);
    if (this.debug) console.log(`NDE: Unregistered an event on ${eventName}`);
    return;
  }

  fireEvent(eventName, ...args) {
    if (this.transition) return;
    
    let events = this.events[eventName];
    if (events) 
      for (let e of events) e(...args);
    
    this.scene[eventName](...args);
      
  }

  resize(e) {
    this.w = Math.min(window.innerWidth, window.innerHeight / 9 * 16);
    this.mainImg.resize(new Vec(this.w, this.w / 16 * 9));
  

    let result = undefined;
    if  (this.events["resize"]) {
      for (let ee of this.events["resize"]) {
        let res = ee(e); if (res) result = res
      };
    }
    this.scene.resize(e);

    this.w = result || this.w;
    
    this.renderer.img.resize(new Vec(this.w, this.w / 16 * 9));
    
    if (!this.transition) this.scene.resize(e);
  
    this.fireEvent("resize", e);
  }

  /**
   * Gets keycode of a control
   * 
   * @param {string} controlName
   * @return {string} keyCode
   */
  getKeyCode(controlName) {
    return this.controls[controlName].toLowerCase();
  }
  /**
   * Gets if a key is pressed
   * 
   * @param {string} controlName
   * @return {boolean} pressed
   */
  getKeyPressed(controlName) {
    return !!this.pressed[this.getKeyCode(controlName)];
  }
  /**
   * Gets if keycode is equal to control keycode
   * 
   * @param {string} keyCode
   * @param {string} controlName
   * @return {boolean} equal
   */
  getKeyEqual(keyCode, controlName) {
    return keyCode.toLowerCase() == this.getKeyCode(controlName);
  }

  draw(time) {
    requestAnimationFrame(time => {this.draw(time)});
  
    if (time == undefined) time = performance.now();
    
    let dt = Math.min(time - this.lastFrameTime, 200);
  
    if (this.targetFPS != undefined) {
      if ((time + 0.1) - this.lastFrameTime < 1000 / this.targetFPS) return; 
    }
  
    this.lastFrameTime = time;
  
    this.updateGame(dt);
  }

  updateGame(dt) {
    this.latestDts.push(dt);
    if (this.latestDts.length > 10) this.latestDts.shift();
    let averageDt = this.latestDts.reduce((partialSum, a) => partialSum + a, 0) / this.latestDts.length;
    

    this.hoveredUIElement = undefined;
    this.debugStats = {};
    this.debugStats["frameTime"] = Math.round(averageDt);
    this.debugStats["fps"] = Math.round(1000 / averageDt);
  
    if (this.targetFPS != undefined) {
      this.debugStats["target frameTime"] = 1000 / this.targetFPS;
      this.debugStats["target fps"] = this.targetFPS;
    }
  
    let gameDt = (this.targetFPS == undefined) ? dt * 0.001 : 1 / this.targetFPS;
  
  
    this.renderer.save();
  
    this.fireEvent("update", gameDt);
    for (let i = 0; i < this.timers.length; i++) this.timers[i].tick(gameDt);
    this.fireEvent("afterUpdate", gameDt);
  
    this.fireEvent("render");
    if (this.transition) this.transition.render();
    this.fireEvent("afterRender");
  
    this.renderer.set("fill", 255);
    this.renderer.set("stroke", 0);
    this.renderer.set("font", "16px monospace");
    this.renderer.set("textAlign", ["left", "top"]);
    if (this.debug) {
      let n = 0;
      for (let i in this.debugStats) {
        this.renderer.text(`${i}: ${JSON.stringify(this.debugStats[i])}`, new Vec(0, n * 16));
        n++;
      }
    }
    
    this.renderer.restore();
  
    this.renderer.display(this.mainImg);
  }

  loadAssetHelper(asset, actualAsset, path) {
    asset.loading = true;
    asset.path = path;

    actualAsset.src = path;

    this.unloadedAssets.push(asset);

    actualAsset.onerror = e => {
      console.error(`"${path}" not found`);

      this.unloadedAssets.splice(this.unloadedAssets.indexOf(img));
    };
  }

  loadImg(path) {
    let img = new Img(new Vec(1, 1));
    let image = new Image();

    this.loadAssetHelper(img, image, path);


    image.onload = e => {
      img.resize(new Vec(image.width, image.height));
      img.ctx.drawImage(image, 0, 0);
      img.loading = false;

      this.unloadedAssets.splice(this.unloadedAssets.indexOf(img));
    };

    return img;
  }

  loadAud(path) {
    let aud = new Aud();

    this.loadAssetHelper(aud, aud.audio, path);


    aud.audio.addEventListener("canplaythrough", () => {
      aud.loading = false;
      aud.duration = aud.audio.duration;

      this.unloadedAssets.splice(this.unloadedAssets.indexOf(aud));
    });

    return aud;
  }
}





