import * as nv from "./nv";
import * as qsv from "./qsv";

export const hwaccel: Record<string, typeof nv | typeof qsv> = {
  nv,
  qsv,
};
