/** @jsxImportSource @emotion/react */
/** @jsx jsx */
import { css, keyframes } from "@emotion/react";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useTheme } from "@material-ui/core/styles";
import PauseCircleFilledTwoToneIcon from "@material-ui/icons/PauseCircleFilledTwoTone";
import PlayCircleFilledTwoToneIcon from "@material-ui/icons/PlayCircleFilledTwoTone";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { useStores } from "~/stores";

const indicatorEnter = keyframes({
  "0%": {
    opacity: 0,
    transform: "scale(0.3, 0,3)",
  },
  "20%": {
    opacity: 1,
  },
  "100%": {
    opacity: 0,
    transform: "scale(1, 1)",
  },
});

export const PlayStateIndicator = observer(() => {
  const theme = useTheme();
  const hideTimer = useRef<number>();
  const [indicator, setIndicator] = useState("pending");
  const [showIndicator, setShowIndicator] = useState(false);
  const { playerStore } = useStores();

  const animate = css`
    animation: ${indicatorEnter} 500ms ${theme.transitions.easing.sharp};
  `;

  useEffect(() => {
    if (playerStore.isPending || !playerStore.isReady) {
      setIndicator("pending");
    } else if (playerStore.isPlaying) {
      setIndicator("play");
    } else {
      setIndicator("pause");
    }
    setTimeout(() => {
      setShowIndicator(true);
    }, 50);
    hideTimer.current = setTimeout(() => {
      setShowIndicator(false);
    }, 500) as unknown as number;
  }, [playerStore.isPlaying]);

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        display: "grid",
        justifyItems: "center",
        alignItems: "center",
        pointerEvents: "none",
        color: "rgba(255, 255, 255, .5)",
        "> .MuiSvgIcon-root": {
          width: "10vw",
          height: "10vw",
          opacity: 0,
          transform: "scale(0.3, 0.3)",
        },
      }}
    >
      {indicator === "pending" && (
        <CircularProgress color="inherit" size="10vw" />
      )}
      {indicator === "pause" && (
        <PauseCircleFilledTwoToneIcon css={showIndicator && animate} />
      )}
      {indicator === "play" && (
        <PlayCircleFilledTwoToneIcon css={showIndicator && animate} />
      )}
    </Box>
  );
});
