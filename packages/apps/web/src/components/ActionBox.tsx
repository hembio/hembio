import Fab from "@mui/material/Fab";
import Grid from "@mui/material/Grid";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Zoom from "@mui/material/Zoom";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { makeStyles, createStyles } from "@mui/styles";
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
      bottom: "-60px",
      marginRight: "20px",
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const classes = useStyles();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

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
            id="more-button"
            className={clsx([classes.button])}
            color="primary"
            aria-controls="more-menu"
            aria-label="more"
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <MoreHorizIcon />
          </Fab>
        </Zoom>
        <Menu
          id="more-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "more-button",
          }}
          anchorOrigin={{
            vertical: "center",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "center",
            horizontal: "center",
          }}
        >
          <MenuItem onClick={handleClose}>Identify title</MenuItem>
          <MenuItem onClick={handleClose}>Update images</MenuItem>
          <MenuItem onClick={handleClose}>Update metadata</MenuItem>
          <MenuItem onClick={handleClose}>Update credits</MenuItem>
          <MenuItem onClick={handleClose}>Remove title</MenuItem>
        </Menu>
      </Grid>
      <Grid item>
        <Zoom in={!!title} style={{ transitionDelay: title ? "50ms" : "0ms" }}>
          <Fab
            id="favorite-button"
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
            id="play-button"
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
