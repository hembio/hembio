import { getEnv } from "@hembio/core";

const {
  HEMBIO_SERVICE_API_PORT: apiPort,
  HEMBIO_SERVICE_IMAGES_PORT: imagesPort,
  HEMBIO_SERVICE_INDEXER_PORT: indexerPort,
  HEMBIO_SERVICE_METADATA_PORT: metadataPort,
  HEMBIO_SERVICE_TRANSCODER_PORT: transcoderPort,
} = getEnv();

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const config = () => ({
  services: {
    api: {
      port: apiPort ? parseInt(apiPort, 10) : 4000,
      host: "localhost",
    },
    images: {
      port: imagesPort ? parseInt(imagesPort, 10) : 4001,
      host: "localhost",
    },
    indexer: {
      port: indexerPort ? parseInt(indexerPort, 10) : 4002,
      host: "localhost",
    },
    metadata: {
      port: metadataPort ? parseInt(metadataPort, 10) : 4003,
      host: "localhost",
    },
    transcoder: {
      port: transcoderPort ? parseInt(transcoderPort, 10) : 4004,
      host: "localhost",
    },
  },
});
