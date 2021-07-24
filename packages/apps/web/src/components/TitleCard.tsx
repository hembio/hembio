import { Theme } from "@material-ui/core";
import Link from "@material-ui/core/Link";
import Skeleton from "@material-ui/core/Skeleton";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import { createStyles, makeStyles } from "@material-ui/styles";
import { forwardRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import type { TitleFragment } from "../generated/graphql";
import { PosterImage } from "./PosterImage";

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      container: {
        transition: theme.transitions.create("transform", {
          duration: theme.transitions.duration.standard,
          easing: theme.transitions.easing.easeInOut,
        }),
        "&:hover": {
          transform: "scale3d(1.025, 1.025, 1.025)",
          "& .glow": {
            boxShadow: "0 0 8px rgba(0,0,0,.5)",
          },
          "& h1, & h2": {
            color: "#fff",
          },
        },
        "& .PosterImage-root": {
          width: "200px",
          height: "300px",
        },
        "&.resize": {
          [theme.breakpoints.up("xl")]: {
            width: "calc(9.7vw - 16px)",
            height: "calc(9.7vw * 1.5 + 44px - 16px)",
          },
          [theme.breakpoints.down("xl")]: {
            width: "calc(13.6vw - 16px)",
            height: "calc(13.6vw * 1.5 + 44px - 16px)",
          },
          [theme.breakpoints.down("lg")]: {
            width: "calc(19vw - 16px)",
            height: "calc(19vw * 1.5 + 44px - 16px)",
          },
          [theme.breakpoints.down("md")]: {
            width: "calc(23vw - 16px)",
            height: "calc(23vw * 1.5 + 44px - 16px)",
          },
          [theme.breakpoints.down("sm")]: {
            width: "calc(29vw - 16px)",
            height: "calc(29vw * 1.5 + 44px - 16px)",
          },
        },
        "& .MuiSkeleton-root": {
          borderRadius: theme.spacing(0.5),
          margin: "auto",
        },
      },
      bottomBar: {
        position: "relative",
        textAlign: "center",
        maxWidth: "184px",
        margin: "8px",
      },
      title: {
        fontSize: "1.1em",
        fontWeight: "lighter",
        margin: "0",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
      year: {
        fontSize: "0.9em",
        fontWeight: "normal",
        margin: "0",
        color: "rgba(255,255,255,.7) !important",
      },
    }),
  {
    name: "TitleCard",
  },
);

interface Props {
  title?: TitleFragment;
  skeleton?: boolean;
  setRef?: React.Dispatch<HTMLDivElement>;
}

export const TitleCard = forwardRef<HTMLDivElement, Props>(
  ({ title, skeleton }, ref) => {
    const classes = useStyles();
    const randomWidth = !title || skeleton ? Math.random() * 60 + 20 : 0;
    return (
      <Link component={RouterLink} to={title ? `/title/${title.id}` : ""}>
        <div className={classes.container} ref={ref}>
          <PosterImage
            id={title ? title.id : undefined}
            thumbnail={title ? title.thumb : undefined}
            size="small"
          />
          <div className={classes.bottomBar}>
            <Tooltip
              title={title ? title.name : ""}
              enterDelay={500}
              leaveDelay={0}
            >
              <Typography className={classes.title} variant="h5" color="body1">
                {!title ? (
                  <Skeleton
                    className={classes.title}
                    width={`${randomWidth}%`}
                  />
                ) : (
                  title.name
                )}
              </Typography>
            </Tooltip>
            <Typography className={classes.year} variant="h6" color="body1">
              {!title ? (
                <Skeleton className={classes.year} width="20%" />
              ) : (
                title.year
              )}
            </Typography>
          </div>
        </div>
      </Link>
    );
  },
);
