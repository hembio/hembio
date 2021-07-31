import fs from "fs";
import path from "path";
import { getCwd } from "@hembio/core";
import execa from "execa";

const isWin = process.platform === "win32";
const is64 = process.arch === "x64";
const ext = isWin ? ".exe" : "";

const BIN = path.resolve(
  getCwd(),
  "./bin/",
  (isWin ? "win" : "linux") + (is64 ? "64" : "32"),
  "./mediainfo/mediainfo" + ext,
);

export interface MediaInfoVideoTrack {
  width: number;
  height: number;
  codec: string;
  fps: number;
  bitrate: boolean;
  profile: string;
  settings: string;
  aspect: string;
  colorSpace: string;
  chroma: string;
  bitDepth: number;
}

export interface MediaInfoAudioTrack {
  ch: number;
  ch_pos: string;
  sample_rate: string;
  codec: string;
  bitrate: number;
  bitrate_mode: string;
  lang: string;
}

export interface MediaInfo {
  general: {
    path: string;
    format: string;
    size: number;
    bitrate: number;
    duration: number;
    created: string;
    modified: string;
    encoded: string;
    tagged: string;
    menu: boolean;
  };
  video?: MediaInfoVideoTrack[];
  audio?: MediaInfoAudioTrack[];
  subs?: string[];
}

const template = `
Page;
Page_Begin;
Page_Middle;
Page_End;
;
File;
File_Begin;{
File_Middle;,
File_End;}
;
General;'path': '%CompleteName%','format': '%Format%','size': %FileSize%,'bitrate': %OverallBitRate%,'duration': %Duration%,'created': '%File_Created_Date%','modified': '%File_Modified_Date%','encoded': '%Encoded_Date%','tagged': '%Tagged_Date%','menu': $if(%MenuCount%,true,false)
General_Begin;'general':{
General_Middle;
General_End;}
;
Video;{'width': %Width%,'height': %Height%,'format': '%Format%','codec': '%CodecID%','fps': $if(%FrameRate%,%FrameRate%,false),'bitrate': $if(%BitRate%,%BitRate%,false),'profile':$if(%Format_Profile%, '%Format_Profile%', false),'settings':$if(%Format_Settings%, '%Format_Settings%', false),'aspect':$if(%DisplayAspectRatio%, '%DisplayAspectRatio/String%', ''), 'colorSpace': '%ColorSpace%','chroma': '%ChromaSubsampling%','bitDepth': %BitDepth%}
Video_Begin;,'video':[
Video_Middle;,
Video_End;]
;
Audio;{'ch': %Channel(s)%,'chPos': '%ChannelPositions%','sampleRate': '%SamplingRate%','codec': '%CodecID%','bitrate': $if(%BitRate%,%BitRate%,false),'bitrateMode': '$if(%BitRate_Mode%,%BitRate_Mode%,false)','lang': $if(%Language%, '%Language%',false)}
Audio_Begin;,'audio':[
Audio_Middle;,
Audio_End;]
;
Text; '%Language%'
Text_Begin;,'subs':[
Text_Middle;,
Text_End;]
;`;

export async function mediainfo(file: string): Promise<MediaInfo> {
  if (!fs.existsSync(file)) {
    throw Error("Input file does not exist");
  }

  // fs.writeFileSync(
  //   "./info-params",
  //   (await execa(BIN, ["--Info-Parameters"])).stdout,
  // );
  // fs.writeFileSync("./file-info", (await execa(BIN, [file])).stdout);

  const { stdout, stderr, exitCode } = await execa(
    BIN,
    [file, `--Inform=${template}`],
    { timeout: 30000 },
  );

  if (exitCode == -2) {
    throw new Error("Cannot run mediainfo: " + stderr);
  } else if (exitCode == 255) {
    throw new Error("At last one input file is needed: " + stderr);
  } else if (exitCode !== 0) {
    throw new Error("Error trying to get the file details: " + stderr);
  }

  const data = stdout
    .replace(/'/g, '"')
    .replace(/\n/, "")
    .replace(/\\/g, "\\\\");

  let json: MediaInfo;
  try {
    json = JSON.parse(data);
  } catch {
    throw Error("Failed to parse output");
  }

  return json;
}
