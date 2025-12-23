class Cell {
  // eslint-disable-next-line no-useless-constructor
  constructor(effect, x, y, sx, sy, sWidth, sHeight) {
    this.effect = effect;
    this.x = this.effect.width / 2;
    this.y = this.effect.height;
    this.height = this.effect.cellHeight;
    this.width = this.effect.cellWidth;
    this.baseX = x;
    this.baseY = y;
    this.sx = sx;
    this.sy = sy;
    this.sWidth = sWidth;
    this.isArrived = false;
    this.sHeight = sHeight;
    this.random = Math.random() * 15 + 4;
  }
  draw() {
    this.effect.ctx.drawImage(
      this.effect.img,
      this.sx,
      this.sy,
      this.sWidth,
      this.sHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
  update() {
    const speedX = (this.baseX - this.x) / this.random;
    const speedY = (this.baseY - this.y) / this.random;
    this.x += speedX;
    this.y += speedY;
    if (!this.isArrived)
      this.isArrived =
        Math.abs(this.baseX - this.x) < 0.01 &&
        Math.abs(this.baseY - this.y) < 0.01;
    this.draw();
  }
}
class transformImgToCells {
  // eslint-disable-next-line no-useless-constructor
  constructor(img, canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;
    this.img = img;
    this.cellWidth = this.width / 15;
    this.cellHeight = this.height / 31;
    this.Cells = [];
    this.creatCells();
    console.log(this.Cells);
  }
  creatCells() {
    for (let y = 0; y < this.height; y += this.cellHeight) {
      for (let x = 0; x < this.width; x += this.cellWidth) {
        const sx = (x / this.width) * this.img.width;
        const sy = (y / this.height) * this.img.height;
        const sWidth = (this.cellWidth / this.width) * this.img.width;
        const sHeight = (this.cellHeight / this.height) * this.img.height;
        this.Cells.push(new Cell(this, x, y, sx, sy, sWidth, sHeight));
      }
    }
  }
  animate = () => {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.Cells.forEach((elm) => elm.update());
    if (!this.Cells.every((elm) => elm.isArrived))
      requestAnimationFrame(this.animate);
  };
}
export { transformImgToCells };
