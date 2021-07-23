import { useEffect } from "react";
import { isElectron } from "../utils/isElectron";

export function useElectronDrag<T extends React.RefObject<HTMLElement>>(
  ref: T,
): void {
  useEffect(() => {
    if (!isElectron()) {
      return;
    }
    const onDragStart = (_e: MouseEvent) => {
      ref.current?.classList.remove("electron-no-drag");
      ref.current?.classList.add("electron-drag");
      setTimeout(() => {
        ref.current?.classList.remove("electron-drag");
        ref.current?.classList.add("electron-no-drag");
      }, 500);
    };
    const onDragEnd = (_e: MouseEvent) => {
      ref.current?.classList.remove("electron-drag");
      ref.current?.classList.add("electron-no-drag");
    };
    ref.current?.addEventListener("mousedown", onDragStart);
    ref.current?.addEventListener("mouseup", onDragEnd);
    return () => {
      ref.current?.removeEventListener("mousedown", onDragStart);
      ref.current?.removeEventListener("mouseup", onDragEnd);
    };
  }, []);
}
