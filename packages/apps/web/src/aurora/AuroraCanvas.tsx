import { createStyles, makeStyles } from "@mui/styles";
import { useEffect, useRef } from "react";
import { Aurora } from "./Aurora";
import { Curve } from "./Curve";
import { BRUSH_COUNT } from "./constants";

const useStyles = makeStyles(
  createStyles({
    root: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: "hidden",
      pointerEvents: "none",
    },
    canvas: {
      display: "block",
      width: "100vw",
      height: "100vh",
      filter: "blur(12px) drop-shadow(0 0 30px rgba(51,189,172,1))",
      transformOrigin: "0 100%",
      transform: "skewX(0deg)",
      pointerEvents: "none",
    },
  }),
  { name: "Aurora" },
);

export function AuroraCanvas(): JSX.Element {
  const classes = useStyles();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const gradCanvas = canvasRef.current;
    const gradCtx = gradCanvas?.getContext("2d");
    if (gradCanvas && gradCtx) {
      const grad = gradCtx.createLinearGradient(
        window.innerWidth * 0.5,
        window.innerHeight,
        window.innerWidth * 0.35,
        0,
      );

      grad.addColorStop(0.4, "rgb(50, 130, 80)");
      grad.addColorStop(0.6, "rgba(100, 100, 120, .5)");
      const grad2 = gradCtx.createLinearGradient(
        window.innerWidth * 0.5,
        window.innerHeight * 0.5,
        window.innerWidth * 0.3,
        0,
      );

      grad2.addColorStop(0.35, "rgb(50, 130, 140)");
      grad2.addColorStop(0.7, "rgba(50, 70, 100,.7)");

      const curves = [
        new Curve(
          window.innerWidth * 0.17,
          window.innerHeight * 0.94,
          0.01,
          window.innerWidth * 0.8,
          window.innerHeight * 0.8,
          0.8,
          BRUSH_COUNT * 0.3,
          0.4,
          "rgb(60, 150, 120)",
        ),
        new Curve(
          window.innerWidth * 0.1,
          window.innerHeight * 0.9,
          0.05,
          window.innerWidth * 0.8,
          window.innerHeight * 0.4,
          1,
          null,
          0.8,
          grad,
        ),
        new Curve(
          window.innerWidth * 0.25,
          window.innerHeight * 0.65,
          0.33,
          window.innerWidth * 0.55,
          0,
          1.1,
          BRUSH_COUNT * 0.6,
          1,
          grad2,
        ),
      ];

      const ar = new Aurora(
        document.body,
        window.innerWidth,
        window.innerHeight,
        gradCanvas,
        curves,
      );

      const trackMouse = (e: MouseEvent) => {
        ar.setMousePos(
          e.clientX / window.innerWidth,
          e.clientY / window.innerHeight,
        );
      };

      document.body.addEventListener("mousemove", trackMouse);
      return () => {
        document.body.removeEventListener("mousemove", trackMouse);
        ar.destroy();
      };
    }
    return;
  }, [canvasRef]);

  return (
    <div className={classes.root}>
      <canvas className={classes.canvas} ref={canvasRef} />
    </div>
  );
}
