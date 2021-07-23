import {
  CURVE_POINT_MAX_FLOAT_TIME,
  CURVE_POINT_MAX_FLOAT_X_DIST,
  CURVE_POINT_MAX_FLOAT_Y_DIST,
  CURVE_POINT_MIN_FLOAT_DIST,
  CURVE_POINT_MIN_FLOAT_TIME,
  MOUSE_X_OFFSET,
  MOUSE_Y_OFFSET,
} from "./constants";
import { XY } from "./interfaces";

export class CurvePoint {
  public cpYOffset: number;
  public startTime?: number;

  // floating
  public xAnimTime =
    Math.random() * (CURVE_POINT_MAX_FLOAT_TIME - CURVE_POINT_MIN_FLOAT_TIME) +
    CURVE_POINT_MIN_FLOAT_TIME;
  public xVariance = Math.max(
    Math.random() * this.z * CURVE_POINT_MAX_FLOAT_X_DIST,
    CURVE_POINT_MIN_FLOAT_DIST,
  );
  public xMin = this.x - this.xVariance / 2;
  public xAnimOffset = Math.random() * Math.PI;
  public yAnimTime =
    Math.random() * (CURVE_POINT_MAX_FLOAT_TIME - CURVE_POINT_MIN_FLOAT_TIME) +
    CURVE_POINT_MIN_FLOAT_TIME;
  public yVariance = Math.max(
    Math.random() * this.z * CURVE_POINT_MAX_FLOAT_Y_DIST,
    CURVE_POINT_MIN_FLOAT_DIST,
  );
  public yMin = this.y - this.yVariance / 2;
  public yAnimOffset = Math.random() * Math.PI;

  public constructor(
    public x: number,
    public y: number,
    public z: number,
    public cpLength: number,
  ) {
    this.cpYOffset = Math.random() * cpLength - cpLength;
  }

  public getCps(): XY[] {
    return [
      {
        x: this.x - this.cpLength,
        y: this.y - this.cpYOffset,
      },
      {
        x: this.x + this.cpLength,
        y: this.y + this.cpYOffset,
      },
    ];
  }

  public updatePosition(mousePos: [number, number] = [0.5, 0.5]): void {
    if (!this.startTime) {
      this.startTime = Date.now();
    }
    const now = Date.now();
    const deltaTime = now - this.startTime;

    this.x =
      this.xMin +
      (Math.sin((deltaTime / this.xAnimTime) * Math.PI + this.xAnimOffset) *
        0.5 +
        0.5) *
        this.xVariance;

    const mouseXPercentage = mousePos[0];
    const mouseYPercentage = mousePos[1];

    this.x += this.z * (1 - mouseXPercentage * 2) * MOUSE_X_OFFSET;
    this.y =
      this.yMin +
      (Math.sin((deltaTime / this.yAnimTime) * Math.PI + this.yAnimOffset) *
        0.5 +
        0.5) *
        this.yVariance;
    this.y += this.z * (1 - mouseYPercentage * 2) * MOUSE_Y_OFFSET;
  }
}
