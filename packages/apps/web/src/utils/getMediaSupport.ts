const videoCodecs: Record<string, string[]> = {
  h264: ["avc1.640029"],
  h265: ["hev1", "hvc1", "hevc"],
  vp8: ["vp8"],
  vp9: ["vp9", "vp09.00.50.08"],
  av1: ["av01.0.08M.08"],
  dvhe: ["dvhe"], // HEVC-based Dolby Vision
};

const audioCodecs: Record<string, string[]> = {
  aac_ps: ["mp4a.40.29"],
  aac_sbr: ["mp4a.40.05"], // MPEG-4 AAC-SBR
  aac_lc: ["mp4a.40.02"], // MPEG-4 AAC-LC
  ac3: ["ac-3", "mp4a.a5"], // Dolby Digital
  eac3: ["ec-3", "mp4a.a6"], // Dolby Atmos
  "dts+": ["dts+"],
  dtsx: ["dtsx"],
  vorbis: ["vorbis"],
  ogg: ["theora"],
  mp3: ["mp4a.69", "mp4a.6B"],
};

export const getMediaSupport = () => {
  const ve = document.createElement("video");

  const video: Record<string, Record<string, boolean>> = Object.keys(
    videoCodecs,
  ).reduce((acc, cur) => {
    const add = videoCodecs[cur].reduce(
      (acc2, cur2) => ({
        ...acc2,
        [cur2]: ve.canPlayType(`video/mp4; codecs="${cur2}"`) === "probably",
      }),
      {},
    );
    return { ...acc, [cur]: add };
  }, {});

  const audio: Record<string, Record<string, boolean>> = Object.keys(
    audioCodecs,
  ).reduce((acc, cur) => {
    const add = audioCodecs[cur].reduce(
      (acc2, cur2) => ({
        ...acc2,
        [cur2]: ve.canPlayType(`video/mp4; codecs="${cur2}"`) === "probably",
      }),
      {},
    );
    return { ...acc, [cur]: add };
  }, {});

  return { video, audio };
};
