import { withStyles } from "@mui/styles";
import { Fab } from "@mui/material";

export const ControlButton = withStyles({
  root: {
    background: "rgba(51, 68, 80, 0)",
    boxShadow: "none",
  },
  label: {
    textTransform: "capitalize",
  },
})(Fab);
