import { Brush } from "./Brush";
import { CurvePoint } from "./CurvePoint";
import {
  BRUSH_COUNT,
  CURVE_POINTS,
  CURVE_POINT_X_JITTER,
  CURVE_POINT_Y_JITTER,
} from "./constants";
import { deCasteljau } from "./deCasteljau";
import { XY, XYZ } from "./interfaces";

export class Curve {
  public vanishingPoint: XYZ;
  public endPoint: XYZ;
  public points: CurvePoint[];
  public brushes: Brush[];

  public constructor(
    public vpX: number,
    public vpY: number,
    public vpZ: number,
    public epX?: number | null,
    public epY?: number | null,
    public epZ?: number | null,
    public brushCount?: number | null,
    public maxBrushAlpha?: number | null,
    public fill?: string | CanvasGradient | null,
  ) {
    this.vanishingPoint = {
      x: vpX,
      y: vpY,
      z: vpZ,
    };
    this.endPoint = {
      x: epX || 0,
      y: epY || 0,
      z: epZ || 0,
    };

    this.brushCount = brushCount || BRUSH_COUNT;
    this.maxBrushAlpha = maxBrushAlpha || 1;

    const vp = this.vanishingPoint;
    this.points = [new CurvePoint(vp.x, vp.y, vp.z, 0)];

    // add in-between points
    for (let i = 0; i < CURVE_POINTS - 1; i++) {
      // modifier to fake distance
      let mod = (i + 1) / CURVE_POINTS;
      mod *= mod;

      // randomly generate some points
      const xJitter =
        Math.random() * CURVE_POINT_X_JITTER - CURVE_POINT_X_JITTER / 2;
      let x =
        this.vanishingPoint.x + mod * (this.endPoint.x - this.vanishingPoint.x);
      x += xJitter * (x - this.points[i].x);
      const yJitter =
        (1.2 - mod) *
        (Math.random() * CURVE_POINT_Y_JITTER - CURVE_POINT_Y_JITTER / 2);
      let y =
        this.vanishingPoint.y + mod * (this.endPoint.y - this.vanishingPoint.y);
      y += yJitter * (y - this.points[i].y);
      const z =
        mod * (this.endPoint.z - this.vanishingPoint.z) + this.vanishingPoint.z;

      this.points.push(
        new CurvePoint(
          x,
          y,
          z,
          (Math.random() * 0.33 + 0.33) * (x - this.points[i].x),
        ),
      );
    }
    // add last point
    const ep = this.endPoint;
    this.points.push(new CurvePoint(ep.x, ep.y, ep.z, 0));

    // create brushes
    this.brushes = [];
    for (let i = 0; i < this.brushCount; i++) {
      const noScale = Math.random() < 0.01;
      this.brushes.push(
        new Brush(
          this,
          (i / this.brushCount) * (this.endPoint.z - this.vanishingPoint.z) +
            this.vanishingPoint.z,
          noScale ? "rgb(200, 200, 220)" : fill || null,
          noScale,
        ),
      );
    }
  }

  public drawDebug(ctx: CanvasRenderingContext2D): void {
    // mostly just for debug
    ctx.lineWidth = 2;
    // cp lines
    ctx.setLineDash([2, 2]);
    ctx.strokeStyle = "#f99";
    for (let i = 1, len = this.points.length; i < len; i++) {
      ctx.beginPath();
      const cps = this.points[i].getCps();
      ctx.moveTo(cps[0].x, cps[0].y);
      //ctx.lineTo(this.points[i].x, this.points[i].y);
      ctx.lineTo(cps[1].x, cps[1].y);
      ctx.stroke();
    }

    // build the bezier paths
    const bezierPoints = [];
    for (let i = 0, len = this.points.length; i < len; i++) {
      const cps = this.points[i].getCps();
      if (i !== 0) {
        bezierPoints.push(cps[0]);
      }
      bezierPoints.push(this.points[i]);
      if (i !== len - 1) {
        bezierPoints.push(cps[1]);
      }
    }
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.strokeStyle = "#c00";
    ctx.moveTo(bezierPoints[0].x, bezierPoints[0].y);
    for (let i = 1, len = bezierPoints.length; i < len; i += 3) {
      ctx.bezierCurveTo(
        bezierPoints[i].x,
        bezierPoints[i].y,
        bezierPoints[i + 1].x,
        bezierPoints[i + 1].y,
        bezierPoints[i + 2].x,
        bezierPoints[i + 2].y,
      );
    }
    ctx.stroke();
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    for (let i = 0, len = this.brushes.length; i < len; i++) {
      this.brushes[i].draw(ctx);
    }
  }

  public getPointAtZ(p: number): XY {
    if (p <= this.points[0].z) {
      return this.points[0];
    } else if (p >= this.points[this.points.length - 1].z) {
      return this.points[this.points.length - 1];
    } else {
      let i = 0;
      for (let len = this.points.length; i < len; i++) {
        if (p <= this.points[i].z) {
          break;
        }
      }
      const lastPoint = this.points[i - 1];
      const lastPointCps = lastPoint.getCps();
      const nextPoint = this.points[i];
      const nextPointCps = nextPoint.getCps();
      const t = (p - lastPoint.z) / (nextPoint.z - lastPoint.z);

      const lpc = lastPointCps[1];
      const npc = nextPointCps[0];
      const points = deCasteljau(
        lastPoint.x,
        lastPoint.y,
        lpc.x,
        lpc.y,
        npc.x,
        npc.y,
        nextPoint.x,
        nextPoint.y,
        t,
      );
      return points;
    }
  }

  public update(mousePos: [number, number]): void {
    // update point positions for floating effect
    for (let i = 0, len = this.points.length; i < len; i++) {
      this.points[i].updatePosition(mousePos);
    }
    // update brush properties for floating effect
    for (let i = 0, len = this.brushes.length; i < len; i++) {
      this.brushes[i].updatePosition();
    }
  }

  public setMaxBrushAlpha(alpha: number): void {
    this.maxBrushAlpha = alpha;
  }
}
