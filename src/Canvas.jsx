import { useEffect, useRef } from "react";
export const Canvas = () => {
  const canvasBg = useRef(null);
  useEffect(() => {
    const ctx = canvasBg.current.getContext("2d");
    const width = (canvasBg.current.width = window.innerWidth);
    const height = (canvasBg.current.height = window.innerHeight);
    class Particle {
      // eslint-disable-next-line no-useless-constructor
      constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.dirX = 1;
        this.dirY = 1;
        this.speedX = Math.random() * 3;
        this.speedY = Math.random() * 3;
      }
      draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
      }
      update() {
        this.draw();
        if (this.x + this.size >= width || this.x - this.size <= 0)
          this.dirX = -this.dirX;
        if (this.y + this.size >= height || this.y - this.size <= 0)
          this.dirY = -this.dirY;
        this.speedX = this.dirX * this.speedX;
        this.speedY = this.dirY * this.speedY;
        this.x += this.speedX;
        this.y += this.speedY;
      }
    }
    class Effect {
      // eslint-disable-next-line no-useless-constructor
      constructor() {
        this.numberOfParticles = 100;
        this.Particles = [];
        this.createParticles();
      }
      createParticles = () => {
        for (let i = 0; i < this.numberOfParticles; i++) {
          const size = Math.random() * 1 + 1;
          const x = Math.random() * (width - size) + size;
          const y = Math.random() * (height - size) + size;
          const color = "azure";
          this.Particles.push(new Particle(x, y, size, color));
        }
      };

      animate = () => {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "rgb(0,0,0,0.2)";
        this.Particles.forEach((elm) => elm.update());
        requestAnimationFrame(this.animate);
      };
    }
    console.log(Math.random() * 18);
    const effect = new Effect();
    effect.animate();
  }, [canvasBg]);
  return (
    <canvas
      className="canvas-bg"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
      }}
      ref={canvasBg}
    ></canvas>
  );
};