export function patchOptions(options: any) {
  if (!options.hardwareAcceleration) {
    return options;
  }

  let {
    inputFlags = [],
    videoFilters = [],
    inputVideoCodec,
    videoCodec,
    outputFlags = [],
  } = options;

  // Decoding
  inputFlags = ["-hwaccel qsv", ...inputFlags];
  if (inputVideoCodec === "h264") {
    inputVideoCodec = "h264_qsv";
  } else if (inputVideoCodec === "hevc") {
    inputVideoCodec = "hevc_qsv";
    inputFlags = ["-load_plugin hevc_hw", ...inputFlags];
  }

  // Encoding
  if (videoCodec === "h264") {
    videoCodec = "h264_qsv";
    videoFilters = ["hwdownload", "format=nv12", ...videoFilters];
    outputFlags = [
      "-init_hw_device qsv=hw",
      "-filter_hw_device hw",
      "-look_ahead 1",
      ...outputFlags,
    ];
  } else if (videoCodec === "hevc") {
    videoCodec = "hevc_qsv";
    videoFilters = ["hwdownload", "format=nv12", ...videoFilters];
    outputFlags = [
      "-init_hw_device qsv=hw",
      "-filter_hw_device hw",
      ...outputFlags,
    ];
  }

  return {
    ...options,
    inputFlags,
    inputVideoCodec,
    videoCodec,
    videoFilters,
    outputFlags,
  };
}
