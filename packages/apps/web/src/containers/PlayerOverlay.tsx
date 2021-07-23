import { createStyles, makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { useRef, useEffect, useState } from "react";
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

let hideUITimer: NodeJS.Timer;

export const PlayerOverlay = observer(() => {
  const classes = useStyles();
  const overlayRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef(window);
  const { playerStore } = useStores();
  const [showUI, setShowUI] = useState(true);
  const history = useHistory();

  const handleInteraction = () => {
    if (hideUITimer) {
      clearTimeout(hideUITimer);
    }
    if (playerStore.isPlaying) {
      hideUITimer = setTimeout(() => {
        setShowUI(false);
      }, 2000);
    }
    if (!showUI) {
      setShowUI(true);
    }
  };

  useDoubleClick(overlayRef, {
    latency: 250,
    onSingleClick: (_e) => {
      playerStore.togglePlayback();
    },
    onDoubleClick: (_e) => {
      playerStore.toggleFullscreen();
    },
  });

  useListener(windowRef, "mousemove", handleInteraction);

  useListener<KeyboardEvent>(windowRef, "keydown", (e) => {
    const { key } = e;
    switch (key) {
      case "Backspace":
        history.go(-1);
        e.preventDefault();
        break;
      case "ArrowRight":
        playerStore.seek(playerStore.currentTime + 10);
        e.preventDefault();
        break;
      case "ArrowLeft":
        playerStore.seek(playerStore.currentTime - 10);
        e.preventDefault();
        break;
      case "F11":
      case "f":
        playerStore.toggleFullscreen();
        e.preventDefault();
        break;
      case "Escape":
        if (playerStore.inFullscreen) {
          e.preventDefault();
          playerStore.toggleFullscreen();
        }
        break;
      case "k":
      case " ":
        playerStore.togglePlayback();
        e.preventDefault();
        break;
    }
  });

  useEffect(() => {
    setTimeout(() => {
      if (playerStore.isPlaying) {
        setShowUI(false);
      }
    }, 2000);
  }, []);

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
