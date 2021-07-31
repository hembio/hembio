import { Tooltip } from "@material-ui/core";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";
import { Observer } from "mobx-react-lite";
import { memo, useEffect, useState } from "react";
import { useStores } from "../../stores";
import { ControlButton } from "./ControlButton";

interface Props {
  showUI?: boolean;
}

export const FullscreenToggle = memo(({ showUI }: Props) => {
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
        <Tooltip
          open={showTooltip}
          onClose={() => setTooltip(false)}
          onOpen={() => setTooltip(true)}
          title={
            playerStore.inFullscreen
              ? "Exit full screen (f)"
              : "Full screen (f)"
          }
          aria-label="toggle fullscreen"
        >
          <ControlButton
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              playerStore.toggleFullscreen();
            }}
          >
            {playerStore.inFullscreen ? (
              <FullscreenExitIcon />
            ) : (
              <FullscreenIcon />
            )}
          </ControlButton>
        </Tooltip>
      )}
    </Observer>
  );
});
