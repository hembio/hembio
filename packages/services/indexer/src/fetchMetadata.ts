import { createLogger } from "@hembio/logger";
import { aggregatedSearch, MetadataResult } from "@hembio/metadata";
import PQueue from "p-queue";
import { matchTitleYear } from "./utils/matchTitleYear";

const queue = new PQueue({ concurrency: 8 });
const logger = createLogger("metadata");

export const fetchMetadata = async (
  titlePath: string,
): Promise<MetadataResult | undefined> => {
  // Try to parse title and year from path
  const match = matchTitleYear(titlePath);

  if (!match || !match.groups) {
    logger.warn(`Failed to match: ${titlePath}`);
    logger.debug(match);
    return;
  }

  const task = queue.add(async () => {
    if (!match || !match.groups) {
      return;
    }
    const year = parseInt(match.groups.year, 10);
    const name = match.groups.title;
    const results = await aggregatedSearch(name, year);
    return results;
  });
  queue.start();

  return task;
};
