import { styled } from "@mui/styles";
import { alpha, Slider as MuiSlider, Theme } from "@mui/material";

export const Slider = styled(MuiSlider)(({ theme }: { theme: Theme }) => ({
  color:
    theme.palette.mode === "dark"
      ? alpha(theme.palette.secondary.dark, 1)
      : alpha(theme.palette.secondary.light, 1),
  marginBottom: "-5px",
  "&:hover": {
    "& .MuiSlider-thumb": {
      opacity: 1,
      transform: "scale(1, 1)",
      boxShadow: "none",
      border: "none",
    },
    "& .MuiSlider-track": {
      height: 10,
      borderRadius: 10,
    },
    "& .MuiSlider-rail": {
      height: 10,
      borderRadius: 10,
    },
  },
  "& .MuiSlider-valueLabel": {
    color: "#000",
    left: "calc(-50% + 4px)",
  },
  "& .MuiSlider-thumb": {
    height: 22,
    width: 22,
    border: "none",
    marginTop: -11,
    marginLeft: -12,
    transform: "scale(0.0, 0.0)",
    transitionProperty: "transform, opacity, border-radius",
    transitionDuration: ".2s",
    transitionTimingFunction: "ease-in",
    opacity: 1,
    "&:before": {
      boxShadow: "none",
    },
    "&:after": {
      transition: "transform .2s ease-in",
    },
    "&:hover": {
      opacity: 1,
      transform: "scale(1, 1)",
      "&:after": {
        borderRadius: "50%",
      },
    },
  },
  "& .MuiSlider-track": {
    height: 8,
    border: 0,
    borderRadius: 8,
  },
  "& .MuiSlider-rail": {
    height: 8,
    border: 0,
    borderRadius: 8,
    opacity: 1,
    backgroundColor: "rgba(255,255,255,.1)",
    boxShadow: "0px -1px -1px rgba(255,255,255,1)",
  },
}));
