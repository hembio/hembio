export function getOptions(options: any) {
  let {
    inputOptions = [],
    videoFilters,
    inputVideoCodec,
    outputVideoCodec,
  } = options;

  // For transcoding
  if (inputVideoCodec === outputVideoCodec) {
    inputOptions = ["-hwaccel_output_format cuda", ...inputOptions];
  }

  // Decoding
  inputOptions = ["-hwaccel cuda", ...inputOptions];
  if (inputVideoCodec === "h264") {
    inputVideoCodec = "h264_cuvid";
  } else if (inputVideoCodec === "hevc") {
    inputVideoCodec = "hevc_cuvid";
  }

  // Encoding
  if (outputVideoCodec === "h264") {
    outputVideoCodec = "h264_nvenc";
  } else if (outputVideoCodec === "hevc") {
    outputVideoCodec = "hevc_nvenc";
  }

  return {
    ...options,
    inputFlags: inputOptions,
    inputVideoCodec,
    videoCodec: outputVideoCodec,
    videoFilters,
  };
}
