import { useRef } from "react";
import { useLocation } from "react-router";

export function useQueryString(name: string): string | null {
  return useAllQueryString()?.get(name);
}
export function useAllQueryString(): URLSearchParams {
  const searchParams = useRef(new URLSearchParams(useLocation().search));
  return searchParams.current;
}
