import { useRef } from "react";
import { useListener } from "./useListener";

interface Options {
  latency?: number;
  buttons?: number[];
  preventDefault?: boolean;
  stopPropagation?: boolean;
  onlySelf?: boolean;
  onSingleClick?: (e: MouseEvent) => void;
  onDoubleClick?: (e: MouseEvent) => void;
}

export const useDoubleClick = (
  ref: React.RefObject<HTMLElement | Window>,
  {
    onSingleClick = undefined,
    onDoubleClick = undefined,
    // Defaults to left-click
    // 1 = left-click
    // 2 = right-click
    // 4 = scroll button
    buttons = [1],
    preventDefault = true,
    stopPropagation = false,
    onlySelf = true,
    latency = 300,
  }: Options,
): void => {
  const cc = useRef(0);
  useListener<MouseEvent>(
    ref,
    "mousedown",
    (e) => {
      console.log(e);
      if (onlySelf && e.target !== ref.current) return;
      if (!buttons.includes(e.buttons)) return;
      if (preventDefault) e.preventDefault();
      if (stopPropagation) e.stopPropagation();
      cc.current += 1;
      setTimeout(() => {
        if (cc.current === 1 && onSingleClick) {
          onSingleClick(e);
        } else if (cc.current === 2 && onDoubleClick) {
          onDoubleClick(e);
        }
        cc.current = 0;
      }, latency);
    },
    50,
  );
};
