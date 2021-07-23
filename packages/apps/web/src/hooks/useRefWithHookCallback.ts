import { useRef, useCallback } from "react";

export function useHookWithRefCallback<T = HTMLElement>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialValue: any,
): (node: T) => void {
  const ref = useRef<T>(initialValue);
  const setRef = useCallback((node: T) => {
    ref.current = node;
  }, []);
  return setRef;
}
