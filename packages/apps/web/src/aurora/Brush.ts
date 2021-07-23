import { Curve } from "./Curve";
import {
  BRUSH_ALPHA_DROPOFF,
  BRUSH_HEIGHT,
  BRUSH_MAX_ALPHA_VARIANCE,
  BRUSH_MAX_ANIM_TIME,
  BRUSH_MAX_SCALE_Y_VARIANCE,
  BRUSH_MAX_Z_ANIM_TIME,
  BRUSH_MIN_ANIM_TIME,
  BRUSH_MIN_SCALE_Y,
  BRUSH_MIN_Z_ANIM_TIME,
  BRUSH_WIDTH,
} from "./constants";

export class Brush {
  private startTime?: number;
  public alpha: number;
  public color: string | CanvasGradient;
  public scaleYMod = (1 - BRUSH_MIN_SCALE_Y) * Math.random();
  public scaleXMod = 0.5 * Math.random() * (2 - this.scaleYMod * 2);

  // Timings
  public alphaAnimTime =
    Math.random() * (BRUSH_MAX_ANIM_TIME - BRUSH_MIN_ANIM_TIME) +
    BRUSH_MIN_ANIM_TIME;
  public alphaVariance: number;
  public alphaMin: number;
  public alphaAnimOffset: number;

  // Scaling
  public scaleYAnimTime =
    Math.random() * (BRUSH_MAX_ANIM_TIME - BRUSH_MIN_ANIM_TIME) +
    BRUSH_MIN_ANIM_TIME;
  public scaleYVariance = Math.random() * BRUSH_MAX_SCALE_Y_VARIANCE;
  public scaleY = 0;
  public scaleYMin = this.scaleY - this.scaleYVariance / 2;
  public scaleYAnimOffset = Math.random() * Math.PI;

  // Animations
  public zAnimTime =
    Math.random() * (BRUSH_MAX_Z_ANIM_TIME - BRUSH_MIN_Z_ANIM_TIME) +
    BRUSH_MIN_Z_ANIM_TIME;
  public zAnimOffset: number;

  public constructor(
    public curve: Curve,
    public z: number,
    color: string | CanvasGradient | null,
    public noScale = false,
  ) {
    this.color = color || "rgb(50, 170, 82)";
    this.alpha = z * Math.random() * 0.55 + 0.15;
    this.alphaVariance = Math.max(
      Math.random() * BRUSH_MAX_ALPHA_VARIANCE,
      this.alpha,
    );

    if (this.noScale) {
      this.alphaMin = 0;
      this.alphaVariance = 1;
    } else {
      this.alphaMin = Math.max(this.alpha - this.alphaVariance / 2, 0);
    }
    this.alphaAnimOffset = Math.random() * Math.PI;

    this.zAnimOffset =
      this.curve.vanishingPoint.z - (z - this.curve.vanishingPoint.z);
  }

  public draw(ctx: CanvasRenderingContext2D): boolean {
    if (this.z < this.curve.vanishingPoint.z || this.z > this.curve.endPoint.z)
      return false;

    const point = this.curve.getPointAtZ(this.z);

    let alpha =
      (0.5 + 0.5 * Math.min(this.z, 1)) *
      this.alpha *
      (this.curve.maxBrushAlpha || 0);
    if (this.z - this.curve.vanishingPoint.z < BRUSH_ALPHA_DROPOFF) {
      alpha *= (this.z - this.curve.vanishingPoint.z) / BRUSH_ALPHA_DROPOFF;
    } else if (this.curve.endPoint.z - this.z < BRUSH_ALPHA_DROPOFF) {
      alpha *= (this.curve.endPoint.z - this.z) / BRUSH_ALPHA_DROPOFF;
    }

    let scaleX;
    let scaleY;
    if (!this.noScale) {
      scaleY = this.z * this.scaleYMod + BRUSH_MIN_SCALE_Y;
      scaleX = this.z * this.scaleXMod + 0.5;
    } else {
      scaleY = this.scaleYMod + BRUSH_MIN_SCALE_Y;
      scaleX = this.scaleXMod + 0.5;
    }

    ctx.fillStyle = this.color;
    ctx.globalAlpha = alpha;

    ctx.beginPath();
    ctx.moveTo(point.x, point.y - scaleY * BRUSH_HEIGHT);
    ctx.quadraticCurveTo(
      point.x + (scaleX * BRUSH_WIDTH) / 2,
      point.y - scaleY * BRUSH_HEIGHT,
      point.x + (scaleX * BRUSH_WIDTH) / 2,
      point.y,
    );
    ctx.quadraticCurveTo(
      point.x + (scaleX * BRUSH_WIDTH) / 2,
      point.y + scaleY * BRUSH_WIDTH,
      point.x,
      point.y + (scaleX * BRUSH_WIDTH) / 2,
    );
    ctx.quadraticCurveTo(
      point.x - (scaleX * BRUSH_WIDTH) / 2,
      point.y + scaleY * BRUSH_WIDTH,
      point.x - (scaleX * BRUSH_WIDTH) / 2,
      point.y,
    );
    ctx.quadraticCurveTo(
      point.x - (scaleX * BRUSH_WIDTH) / 2,
      point.y - scaleY * BRUSH_HEIGHT,
      point.x,
      point.y - scaleY * BRUSH_HEIGHT,
    );
    ctx.fill();

    // ctx.globalAlpha = alpha;
    // ctx.drawImage(this.image, point.x - scaleX * BRUSH_WIDTH / 2, point.y - scaleY * BRUSH_HEIGHT, scaleX * BRUSH_WIDTH, scaleY * BRUSH_HEIGHT);
    return true;
  }

  public updatePosition(): void {
    if (!this.startTime) {
      this.startTime = Date.now() - 20000;
    }
    const now = Date.now();
    const deltaTime = now - this.startTime;

    this.alpha = Math.min(
      this.alphaMin +
        (Math.sin(
          (deltaTime / this.alphaAnimTime) * Math.PI + this.alphaAnimOffset,
        ) *
          0.5 +
          0.5) *
          this.alphaVariance,
      1,
    );
    this.scaleY =
      this.scaleYMin +
      (Math.sin(
        (deltaTime / this.scaleYAnimTime) * Math.PI + this.scaleYAnimOffset,
      ) *
        0.5 +
        0.5) *
        this.scaleYVariance;
    //this.z = this.zMin + (Math.sin((deltaTime / this.zAnimTime) * Math.PI + this.zAnimOffset) * .5 + .5) * this.zVariance;
    this.z =
      (deltaTime / this.zAnimTime + this.zAnimOffset) * this.curve.endPoint.z;
    if (this.z > this.curve.vanishingPoint.z) this.z *= this.z;
    if (this.z > this.curve.endPoint.z) {
      this.z = this.z - this.curve.endPoint.z + this.curve.vanishingPoint.z;
      // reset start time so it doesn't infinitely speed up
      this.startTime = now;
    }
  }
}
