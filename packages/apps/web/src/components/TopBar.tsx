import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
import Box from "@mui/material/Box";
import clsx from "clsx";
import { memo } from "react";
import type { TitleFragment } from "~/generated/graphql";
import { TitleLogo } from "./TitleLogo";

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      container: {
        height: "190px",
        zIndex: 1000,
        background:
          "linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 65%, rgba(0,0,0,0.85) 100%)",
        transition: theme.transitions.create("opacity", {
          easing: "ease",
          duration: "200ms",
        }),
        pointerEvents: "all",
      },
      hide: {
        opacity: 0,
        transitionTimingFunction: "ease-out",
      },
      section: {
        padding: "20px",
      },
    }),
  {
    name: "TopBar",
  },
);

interface Props {
  title?: Pick<TitleFragment, "id" | "name">;
  show?: boolean;
}

export const TopBar = memo(({ title, show }: Props) => {
  const classes = useStyles();
  return (
    <Box className={clsx(classes.container, { [classes.hide]: !show })}>
      <Box sx={{ display: "grid", mt: 2, ml: 6, mr: 6 }}>
        <Box sx={{ justifySelf: "end", height: "150px" }}>
          {title && <TitleLogo id={title.id} name={title.name + " logo"} />}
        </Box>
      </Box>
    </Box>
  );
});
