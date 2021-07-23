import { performance } from "perf_hooks";

const measurers: { [key: string]: number } = {};

export const beginMeasure = (id: string): void => {
  measurers[id] = performance.now();
};

export const endMeasure = (id: string): number => {
  return Math.round((performance.now() - measurers[id]) * 1000) / 1000;
};
