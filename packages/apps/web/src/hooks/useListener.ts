import { useCallback, useEffect, useRef } from "react";

export const useListener = <T>(
  elm: React.RefObject<HTMLElement | Window>,
  event: string,
  handleEvent: (e: T) => void,
  throttle = 250,
): void => {
  const lastRun = useRef<number>(0);
  const listen = useCallback(
    (e) => {
      if (Date.now() < lastRun.current + throttle) {
        return;
      }
      lastRun.current = Date.now();
      handleEvent(e);
    },
    [throttle, elm, handleEvent],
  );

  useEffect(() => {
    const cur = elm.current;
    if (cur) {
      cur.addEventListener(event, listen);
    }
    return () => {
      cur?.removeEventListener(event, listen);
    };
  }, [listen, elm]);
};
