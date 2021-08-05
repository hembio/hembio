import Avatar from "@material-ui/core/Avatar";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Skeleton from "@material-ui/core/Skeleton";
import { CreditIcon } from "./CreditIcon";
import { CastFragment, CrewFragment } from "~/generated/graphql";

type CreditFragment = Pick<
  CastFragment & CrewFragment,
  "id" | "job" | "character" | "department" | "person"
>;

export interface CreditListitemProps {
  credit?: CreditFragment;
}

export function CreditByTitleListItem({
  credit,
}: CreditListitemProps): JSX.Element {
  const cast = credit as CastFragment;
  const crew = credit as CrewFragment;

  const randomWidthPrimary = !credit ? Math.random() * 30 + 40 : 0;
  const randomWidthSecondary = !credit ? Math.random() * 10 + 40 : 0;

  const avatar = (
    <Avatar
      sx={{
        width: "80px",
        height: "80px",
        fontSize: "64px",
      }}
      alt={credit && credit.department}
    >
      <CreditIcon credit={credit} />
    </Avatar>
  );

  return (
    <ListItem sx={{ minHeight: "115px" }}>
      <ListItemAvatar>
        {!credit && <Skeleton variant="circular">{avatar}</Skeleton>}
        {credit && avatar}
      </ListItemAvatar>

      <ListItemText
        sx={{ ml: 2, fontSize: "2em" }}
        primary={
          !credit ? (
            <Skeleton variant="text" width={`${randomWidthPrimary}%`} />
          ) : cast.character ? (
            cast.character
          ) : (
            crew.job
          )
        }
        primaryTypographyProps={{ fontSize: "20px" }}
        secondary={
          !credit ? (
            <Skeleton variant="text" width={`${randomWidthSecondary}%`} />
          ) : credit.department && cast.character ? (
            "Starring"
          ) : undefined
        }
        secondaryTypographyProps={{ fontSize: "16px" }}
      />
    </ListItem>
  );
}
