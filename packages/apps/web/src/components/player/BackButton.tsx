import { Tooltip } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { memo, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { ControlButton } from "./ControlButton";

interface Props {
  showUI?: boolean;
}

export const BackButton = memo(({ showUI }: Props) => {
  const history = useHistory();
  const [showTooltip, setTooltip] = useState(false);
  useEffect(() => {
    if (showUI === false) {
      setTooltip(false);
    }
  }, [showUI]);
  return (
    <Tooltip
      open={showTooltip}
      onClose={() => setTooltip(false)}
      onOpen={() => setTooltip(true)}
      title={"Back (backspace)"}
      aria-label="navigate back"
    >
      <ControlButton
        color="primary"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          history.goBack();
        }}
      >
        <ArrowBackIcon />
      </ControlButton>
    </Tooltip>
  );
});
