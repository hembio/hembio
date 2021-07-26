import "jest";
import { Matcher } from "../Matcher";

describe("Matcher", () => {
  it("should match 2012 (2009) #1", () => {
    const m = new Matcher(weird2012[0]);
    expect(m.category).toBe("movie");
    expect(m.title).toBe("2012");
    expect(m.year).toBe(2009);
  });

  it("should match 2012 (2009) #2", () => {
    const m = new Matcher(weird2012[1]);
    expect(m.category).toBe("movie");
    expect(m.title).toBe("2012");
    expect(m.year).toBe(2009);
    expect(m.resolution).toBe("2160p");
    expect(m.type).toBe("BluRay");
  });

  it("should match 2012 (2009) #3", () => {
    const m = new Matcher(weird2012[2]);
    expect(m.category).toBe("movie");
    expect(m.title).toBe("2012");
    expect(m.year).toBe(2009);
    expect(m.codec).toBe("x265");
  });

  it("should match Ride Your Wave (2019)", () => {
    const m = new Matcher("Ride.Your.Wave.2019.1080p.BluRay.x264-WUTANG");
    expect(m.category).toBe("movie");
    expect(m.title).toBe("Ride Your Wave");
    expect(m.year).toBe(2019);
    expect(m.resolution).toBe("1080p");
    expect(m.type).toBe("BluRay");
    expect(m.codec).toBe("x264");
    expect(m.releaseGroup).toBe("WUTANG");
  });

  it("should match WingMan (2020)", () => {
    const m = new Matcher("WingMan.2020.1080p.AMZN.WEBRip.DDP5.1.x264-iKA");
    expect(m.category).toBe("movie");
    expect(m.title).toBe("WingMan");
    expect(m.year).toBe(2020);
    expect(m.resolution).toBe("1080p");
    expect(m.type).toBe("WEBRip");
    expect(m.codec).toBe("x264");
    expect(m.releaseGroup).toBe("iKA");
    expect(m.audio?.code).toBe("ddp");
    expect(m.audio?.channels).toBe("5.1");
  });

  it("should match TV5Monde Thalassa Des Abers a la Mer d Iroise (2020)", () => {
    const m = new Matcher(
      "TV5Monde.Thalassa.2020.Des.Abers.a.la.Mer.d.Iroise.1080p.x265.AAC.MVGroup.org.mkv",
      "show",
    );
    expect(m.show).toBe("TV5Monde Thalassa");
    expect(m.title).toBe("Des Abers a la Mer d Iroise");
    expect(m.year).toBe(2020);
    expect(m.resolution).toBe("1080p");
    expect(m.codec).toBe("x265");
    expect(m.audio?.code).toBe("aac");
  });

  it("should match dubbed", () => {
    const m = new Matcher("Black.Clover.S03E19.DUBBED.HDTV.x264-W4F");
    expect(m.category).toBe("show");
    expect(m.show).toBe("Black Clover");
    expect(m.type).toBe("HDTV");
    expect(m.isDubbed).toBe(true);
  });

  it("should match proper", () => {
    const m = new Matcher(
      "Stargirl.S01E11.PROPER.HDR.2160p.WEB.h265-TRUMP[rartv]",
    );
    expect(m.category).toBe("show");
    expect(m.show).toBe("Stargirl");
    expect(m.resolution).toBe("2160p");
    expect(m.type).toBe("WEB");
    expect(m.codec).toBe("H.265");
    expect(m.releaseGroup).toBe("TRUMP");
    expect(m.isProper).toBe(true);
  });

  it("should match", () => {
    const m = new Matcher(
      "The.Mandalorian.S02E03.DV.2160p.DSNP.WEB-DL.DDP5.1.Atmos.x265-MZABI[rartv]",
    );
    expect(m.category).toBe("show");
    expect(m.show).toBe("The Mandalorian");
    expect(m.season).toBe(2);
    expect(m.episode).toBe(3);
    expect(m.resolution).toBe("2160p");
    expect(m.type).toBe("WEB-DL");
    expect(m.codec).toBe("x265");
    expect(m.releaseGroup).toBe("MZABI");
    expect(m.audio?.channels).toBe("5.1");
    expect(m.audio?.codec).toBe("eac3");
    expect(m.isDolbyVision).toBe(true);
  });

  it("should match 3d, truehd, atmos and half-sbs", () => {
    const m = new Matcher(
      "Trolls.World.Tour.2020.1080p.3D.BluRay.Half-SBS.x264.TrueHD.7.1.Atmos-FGT",
    );
    expect(m.category).toBe("movie");
    expect(m.title).toBe("Trolls World Tour");
    expect(m.resolution).toBe("1080p");
    expect(m.type).toBe("BluRay");
    expect(m.sbs).toBe("half");
    expect(m.codec).toBe("x264");

    expect(m.is3D).toBe(true);
    expect(m.releaseGroup).toBe("FGT");

    expect(m.audio?.channels).toBe("7.1");
    expect(m.audio?.code).toBe("truehd");
    expect(m.audio?.long).toBe("Dolby TrueHD w/ Atmos");
  });

  it("should match directors cut #1", () => {
    const m = new Matcher("THX.1138.1971.DC.1080p.BluRay.x265-RARBG");
    expect(m).toBeInstanceOf(Matcher);
    expect(m.category).toBe("movie");
    expect(m.title).toBe("THX 1138");
    expect(m.type).toBe("BluRay");
    expect(m.resolution).toBe("1080p");
    expect(m.codec).toBe("x265");
    expect(m.edition).toBe("Director's cut");
    expect(m.year).toBe(1971);
    expect(m.releaseGroup).toBe("RARBG");
  });

  it("should match directors cut #2", () => {
    const m = new Matcher(
      "Janelle.Monae.Dirty.Computer.2018.Directors.Cut.WEBRip.XviD.MP3-XVID",
    );
    expect(m).toBeInstanceOf(Matcher);
    expect(m.category).toBe("movie");
    expect(m.title).toBe("Janelle Monae Dirty Computer");
    expect(m.year).toBe(2018);
    expect(m.type).toBe("WEBRip");
    expect(m.codec).toBe("XviD");
    expect(m.audio?.code).toBe("mp3");
    expect(m.edition).toBe("Director's cut");
  });

  it("should match special collectors edition", () => {
    const m = new Matcher(
      "Top.Gun.1986.Special.Collectors.Edition.1080p.EUR.BluRay.AVC.DTS-HD.MA.6.1-FGT",
    );
    expect(m).toBeInstanceOf(Matcher);
    expect(m.category).toBe("movie");
    expect(m.title).toBe("Top Gun");
    expect(m.year).toBe(1986);
    expect(m.resolution).toBe("1080p");
    expect(m.type).toBe("BluRay");
    expect(m.codec).toBe("AVC");
    expect(m.releaseGroup).toBe("FGT");
    expect(m.audio?.code).toBe("dtshdma");
    expect(m.audio?.channels).toBe("6.1");
    expect(m.edition).toBe("Special Collector's Edition");
  });

  it("should match Star Trek Picard S01E08 Broken Pieces", () => {
    const m = new Matcher(
      "Star.Trek.Picard.S01E08.Broken.Pieces.1080p.AMZN.WEB-DL.DDP5.1.H.264-NTb",
    );
    expect(m).toBeInstanceOf(Matcher);
    expect(m.category).toBe("show");
    expect(m.show).toBe("Star Trek Picard");
    expect(m.title).toBe("Broken Pieces");
    expect(m.type).toBe("WEB-DL");
    expect(m.provider).toBe("Amazon");
    expect(m.codec).toBe("H.264");
    expect(m.audio?.code).toBe("ddp");
    expect(m.audio?.channels).toBe("5.1");
  });

  it("should match NOS4A2 S02E06 The Hourglass", () => {
    const m = new Matcher(
      "NOS4A2.S02E06.The.Hourglass.1080p.AMZN.WEBRip.DDP5.1.x264-NTG",
    );
    expect(m).toBeInstanceOf(Matcher);
    expect(m.category).toBe("show");
    expect(m.show).toBe("NOS4A2");
    expect(m.title).toBe("The Hourglass");
    expect(m.type).toBe("WEBRip");
    expect(m.provider).toBe("Amazon");
    expect(m.codec).toBe("x264");
    expect(m.audio?.code).toBe("ddp");
    expect(m.audio?.channels).toBe("5.1");
  });

  it("should match The Expanse S05E07", () => {
    const m = new Matcher("The.Expanse.S05E06.HDR.2160p.WEB.H265-GLHF");
    expect(m.show).toBe("The Expanse");
    expect(m.season).toBe(5);
    expect(m.episode).toBe(6);
    expect(m.type).toBe("WEB");
    expect(m.releaseGroup).toBe("GLHF");
    expect(m.category).toBe("show");
  });

  it("should match The Expanse S03E08", () => {
    const m = new Matcher(
      "The.Expanse.S03.2160p.AMZN.WEB-DL.x265.10bit.HDR.DTS-HD.MA.5.1-SAFETY[rartv]\\The.Expanse.S03E08.It.Reaches.Out.2160p.AMZN.WEB-DL.DTS-HD.MA.5.1.HDR.HEVC-SAFETY.mkv",
    );
    expect(m.show).toBe("The Expanse");
    expect(m.title).toBe("It Reaches Out");
    expect(m.season).toBe(3);
    expect(m.episode).toBe(8);
    expect(m.isHDR).toBe(true);
    expect(m.resolution).toBe("2160p");
    expect(m.releaseGroup).toBe("SAFETY");
    expect(m.category).toBe("show");
  });

  it("should match The Expanse S05E06", () => {
    const m = new Matcher(
      "The.Expanse.S05E06.HDR.2160p.WEB.H265-GLHF\\the.expanse.s05e06.hdr.2160p.web.h265-glhf.mkv",
    );
    expect(m.show).toBe("The Expanse");
    expect(m.title).toBe("");
    expect(m.season).toBe(5);
    expect(m.episode).toBe(6);
    expect(m.isHDR).toBe(true);
    expect(m.resolution).toBe("2160p");
    expect(m.codec).toBe("H.265");
    expect(m.releaseGroup).toBe("glhf");
    expect(m.category).toBe("show");
  });

  it("should match show with season number episode number and episode title", () => {
    const m = new Matcher(
      "Robot.Chicken.S10E19.Babe.Hollytree.in.I.Wish.One.Person.Had.Died.720p.HDTV.x264-CRiMSON",
    );
    expect(m).toBeInstanceOf(Matcher);
    expect(m.category).toBe("show");
    expect(m.show).toBe("Robot Chicken");
    expect(m.season).toBe(10);
    expect(m.episode).toBe(19);
    expect(m.title).toBe("Babe Hollytree in I Wish One Person Had Died");
    expect(m.codec).toBe("x264");
    expect(m.type).toBe("HDTV");
  });

  it("should match all movies in list", () => {
    randomMovies.forEach((s) => {
      const m = new Matcher(s);
      expect(m).toBeInstanceOf(Matcher);
      expect(m.category).toBe("movie");
      expect(m.title).toBeDefined();
      expect(m.year).toBeDefined();
      expect(m.codec).toBeDefined();
      expect(m.type).toBeDefined();
    });
  });

  it("should auto-detect shows and match", () => {
    randomShows.forEach((s) => {
      const m = new Matcher(s);
      expect(m).toBeInstanceOf(Matcher);
      expect(m.category).toBe("show");
      expect(m.title).toBeDefined();
      expect(m.codec).toBeDefined();
      expect(m.type).toBeDefined();
    });
  });
});

