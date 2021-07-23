import { DependencyList, useCallback, useRef } from "react";

// eslint-disable-next-line @typescript-eslint/ban-types
type Callback = Function;

export function useThrottledCallback<T extends Callback>(
  fn: T,
  dependencies: DependencyList = [],
  throttle = 300,
): T {
  const lastRun = useRef<number>(0);
  const cb = useCallback((...args: unknown[]) => {
    if (Date.now() < lastRun.current + throttle) {
      // Throttled
      return;
    }
    lastRun.current = Date.now();
    fn(...args);
  }, dependencies);
  return cb as unknown as T;
}
