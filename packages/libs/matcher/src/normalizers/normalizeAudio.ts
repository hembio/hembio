export interface Audio {
  codec?: string;
  code?: string;
  channels?: string;
  long?: string;
}

const rxp =
  /(?<code>(DTS(-HD)?\.?(?:MA)?|[A-Z3-]+))\.?(?<channels>[0-9]\.[0-9])?\.?(?<atmos>ATMOS)?/;

export function normalizeAudio(input: string): Audio {
  const result: Audio = {};
  const matches = rxp.exec(input.toUpperCase());

  let atmos = "";
  let code = input;
  if (matches?.groups) {
    code = matches?.groups.code;
    result.channels = matches?.groups.channels;
    if (matches?.groups.atmos) {
      atmos = " w/ Atmos";
    }
  }

  // Remove dash and dots to minimize cases
  const normalizedCode = code.replace(/[-.]/g, "");
  switch (normalizedCode) {
    case "MP3":
      result.code = "mp3";
      result.codec = "mp3";
      break;
    case "AAC":
      result.code = "aac";
      result.codec = "aac";
      break;

    // Dolby
    case "AC3":
    case "DD":
      result.code = "dd";
      result.codec = "ac3";
      result.long = "Dolby Digital";
      break;
    case "DDP":
      result.code = "ddp";
      result.codec = "eac3";
      result.long = "Dolby Digital Plus" + atmos;
      break;
    case "TRUEHD":
      result.code = "truehd";
      result.long = "Dolby TrueHD" + atmos;
      break;

    // DTS
    case "DTS":
      result.code = "dts";
      result.codec = "dca";
      result.long = "DTS";
      break;
    case "DTSES":
      result.code = "dts";
      result.codec = "dca";
      result.long = "DTS Extended Surround";
      break;
    case "DTSHD":
      result.code = "dtshd";
      result.codec = "dca";
      result.long = "DTS-HD";
      break;
    case "DTSHDMA":
      result.code = "dtshdma";
      result.codec = "dca-xll";
      result.long = "DTS-HD Master Audio";
      break;
    case "DTSX":
      result.code = "dtsx";
      result.codec = "dca-xll";
      result.long = "DTS:X";
      break;
  }
  return result;
}
