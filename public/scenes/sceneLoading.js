class SceneLoading extends Scene {
  constructor() {
    super();

    this.cam = new Camera(new Vec(0, 0));
    this.cam.w = 1600;
  }

  start() {

  }

  update(dt) {

  }

  render() {
    let cam = this.cam;

    renderer.save();

    renderer.set("fill", [100, 100, 50]);
    renderer.rect(new Vec(0, 0), new Vec(w, w / 16 * 9));

    cam.applyTransform();

    renderer.set("font", "100px monospace");
    renderer.set("textAlign", ["center", "middle"]);
    renderer.set("fill", 255);
    renderer.text("Loading...", new Vec(0, 0));

    renderer.restore();
  }
}