const weird2012 = [
  "2012 (2009) - 1080p.mkv",
  "In Some Weird Place/2012 (2009) 4K BluRay-TERMiNAL.avi",
  "[best ever] 2012 [2009] 1080p x265.mkv",
];

const randomMovies = [
  "Ride.Your.Wave.2019.1080p.BluRay.x264-WUTANG",
  "One.Day.at.Disney.2019.1080p.WEB.h264-WALT",
  "American.Wisper.2020.1080p.BluRay.H264.AAC-RARBG",
  "You.Dont.Nomi.2019.1080p.BluRay.H264.AAC-RARBG",
  "How.You.Look.at.Me.2019.1080p.WEBRip.x264-RARBG",
  "Animal.Crackers.2017.1080p.WEBRip.x264-RARBG",
  "Double.World.2019.CHINESE.1080p.WEBRip.x264-VXT",
  "American.Wisper.2020.1080p.BluRay.x264.DD2.0-FGT",
  "WingMan.2020.1080p.WEBRip.x264-RARBG",
  "You.Dont.Nomi.2019.1080p.BluRay.x264.DTS-CHD",
  "Vibration.2020.1080p.AMZN.WEBRip.DDP2.0.x264-iKA",
  "How.You.Look.at.Me.2019.1080p.AMZN.WEBRip.DDP2.0.x264-iKA",
  "WingMan.2020.1080p.AMZN.WEBRip.DDP5.1.x264-iKA",
  "Double.World.2019.CHINESE.1080p.NF.WEBRip.DDP5.1.x264-NTG",
  "Animal.Crackers.2017.1080p.NF.WEBRip.DDP5.1.x264-TEPES",
  "Babysplitters.2019.1080p.WEB.H264-HUZZAH",
  "Wild.Orchid.1989.UNRATED.1080p.BluRay.H264.AAC-RARBG",
  "The.Group.1966.1080p.BluRay.H264.AAC-RARBG",
  "The.Longest.Yard.1974.1080p.BluRay.H264.AAC-RARBG",
  "Not.For.Publication.1984.1080p.BluRay.H264.AAC-RARBG",
  "Ghost.1990.REMASTERED.1080p.BluRay.H264.AAC-RARBG",
  "Empire.Of.Dreams.The.Story.Of.The.Star.Wars.Trilogy.2004.1080p.BluRay.H264.AAC-RARBG",
  "Airplane.1980.REMASTERED.1080p.BluRay.H264.AAC-RARBG",
  "SEC.Ready.2014.1080p.BluRay.H264.AAC-RARBG",
  "The.Way.of.the.Dragon.1972.CRITERION.CHINESE.1080p.BluRay.H264.AAC-VXT",
];

