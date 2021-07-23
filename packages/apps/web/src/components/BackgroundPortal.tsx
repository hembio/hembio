import { createStyles, makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import { useRef } from "react";
import { createPortal } from "react-dom";
import { useImage } from "../hooks/useImage";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0,
      transition: "opacity 500ms ease-in",
    },
    bg: {
      width: "100%",
      height: "100%",
      backgroundPosition: "center",
      backgroundSize: "cover",
    },
    fadeIn: {
      opacity: 1,
    },
  }),
);

interface Props {
  src?: string;
  opacity?: number;
}

export const BackgroundPortal = ({
  src = "/bg.jpg",
  opacity = 1,
}: Props): JSX.Element | null => {
  const bgRef = useRef(document.getElementById("background"));
  const { loading } = useImage(src);
  const classes = useStyles();

  if (!bgRef.current) {
    return null;
  }

  return createPortal(
    <div
      className={clsx({
        [classes.root]: true,
        [classes.fadeIn]: !loading,
      })}
    >
      <div
        className={classes.bg}
        style={{ backgroundImage: `url(${src})`, opacity }}
      ></div>
    </div>,
    bgRef.current,
  );
};
