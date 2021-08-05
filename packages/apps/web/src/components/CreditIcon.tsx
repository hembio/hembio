import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import ColorLensIcon from "@material-ui/icons/ColorLens";
import ContentCutIcon from "@material-ui/icons/ContentCut";
import CreateIcon from "@material-ui/icons/Create";
import FaceIcon from "@material-ui/icons/Face";
import FlareIcon from "@material-ui/icons/Flare";
import HandymanIcon from "@material-ui/icons/Handyman";
import MovieCreationIcon from "@material-ui/icons/MovieCreation";
import MusicNoteIcon from "@material-ui/icons/MusicNote";
import PersonIcon from "@material-ui/icons/Person";
import StarIcon from "@material-ui/icons/Star";
import VideocamIcon from "@material-ui/icons/Videocam";
import WbIncandescentIcon from "@material-ui/icons/WbIncandescent";
import { memo } from "react";
import { CreditListitemProps } from "./CreditByTitleListItem";

export const CreditIcon = memo(
  ({ credit }: CreditListitemProps): JSX.Element => {
    const sx = { width: "48px", height: "48px" };
    if (!credit) {
      return <PersonIcon sx={sx} />;
    }

    const department =
      credit.job === "Actor" ||
      (credit.department === "Acting" && credit.character)
        ? "Starring"
        : credit.department;
    switch (department) {
      case "Starring":
        return <StarIcon sx={sx} />;
      case "Directing":
        return <MovieCreationIcon sx={sx} />;
      case "Production":
        return <AccountBalanceIcon sx={sx} />;
      case "Writing":
        return <CreateIcon sx={sx} />;
      case "Editing":
        return <ContentCutIcon sx={sx} />;
      case "Sound":
        return <MusicNoteIcon sx={sx} />;
      case "Camera":
        return <VideocamIcon sx={sx} />;
      case "Art":
        return <ColorLensIcon sx={sx} />;
      case "Visual Effects":
        return <FlareIcon sx={sx} />;
      case "Lighting":
        return <WbIncandescentIcon sx={sx} />;
      case "Costume & Make-Up":
        return <FaceIcon sx={sx} />;
      case "Crew":
        return <HandymanIcon sx={sx} />;
      default:
        return <PersonIcon sx={sx} />;
    }
  },
);
