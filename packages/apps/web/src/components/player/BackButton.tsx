import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Tooltip } from "@mui/material";
import { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ControlButton } from "./ControlButton";

interface Props {
  showUI?: boolean;
}

export const BackButton = memo(({ showUI }: Props) => {
  const navigate = useNavigate();
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
          navigate(-1);
        }}
      >
        <ArrowBackIcon />
      </ControlButton>
    </Tooltip>
  );
});
