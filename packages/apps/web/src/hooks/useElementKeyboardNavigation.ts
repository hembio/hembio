import { useEffect, RefObject, useRef } from "react";
import { useKeyPress } from "./useKeyPress";

export function useElementKeyboardNavigation<T extends RefObject<HTMLElement>>(
  ref: T,
): void {
  const idx = useRef(-1);
  const arrowDown = useKeyPress("ArrowDown");
  const arrowUp = useKeyPress("ArrowUp");
  useEffect(() => {
    const elm = ref.current;
    if (elm) {
      if (arrowDown) {
        idx.current = Math.min(idx.current + 1, elm.children.length - 1);
      } else if (arrowUp) {
        idx.current = Math.max(0, idx.current - 1);
      }

      if (arrowDown || arrowUp) {
        const cur = elm.children.item(idx.current);
        if (cur && cur.firstChild) {
          const fc = cur.firstChild as HTMLElement;
          fc.focus();
        }
      }
    }
  }, [arrowDown, arrowUp]);
}
