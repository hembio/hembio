import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import Zoom from "@material-ui/core/Zoom";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import { makeStyles, createStyles } from "@material-ui/styles";
import clsx from "clsx";
import { useState } from "react";
import { Link } from "react-router-dom";
import { TitleWithFilesFragment } from "~/generated/graphql";

const useStyles = makeStyles(
  createStyles({
    root: {
      transform: "rotate3d(0, -1, 0, 5deg)",
      position: "absolute",
      right: "5px",
      bottom: "-50px",
      marginRight: "60px",
    },
    button: {
      boxShadow: "2px 0px 24px rgba(0,0,0,.4), 0px 0px 1px rgba(0,0,0,.4)",
      height: "80px",
      width: "80px",
      backgroundColor: "rgba(51, 62, 78, 1)",
      "&:hover": {
        backgroundColor: "rgba(41, 52, 68, 1)",
      },
      "& .MuiSvgIcon-root": {
        width: "48px",
        height: "48px",
      },
      "&.big": {
        marginTop: "-20px",
        height: "120px",
        width: "120px",
        "& .MuiSvgIcon-root": {
          width: "100px",
          height: "100px",
        },
      },
    },
  }),
  { name: "ActionBox" },
);

interface ActionBoxProps {
  title?: TitleWithFilesFragment;
}

export function ActionBox({ title }: ActionBoxProps): JSX.Element {
  const [loved, setLoved] = useState(false);
  const classes = useStyles();
  return (
    <Grid
      container
      className={classes.root}
      spacing={2}
      justifyContent="flex-end"
    >
      <Grid item>
        <Zoom in={!!title} style={{ transitionDelay: title ? "100ms" : "0ms" }}>
          <Fab
            className={clsx([classes.button])}
            color="primary"
            aria-label="more"
          >
            <MoreHorizIcon />
          </Fab>
        </Zoom>
      </Grid>
      <Grid item>
        <Zoom in={!!title} style={{ transitionDelay: title ? "50ms" : "0ms" }}>
          <Fab
            onClick={() => setLoved(!loved)}
            className={clsx([classes.button])}
            color="primary"
            aria-label="favorite"
            sx={{ color: loved ? red[500] : undefined }}
          >
            {loved ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </Fab>
        </Zoom>
      </Grid>
      <Grid item>
        <Zoom in={!!title}>
          <Fab
            className={clsx([classes.button, "big"])}
            color="primary"
            aria-label="play"
            component={Link}
            to={title ? `/play/${title.files[0]?.id}` : ""}
          >
            <PlayArrowIcon />
          </Fab>
        </Zoom>
      </Grid>
    </Grid>
  );
}
