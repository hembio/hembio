import { prettyDuration } from "@hembio/core";
import { createStyles, makeStyles } from "@mui/styles";
import { Typography } from "@mui/material";
import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { useStores } from "../../stores";
import { ActorsMiniMenu } from "./ActorsMiniMenu";
import { BackButton } from "./BackButton";
import { FullscreenToggle } from "./FullScreenToggle";
import { PlaybackToggle } from "./PlaybackToggle";
import { SeekBar } from "./SeekBar";
import { SubtitleSelector } from "./SubtitleSelector";
import { VolumeSlider } from "./VolumeSlider";

const useStyles = makeStyles(
  createStyles({
    container: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      zIndex: 100,
      padding: "20px 40px",
      paddingTop: "100px",
      background:
        "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 65%, rgba(0,0,0,0.85) 100%)",
      transitionDuration: ".2s",
      transitionTimingFunction: "ease-out",
      transitionProperty: "opacity, transform",
      pointerEvents: "all",
    },
    hide: {
      opacity: 0,
      transitionTimingFunction: "ease-in",
      transform: "translate3d(0, 25%, 0)",
    },
    button: {
      margin: "10px 0",
      width: "75px",
    },
    time: {
      margin: "0 1em",
    },
    spacer: {
      display: "inline-block",
      width: "1em",
    },
    secondRow: {
      display: "flex",
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    section: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    leftSection: {
      justifyContent: "flex-start",
    },
    midSection: {
      justifyContent: "center",
    },
    rightSection: {
      justifyContent: "flex-end",
    },
  }),
  {
    name: "BottomBar",
  },
);

interface Props {
  showUI?: boolean;
  onInteraction?: () => void;
}

export const BottomBar = observer(({ showUI, onInteraction }: Props) => {
  const { playerStore } = useStores();
  const classes = useStyles();

  if (playerStore.duration === -1) {
    return null;
  }

  return (
    // TODO: Can we fix this?
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={clsx(classes.container, { [classes.hide]: !showUI })}
      onMouseDown={onInteraction}
    >
      <SeekBar />
      <div className={classes.secondRow}>
        <div className={clsx(classes.section, classes.leftSection)}>
          <BackButton showUI={showUI} />
          <PlaybackToggle showUI={showUI} />
          <VolumeSlider />
          <Typography variant="body1" className={classes.time}>
            {prettyDuration(playerStore.currentTime)} /{" "}
            {prettyDuration(playerStore.duration, false)}
          </Typography>
        </div>
        <div className={clsx(classes.section, classes.rightSection)}>
          <Typography variant="body1" className={classes.time}>
            {"Ends at " + playerStore.endsAt}
          </Typography>
          <ActorsMiniMenu showUI={showUI} />
          <SubtitleSelector showUI={showUI} />
          <FullscreenToggle showUI={showUI} />
        </div>
      </div>
    </div>
  );
});
