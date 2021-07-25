import { useEffect, useRef, useState } from "react";

interface Options {
  totalItems: number;
  itemsPerPage: number;
  page: number;
  buffer?: number;
  delay?: number;
  loading?: boolean;
}

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

interface VirtualList<T extends readonly unknown[]> {
  list: Array<ArrayElement<T>>;
  offsetPages: number;
  safeToAnimate: boolean;
}

export function useVirtualList<T extends readonly unknown[]>(
  items: T,
  options: Options,
): VirtualList<T> {
  const {
    totalItems,
    itemsPerPage,
    page,
    buffer = itemsPerPage * 2,
    delay = 0,
  } = options;
  const timerRef = useRef<number>();
  const [list, setList] = useState<Array<ArrayElement<T>>>([]);
  const [[skip, take], setCut] = useState([0, 0]);
  const [safeToAnimate, setSafeToAnimate] = useState(true);
  const [offsetPages, setOffsetPages] = useState(0);

  useEffect(() => {
    setSafeToAnimate(false);
    setList(items.slice(skip, take) as ArrayElement<T>[]);
    setOffsetPages(Math.ceil(skip / itemsPerPage));
    setTimeout(() => {
      setSafeToAnimate(true);
    }, 0) as unknown as number;
  }, [skip, take]);

  useEffect(() => {
    setSafeToAnimate(true);
    if (delay > 0) {
      setList(items.slice(skip) as ArrayElement<T>[]);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setCut([
          Math.max(0, page * itemsPerPage - buffer),
          Math.min(page * itemsPerPage + buffer * 2, totalItems),
        ]);
      }, delay) as unknown as number;
    } else {
      setCut([
        Math.max(0, page * itemsPerPage - buffer),
        Math.min(page * itemsPerPage + buffer * 2, totalItems),
      ]);
    }
  }, [items, totalItems, itemsPerPage, page, buffer, delay]);

  return { list, offsetPages, safeToAnimate };
}