const randomShows = [
  "NOS4A2.S02E06.WEBRip.x264-ION10",
  "NOS4A2.S02E06.The.Hourglass.1080p.AMZN.WEBRip.DDP5.1.x264-NTG[rartv]",
  "NOS4A2.S02E06.The.Hourglass.720p.AMZN.WEBRip.DDP5.1.x264-NTG[rartv]",
  "Wynonna.Earp.S04E01.WEBRip.x264-ION10",
  "Perry.Mason.2020.S01E06.Chapter.6.1080p.AMZN.WEBRip.DDP5.1.x264-NTb[rartv]",
  "Yellowstone.S03E06.WEBRip.x264-ION10",
  "Stargirl.S01E11.PROPER.HDR.2160p.WEB.h265-TRUMP[rartv]",
  "Stargirl.S01E11.2160p.WEB.H265-BTX",
  "Yellowstone.2018.S03E06.1080p.WEB.H264-METCON[rartv]",
  "Wynonna.Earp.S04E01.1080p.WEB.H264-METCON",
  "Wynonna.Earp.S04E01.720p.WEB.H264-METCON[rartv]",
  "Yellowstone.2018.S03E06.720p.WEB.H264-METCON",
  "Perry.Mason.S01E06.WEBRip.x264-ION10",
  "P-Valley.S01E03.WEBRip.x264-ION10",
  "Perry.Mason.2020.S01E06.Chapter.6.720p.AMZN.WEBRip.DDP5.1.x264-NTb[rartv]",
  "P-Valley.S01E03.Higher.Ground.1080p.AMZN.WEBRip.DDP5.1.x264-NTb[rartv]",
  "P-Valley.S01E03.Higher.Ground.720p.AMZN.WEBRip.DDP5.1.x264-NTb[rartv]",
  "Robot.Chicken.S10E20.Endgame.HDTV.x264-CRiMSON[rartv]",
  "Robot.Chicken.S10E20.Endgame.1080p.HDTV.x264-CRiMSON",
  "Robot.Chicken.S10E20.Endgame.720p.HDTV.x264-CRiMSON",
  "Robot.Chicken.S10E19.Babe.Hollytree.in.I.Wish.One.Person.Had.Died.HDTV.x264-CRiMSON[rartv]",
  "Robot.Chicken.S10E19.Babe.Hollytree.in.I.Wish.One.Person.Had.Died.720p.HDTV.x264-CRiMSON[rartv]",
  "Robot.Chicken.S10E19.Babe.Hollytree.in.I.Wish.One.Person.Had.Died.1080p.HDTV.x264-CRiMSON[rartv]",
  "Snapped.S27E20.720p.WEB.H264-OATH[rartv]",
  "The.Expanse.S03.2160p.AMZN.WEB-DL.x265.10bit.HDR.DTS-HD.MA.5.1-SAFETY[rartv]\\The.Expanse.S03E08.It.Reaches.Out.2160p.AMZN.WEB-DL.DTS-HD.MA.5.1.HDR.HEVC-SAFETY.mkv",
  "The.Expanse.S05E06.HDR.2160p.WEB.H265-GLHF",
  "The.Expanse.S05E04.PROPER.HDR.2160p.WEB.h265-KOGi[rartv]",
  "Cobra.Kai.S01.2160p.NF.WEBRip.DDP5.1.x265-NTb[rartv]",
  "Stargate.Atlantis.S01.1080p.BluRay.X264-P0W4HD\\Stargate.Atlantis.S01E07.1080p.BluRay.X264-P0W4HD.mkv",
];
