import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import CreateIcon from "@mui/icons-material/Create";
import FaceIcon from "@mui/icons-material/Face";
import FlareIcon from "@mui/icons-material/Flare";
import HandymanIcon from "@mui/icons-material/Handyman";
import MovieCreationIcon from "@mui/icons-material/MovieCreation";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import PersonIcon from "@mui/icons-material/Person";
import StarIcon from "@mui/icons-material/Star";
import VideocamIcon from "@mui/icons-material/Videocam";
import WbIncandescentIcon from "@mui/icons-material/WbIncandescent";
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
