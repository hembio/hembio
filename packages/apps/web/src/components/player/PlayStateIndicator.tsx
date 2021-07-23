/** @jsxImportSource @emotion/react */
import { css, keyframes } from "@emotion/react";
import { useTheme } from "@material-ui/core/styles";
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import { createStyles, makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { useStores } from "~/stores";

const indicatorEnter = keyframes({
  "0%": {
    opacity: 0,
    transform: "scale(0.3, 0,3)",
  },
  "20%": {
    opacity: 0.2,
  },
  "100%": {
    opacity: 0,
    transform: "scale(0.8, 0.8)",
  },
});

const useStyles = makeStyles(
  createStyles({
    root: {
      position: "absolute",
      left: "50%",
      top: "50%",
      marginTop: "-25%",
      marginLeft: "-25%",
      pointerEvents: "none",
    },
    indicator: {
      width: "50vw",
      height: "50vw",
      opacity: 0,
      transform: "scale(0.3, 0.3)",
    },
  }),
  { name: "PlayerStateIndicator" },
);

export const PlayStateIndicator = observer(() => {
  const theme = useTheme();
  const classes = useStyles();
  const hideTimer = useRef<number>();
  const [indicator, setIndicator] = useState("pause");
  const [showIndicator, setShowIndicator] = useState(false);
  const { playerStore } = useStores();

  const animate = css`
    animation: ${indicatorEnter} 300ms ${theme.transitions.easing.easeOut};
  `;

  useEffect(() => {
    console.log("Toggled play state");
    if (playerStore.isPlaying) {
      setIndicator("play");
    } else {
      setIndicator("pause");
    }
    setTimeout(() => {
      setShowIndicator(true);
    }, 50);
    hideTimer.current = setTimeout(() => {
      setShowIndicator(false);
    }, 300) as unknown as number;
  }, [playerStore.isPlaying]);

  return (
    <div className={classes.root}>
      {indicator === "pause" && (
        <PauseIcon
          css={showIndicator && animate}
          className={clsx([classes.indicator, { show: showIndicator }])}
        />
      )}
      {indicator === "play" && (
        <PlayArrowIcon
          css={showIndicator && animate}
          className={clsx([classes.indicator, { show: showIndicator }])}
        />
      )}
    </div>
  );
});
