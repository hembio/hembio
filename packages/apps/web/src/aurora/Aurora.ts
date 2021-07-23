import { Curve } from "./Curve";
import { DEBUG } from "./constants";

export class Aurora {
  public ctx: CanvasRenderingContext2D;
  public curves: Curve[];
  public fpsDisplay?: HTMLSpanElement;
  public running = false;
  public mousePos: [number, number] = [0.5, 0.5];

  public constructor(
    public parentElement: HTMLElement,
    public width = window.innerWidth,
    public height = window.innerHeight,
    public canvas = document.createElement("canvas"),
    curves?: Curve[],
  ) {
    this.canvas.width = width;
    this.canvas.height = height;

    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.ctx.globalCompositeOperation = "color-dodge";

    // make a new random curve if one wasn't passed
    this.curves = curves || [
      new Curve(
        this.width * 0.1,
        this.height * 0.9,
        this.width * 0.9,
        this.height * 0.4,
      ),
    ];

    // auto start
    this.start();
    // this.parentElement.appendChild(this.canvas);
  }

  public start(): void {
    this.running = true;
    let lastTime = Date.now();
    const anim = () => {
      // clear current
      this.ctx.clearRect(0, 0, this.width, this.height);
      for (let i = 0, len = this.curves.length; i < len; i++) {
        // update positions
        this.curves[i].update(this.mousePos);
        // put that bitch on the canvas
        this.curves[i].draw(this.ctx);
        // debug line?
        if (DEBUG) {
          // this.ctx.globalCompositeOperation = "source-over";
          // this.ctx.globalAlpha = 1;
          // this.curves[i].drawDebug(this.ctx);
          // this.ctx.globalCompositeOperation = "color-dodge";
          // const now = Date.now();
          // if (this.fpsDisplay) {
          //   const delta = (now - lastTime) / 1000;
          //   const fps = 1 / delta;
          //   this.fpsDisplay.innerText = fps.toString();
          // }
          const now = Date.now();
          const delta = (now - lastTime) / 1000;
          const fps = 1 / delta;
          // console.log(fps);
          lastTime = now;
        }
      }
      if (this.running) {
        requestAnimationFrame(anim);
      }
    };
    requestAnimationFrame(anim);
  }

  public pause(): void {
    this.running = false;
  }

  public destroy(): void {
    this.running = false;
  }

  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  public getCurves(): Curve[] {
    return this.curves;
  }

  public setMousePos(x: number, y: number): void {
    this.mousePos = [x, y];
  }
}
