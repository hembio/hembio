import { styled } from "@mui/styles";
import Fade from "@mui/material/Fade";
import LinearProgress from "@mui/material/LinearProgress";
import { Observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { useApolloNetworkStatus } from "~/client";

const TopLinearProgress = styled(LinearProgress)({
  position: "absolute",
  top: "0px",
  left: "0px",
  zIndex: 9999,
  width: "100%",
  height: "2px",
  opacity: 0,
});

export function TopLoadingBar(): JSX.Element {
  const status = useApolloNetworkStatus();
  const [show, setShow] = useState(false);
  const timeout = useRef<number | undefined>();

  useEffect(() => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setShow(
        !!(status.numPendingQueries > 0 || status.numPendingMutations > 0),
      );
    }, 100) as unknown as number;
  }, [status]);

  return (
    <Observer>
      {() => (
        <Fade in={show}>
          <TopLinearProgress color="secondary" />
        </Fade>
      )}
    </Observer>
  );
}
