import { Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Observer } from "mobx-react-lite";
import { memo, useEffect, useState } from "react";
import { ControlButton } from "./ControlButton";
import { useStores } from "~/stores";

interface Props {
  showUI?: boolean;
}

export const PlaybackToggle = memo(({ showUI }: Props) => {
  const { playerStore } = useStores();
  const [showTooltip, setTooltip] = useState(false);
  useEffect(() => {
    if (showUI === false) {
      setTooltip(false);
    }
  }, [showUI]);
  return (
    <Observer>
      {() => (
        <Box sx={{ position: "relative" }}>
          <Tooltip
            open={showTooltip}
            onClose={() => setTooltip(false)}
            onOpen={() => setTooltip(true)}
            title={playerStore.isPlaying ? "Pause (k)" : "Play (k)"}
            aria-label="toggle playback"
          >
            <ControlButton
              color="primary"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                playerStore.togglePlayback();
              }}
            >
              {playerStore.isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </ControlButton>
          </Tooltip>
          {playerStore.isPending && (
            <CircularProgress
              size={56}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 1,
                pointerEvents: "none",
                color: "inherit",
                opacity: 0.2,
              }}
            />
          )}
        </Box>
      )}
    </Observer>
  );
});
