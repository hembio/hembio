import { useState, useEffect } from "react";

export const useImage = (src: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setHasError] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    setStarted(true);
    setHasError(false);

    // Here's where the magic happens.
    const image = new Image();
    image.src = src;

    const handleError = () => {
      setHasError(true);
    };

    const handleLoad = () => {
      setLoading(false);
      setHasError(false);
    };

    image.onerror = handleError;
    image.onload = handleLoad;

    return () => {
      image.removeEventListener("error", handleError);
      image.removeEventListener("load", handleLoad);
    };
  }, [src]);

  return { loading, error, hasStartedInitialFetch: started };
};
