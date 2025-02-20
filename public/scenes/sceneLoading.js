class SceneLoading extends Scene {
  constructor() {
    super();

    this.cam = new Camera(new Vec(0, 0));
    this.cam.w = 1600;
    this.cam.renderW = nde.w;
  }

  start() {

  }

  update(dt) {

  }

  render() {
    let cam = this.cam;
    cam.renderW = nde.w;

    renderer.save();

    renderer.set("fill", [100, 100, 50]);
    renderer.rect(vecZero, new Vec(nde.w, nde.w / 16 * 9));

    cam.applyTransform();

    renderer.set("font", "100px monospace");
    renderer.set("textAlign", ["center", "middle"]);
    renderer.set("fill", 255);
    renderer.text("Loading...", vecZero);

    renderer.restore();
  }
}