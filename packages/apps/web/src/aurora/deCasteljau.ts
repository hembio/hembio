import { XY } from "./interfaces";

/**
 * get point in bezier curve
 * @param point0 X
 * @param point0 Y
 * @param control point 0 X
 * @param control point 0 Y
 * @param control point 1 X
 * @param control point 1 Y
 * @param point 1 X
 * @param point 1 Y
 * @param percentage on path to get point of
 *
 * see http://stackoverflow.com/questions/14174252/how-to-find-out-y-coordinate-of-specific-point-in-bezier-curve-in-canvas
 */
export function deCasteljau(
  p0x: number,
  p0y: number,
  cp0x: number,
  cp0y: number,
  cp1x: number,
  cp1y: number,
  p1x: number,
  p1y: number,
  t: number,
): XY {
  // In the first step of the algorithm we draw a line connecting p0 and cp0,
  // another line connecting cp0 and cp1, and another still connecting cp1 and p1.
  // Then for all 3 of these lines we're going to find the point on them that is
  // t % from the start of them.
  const Ax = p0x + t * (cp0x - p0x),
    Ay = p0y + t * (cp0y - p0y),
    Bx = cp0x + t * (cp1x - cp0x),
    By = cp0y + t * (cp1y - cp0y),
    Cx = cp1x + t * (p1x - cp1x),
    Cy = cp1y + t * (p1y - cp1y);
  // The second step is very much like the first. In the first we connected the
  // four points with lines and then found 3 new points on them. In this step
  // we'll connect those 3 points with lines find 2 new points on them. I'll
  // call these two new points D and E.
  const Dx = Ax + t * (Bx - Ax),
    Dy = Ay + t * (By - Ay),
    Ex = Bx + t * (Cx - Bx),
    Ey = By + t * (Cy - By);
  // Finally, we can connect these last two points with another line, and find
  // the last point on it which will give us the point on the bezier curve for
  // that t. I'll call this point P.
  const Px = Dx + t * (Ex - Dx),
    Py = Dy + t * (Ey - Dy);

  return {
    x: Px,
    y: Py,
  };
}
