import { createStyles, makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import { memo } from "react";
import type { TitleFragment } from "../generated/graphql";
import { TitleLogo } from "./TitleLogo";

const useStyles = makeStyles(
  createStyles({
    container: {
      display: "flex",
      height: "190px",
      flexDirection: "row",
      justifyContent: "space-between",
      zIndex: 100,
      // background:
      //   "linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 65%, rgba(0,0,0,0.85) 100%)",
      transition: "opacity .2s ease",
      transitionTimingFunction: "ease-in",
      pointerEvents: "all",
    },
    hide: {
      opacity: 0,
      transitionTimingFunction: "ease-out",
    },
    section: {
      padding: "20px",
    },
    logo: {
      textAlign: "right",
    },
  }),
  {
    name: "TopBar",
  },
);

interface Props {
  title?: TitleFragment;
  show?: boolean;
}

export const TopBar = memo(({ title, show }: Props) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.container, { [classes.hide]: !show })}>
      <div className={classes.section}></div>
      <div className={clsx(classes.section, classes.logo)}>
        {title && <TitleLogo id={title.id} name={title.name + " logo"} />}
      </div>
    </div>
  );
});
