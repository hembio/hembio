import { Fab } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";

export const ControlButton = withStyles({
  root: {
    background: "rgba(51, 68, 80, 0)",
    boxShadow: "none",
  },
  label: {
    textTransform: "capitalize",
  },
})(Fab);
