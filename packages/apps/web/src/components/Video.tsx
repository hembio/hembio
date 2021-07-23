import { createStyles, makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import { memo, useEffect, useRef } from "react";
import type { FileWithTitleFragment } from "../generated/graphql";
import { useStores } from "../stores";

const useStyles = makeStyles(
  createStyles({
    root: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
    },
    embed: {
      height: "100%",
      // "-webkit-app-region": "drag",
    },
    video: {
      placeSelf: "center",
      // Remove width to get automatic zoom
      width: "100%",
      "&::cue": {
        fontFamily: "'Lucida Grande', Arial, serif",
        lineHeight: "1.2em",
        marginBottom: ".5em",
        paddingBottom: "1em",
        background: "none",
        color: "white",
        textShadow: "1px 1px 4px black;",
      },
      "&::cue(b)": {
        color: "yellow",
      },
    },
  }),
  {
    name: "Video",
  },
);

interface Props {
  file: FileWithTitleFragment;
}

// Doesn't need to be an observer for now
export const Video = memo(({ file }: Props) => {
  const { playerStore } = useStores();
  const videoRef = useRef<HTMLVideoElement>(null);
  const embedRef = useRef<HTMLEmbedElement>(null);
  const classes = useStyles();

  useEffect(() => {
    const ref = playerStore.mpv ? embedRef.current : videoRef.current;
    if (ref) {
      playerStore.init(ref);
      playerStore.load(file);
    }
    return () => {
      playerStore.unload();
    };
  });

  if (playerStore.mpv) {
    return (
      <div className={classes.root}>
        <embed
          className={clsx([classes.video, classes.embed])}
          ref={embedRef}
          type="application/x-mpv"
        ></embed>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <video
        onContextMenu={(e) => {
          // Disable right-click menu
          e.preventDefault();
          return false;
        }}
        className={classes.video}
        ref={videoRef}
        onClick={playerStore.togglePlayback}
        crossOrigin="anonymous"
      >
        {[...file.subtitles].map((code) => (
          <track
            key={code}
            label={code}
            kind="captions"
            srcLang={code}
            src={`https://localhost:4000/subtitles/${file.id}/${code}`}
            default={code === "English"}
          ></track>
        ))}
      </video>
    </div>
  );
});
