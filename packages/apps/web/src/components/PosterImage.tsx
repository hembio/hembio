import { Theme } from "@material-ui/core";
import Skeleton from "@material-ui/core/Skeleton";
import LocalMoviesIcon from "@material-ui/icons/LocalMovies";
import { createStyles, makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import { ImgHTMLAttributes, useEffect, useRef, useState } from "react";
import { HEMBIO_API_URL } from "../constants";
import { useOnScreen } from "../hooks/useOnScreen";

type PosterImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  id?: string;
  thumbnail?: string | null | undefined;
  size?: "adapt" | "tiny" | "small" | "medium" | "large";
};

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      root: {
        position: "relative",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "50% 50%",
        "& .glow": {
          position: "absolute",
          zIndex: 100,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          transition: "box-shadow .1s ease-in",
          boxShadow: "0 0 1px rgba(0,0,0,.4)",
          borderRadius: theme.spacing(0.5),
        },

        "&.adapt": {
          width: "100%",
          height: "100%",
        },
        "&.tiny": {
          width: "35px",
          height: "50px",
        },
        "&.small": {
          width: "140px",
          height: "210px",
        },
        "&.medium": {
          width: "200px",
          height: "300px",
        },
        "&.large": {
          width: "360px",
          height: "540px",
        },
      },
      thumbContainer: {
        position: "absolute",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.4)",
        borderRadius: theme.spacing(0.5),
        "& > .MuiSvgIcon-root": {
          width: "50%",
          height: "50%",
          opacity: "0.4",
          transform: "rotate(20deg)",
        },
        ".tiny &": {
          borderRadius: "1px",
        },
        ".large &": {
          backgroundColor: "#292838",
        },
      },
      thumb: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "50% 50%",
        transition: theme.transitions.create("opacity", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.standard,
        }),
        zIndex: 0,
        filter: "blur(16px)",
        ".tiny &": {
          borderRadius: "1px",
        },
      },
      imageContainer: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "50% 50%",
        transition: theme.transitions.create("opacity", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.standard,
        }),
        zIndex: 1,
        borderRadius: theme.spacing(0.5),
        overflow: "hidden",
      },
      hide: {
        opacity: 0,
      },
    }),
  {
    name: "PosterImage",
  },
);

export const PosterImage = ({
  id,
  thumbnail,
  size = "medium",
  ...props
}: PosterImageProps): JSX.Element => {
  const classes = useStyles();
  const [src, setSrc] = useState("");
  const [hide, setHide] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const poster = useRef(new Image()).current;
  const onScreen = useOnScreen(ref, "0px");

  useEffect(() => {
    if (!thumbnail) {
      return;
    }
    if (!onScreen) {
      setHide(true);
    } else if (onScreen && src) {
      setHide(false);
    } else if (!src) {
      const onLoad = (): void => {
        setSrc(poster.src);
      };
      if (onScreen && id) {
        poster.src = `${HEMBIO_API_URL}/images/titles/${id}/poster`;
        poster.addEventListener("load", onLoad);
      } else {
        poster.src = "";
        poster.removeEventListener("load", onLoad);
        setSrc("");
      }
      return () => {
        poster.removeEventListener("load", onLoad);
      };
    } else {
      setHide(true);
    }
    return;
  }, [onScreen, src, id, poster, thumbnail]);

  return (
    <div {...props} ref={ref} className={clsx(classes.root, { [size]: true })}>
      {thumbnail ? (
        <div className={classes.thumbContainer}>
          <div
            className={classes.thumb}
            style={{ backgroundImage: `url("${thumbnail}")` }}
          ></div>
        </div>
      ) : !id ? (
        <Skeleton
          variant="rectangular"
          className={classes.thumbContainer}
          sx={{ height: "100%" }}
        />
      ) : (
        <div className={classes.thumbContainer}>
          <LocalMoviesIcon />
        </div>
      )}
      {thumbnail && (
        <div
          className={clsx({
            [classes.imageContainer]: true,
            [classes.hide]: hide,
          })}
          style={{ backgroundImage: `url("${src}")` }}
        />
      )}
      <div className="glow"></div>
    </div>
  );
};
