import { useLocation } from "react-router-dom";

export function useQueryString(name: string): string | null {
  const location = useLocation();
  const qs = new URLSearchParams(location.search);
  return qs.get(name);
}

export function useQueryStrings<T extends string[]>(
  fields: T,
): Record<T[number], string> {
  const location = useLocation();
  const qs = new URLSearchParams(location.search);
  return fields.reduce(
    (acc, cur) => ({
      ...acc,
      [cur]: qs.get(cur),
    }),
    {},
  ) as Record<T[number], string>;
}
