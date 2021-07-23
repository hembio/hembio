import Grid from "@material-ui/core/Grid";
import VolumeDown from "@material-ui/icons/VolumeDown";
import VolumeOffIcon from "@material-ui/icons/VolumeOff";
import VolumeUp from "@material-ui/icons/VolumeUp";
import { makeStyles, styled } from "@material-ui/styles";
import { Observer } from "mobx-react-lite";
import { memo } from "react";
import { useStores } from "../../stores";
import { ControlButton } from "./ControlButton";
import { Slider } from "./Slider";

export const SmallSlider = styled(Slider)({
  root: {
    height: "100%",
    "&:hover": {
      "& .MuiSlider-thumb": {
        opacity: 1,
        borderRadius: "24px",
        transform: "scale(3, 3)",
        boxShadow: "inherit",
        "&:after": {
          borderRadius: "50%",
        },
      },
    },
  },
  thumb: {
    height: 5,
    width: 5,
    border: "2px solid currentColor",
    marginTop: 0,
    marginLeft: -5,
    transitionProperty: "transform, opacity, border-radius",
    transitionDuration: ".2s",
    transitionTimingFunction: "ease-in",
    transform: "scale(3, 3)",
    opacity: 1,
    "&:after": {
      borderRadius: "0%",
      transition: "transform .2s ease-in",
    },
    "&:hover, &$active": {
      opacity: 1,
      borderRadius: "24px",
      transform: "scale(3, 3)",
      boxShadow: "inherit",
      "&:after": {
        borderRadius: "50%",
      },
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
  },
  track: {
    height: 5,
    borderRadius: 4,
  },
  rail: {
    height: 5,
    borderRadius: 4,
  },
});

const useStyles = makeStyles({
  root: {
    overflow: "hidden",
    width: 56,
    height: 56,
    transitionDuration: ".2s",
    transitionTimingFunction: "ease",
    transitionProperty: "width",
    "&:hover": {
      width: 150,
    },
  },
  inner: {
    width: 150,
    height: 56,
  },
});

export const VolumeSlider = memo(() => {
  const classes = useStyles();
  const { playerStore } = useStores();

  const handleChange = (_e: unknown, newValue: number | number[]) => {
    if (!playerStore.isMuted) {
      playerStore.setVolume(newValue as number);
    }
  };

  return (
    <Observer>
      {() => {
        const isMuted = playerStore.isMuted || playerStore.volume === 0;
        const icon = isMuted ? (
          <VolumeOffIcon />
        ) : playerStore.volume <= 0.5 ? (
          <VolumeDown />
        ) : (
          <VolumeUp />
        );
        return (
          <div className={classes.root}>
            <Grid
              container
              className={classes.inner}
              spacing={2}
              alignItems="center"
            >
              <Grid item>
                <ControlButton
                  color="primary"
                  onClick={() => playerStore.toggleMute()}
                >
                  {icon}
                </ControlButton>
              </Grid>
              <Grid item xs>
                <SmallSlider
                  value={playerStore.volume}
                  min={0}
                  step={0.01}
                  max={1}
                  onChange={handleChange}
                  aria-labelledby="volume slider"
                />
              </Grid>
            </Grid>
          </div>
        );
      }}
    </Observer>
  );
});
