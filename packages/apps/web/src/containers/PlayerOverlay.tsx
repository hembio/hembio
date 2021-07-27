import { createStyles, makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import { observer, useObserver } from "mobx-react-lite";
import { useRef, useState } from "react";
import { useHistory } from "react-router";
import { TopBar } from "~/components/TopBar";
import { BottomBar } from "~/components/player/BottomBar";
import { PlayStateIndicator } from "~/components/player/PlayStateIndicator";
import { useDoubleClick } from "~/hooks/useDoubleClick";
import { useListener } from "~/hooks/useListener";
import { useStores } from "~/stores";

const useStyles = makeStyles(
  createStyles({
    container: {
      position: "absolute",
      display: "flex",
      height: "100%",
      width: "100%",
      overflow: "hidden",
      flexDirection: "column",
      justifyContent: "space-between",
      "&.hideCursor": {
        cursor: "none",
      },
    },
    subtitles: {
      width: "100%",
      fontFamily: "'Lucida Grande', Arial, serif",
      fontSize: "2.8em",
      lineHeight: "0.2em",
      marginBottom: "-2.5em",
      background: "none",
      color: "white",
      textShadow: "1px 1px 6px black, 1px 1px 2px black",
      textAlign: "center",
    },
    moveDown: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      marginBottom: "1em",
    },
  }),
  { name: "PlayerOverlay" },
);

export const PlayerOverlay = observer(() => {
  const classes = useStyles();
  const overlayRef = useRef<HTMLDivElement>(null);
  const hideUITimer = useRef<NodeJS.Timeout>();
  const seekMultiplier = useRef(1);
  const lastSeek = useRef(0);
  const windowRef = useRef(window);
  const { playerStore } = useStores();
  const [showUI, setShowUI] = useState(true);
  const history = useHistory();

  const startHideTimer = () => {
    if (hideUITimer.current) {
      clearTimeout(hideUITimer.current);
    }
    hideUITimer.current = setTimeout(() => {
      setShowUI(false);
    }, 3000);
  };

  const handleInteraction = () => {
    startHideTimer();
    if (!showUI) {
      setShowUI(true);
    }
  };

  useObserver(() => {
    if (playerStore.isPlaying) {
      startHideTimer();
    }
  });

  useDoubleClick(overlayRef, {
    latency: 250,
    onSingleClick: (_e) => {
      playerStore.togglePlayback();
      handleInteraction();
    },
    onDoubleClick: (_e) => {
      playerStore.toggleFullscreen();
      handleInteraction();
    },
  });

  useListener(windowRef, "mousemove", handleInteraction);

  useListener<KeyboardEvent>(
    windowRef,
    "keydown",
    (e) => {
      const { key } = e;
      let handled = false;
      let seeked = false;
      switch (key) {
        case "Backspace":
          history.go(-1);
          handled = true;
          break;
        case "l":
        case "ArrowRight":
          if (Date.now() - lastSeek.current > 140) {
            seekMultiplier.current = 1;
          }
          playerStore.seek(
            playerStore.currentTime + 10 * seekMultiplier.current,
          );
          seeked = true;
          handled = true;
          break;
        case "j":
        case "ArrowLeft":
          if (Date.now() - lastSeek.current > 140) {
            seekMultiplier.current = 1;
          }
          playerStore.seek(
            playerStore.currentTime - 10 * seekMultiplier.current,
          );
          seeked = true;
          handled = true;
          break;
        case "F11":
        case "f":
          playerStore.toggleFullscreen();
          handled = true;
          break;
        case "Escape":
          if (playerStore.inFullscreen) {
            handled = true;
            playerStore.toggleFullscreen();
          }
          break;
        case "k":
        case " ":
          playerStore.togglePlayback();
          handled = true;
          break;
        case "m":
          playerStore.toggleMute();
          handled = true;
          break;
      }

      if (seeked) {
        lastSeek.current = Date.now();
        seekMultiplier.current = Math.min(
          50,
          seekMultiplier.current + seekMultiplier.current * 0.25,
        );
      }

      if (handled) {
        handleInteraction();
        e.preventDefault();
      }
    },
    100,
  );

  const reallyShowUI = showUI || !playerStore.isPlaying;
  return (
    <div
      className={clsx(classes.container, { hideCursor: !reallyShowUI })}
      ref={overlayRef}
    >
      <TopBar show={reallyShowUI} title={playerStore.file?.title} />
      <div
        className={clsx(classes.subtitles, {
          [classes.moveDown]: !showUI,
        })}
      >
        {playerStore.isPlaying &&
          playerStore.textCues.map((cue) => {
            return cue.text
              .split("\n")
              .map((line, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: line }}></p>
              ));
          })}
      </div>
      <PlayStateIndicator />
      <BottomBar showUI={reallyShowUI} onInteraction={handleInteraction} />
    </div>
  );
});
