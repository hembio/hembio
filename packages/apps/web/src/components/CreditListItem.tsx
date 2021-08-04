import Avatar from "@material-ui/core/Avatar";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemButton from "@material-ui/core/ListItemButton";
import ListItemText from "@material-ui/core/ListItemText";
import Skeleton from "@material-ui/core/Skeleton";
import PersonIcon from "@material-ui/icons/Person";
import { Link } from "react-router-dom";
import { HEMBIO_API_URL } from "~/constants";
import { CastFragment, CrewFragment } from "~/generated/graphql";

interface CreditListitemProps {
  credit?: Pick<
    CastFragment & CrewFragment,
    "id" | "job" | "character" | "department" | "person"
  >;
}

export function CreditListitem({ credit }: CreditListitemProps): JSX.Element {
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
      alt={credit && credit.person.name}
      src={
        credit && credit.person.image
          ? `${HEMBIO_API_URL}/images/people${credit.person.image}`
          : undefined
      }
    >
      {credit && !credit.person.image && (
        <PersonIcon sx={{ width: "48px", height: "48px" }} />
      )}
    </Avatar>
  );

  return (
    <ListItemButton
      component={Link}
      sx={{ minHeight: "115px" }}
      to={credit ? `/person/${credit.person.id}` : ""}
    >
      <ListItemAvatar>
        {!credit && <Skeleton variant="circular">{avatar}</Skeleton>}
        {credit && avatar}
      </ListItemAvatar>

      <ListItemText
        sx={{ ml: 2, fontSize: "2em" }}
        primary={
          !credit ? (
            <Skeleton variant="text" width={`${randomWidthPrimary}%`} />
          ) : (
            credit.person.name
          )
        }
        primaryTypographyProps={{ fontSize: "20px" }}
        secondary={
          !credit ? (
            <Skeleton variant="text" width={`${randomWidthSecondary}%`} />
          ) : cast.character ? (
            `as ${cast.character}`
          ) : (
            crew.job
          )
        }
        secondaryTypographyProps={{ fontSize: "16px" }}
      />
    </ListItemButton>
  );
}
