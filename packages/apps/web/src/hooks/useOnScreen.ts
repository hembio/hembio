import { useEffect, useState } from "react";

export function useOnScreen<T extends Element>(
  ref: React.RefObject<T>,
  rootMargin = "0px",
): boolean {
  // State and setter for storing whether element is visible
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update our state when observer callback fires
        setIntersecting(entry.isIntersecting);
      },
      {
        rootMargin,
      },
    );
    const observedRef = ref.current;
    if (observedRef) {
      observer.observe(observedRef);
    }
    return () => {
      if (observedRef) {
        observer.unobserve(observedRef);
      }
    };
  }, [ref, rootMargin]); // Empty array ensures that effect is only run on mount and unmount
  return isIntersecting;
}
