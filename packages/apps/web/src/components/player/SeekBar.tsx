// import { prettyDuration } from "@hembio/core";
import { Observer } from "mobx-react-lite";
import { memo } from "react";
import { useStores } from "../../stores";
import { Slider } from "./Slider";

export const SeekBar = memo(() => {
  const { playerStore } = useStores();

  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleChange = (e: Event, newValue: number | number[]) => {
    // e.preventDefault();
    // e.stopPropagation();
    playerStore.seek(Array.isArray(newValue) ? newValue[0] : newValue);
  };

  return (
    <Observer>
      {() => (
        <Slider
          value={playerStore.currentTime}
          min={0}
          step={1}
          max={playerStore.duration}
          onChange={handleChange}
          aria-labelledby="seekbar"
          // valueLabelFormat={(value) => prettyDuration(value, false)}
          // valueLabelDisplay="auto"
        />
      )}
    </Observer>
  );
});
