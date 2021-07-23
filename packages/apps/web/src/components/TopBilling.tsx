import { CardActionArea } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import PersonIcon from "@material-ui/icons/Person";
import { HEMBIO_API_URL } from "../constants";
import { CrewFragment, CastFragment } from "~/generated/graphql";

interface TopBillingProps {
  credit: CastFragment | CrewFragment;
}

export function TopBilling({ credit }: TopBillingProps): JSX.Element {
  const cast = credit as CastFragment;
  const crew = credit as CrewFragment;
  return (
    <Card key={Date.now()} sx={{ width: 168 }} variant="outlined">
      <CardActionArea>
        {!credit.person.image && (
          <Box
            sx={{
              height: 200,
              fontSize: 64,
              backgroundColor: "#111",
              opacity: 0.8,
            }}
          >
            <PersonIcon sx={{ fontSize: 128, m: 2, mt: 4 }} />
          </Box>
        )}
        {credit.person.image && (
          <CardMedia
            sx={{ height: 200 }}
            image={`${HEMBIO_API_URL}/images/people${credit.person.image}`}
            title={credit.person.name}
          />
        )}
        <CardContent sx={{ minHeight: "95px" }}>
          <Typography gutterBottom variant="h2" sx={{ fontSize: "16px" }}>
            {credit.person.name}
          </Typography>
          <Typography gutterBottom variant="h3" sx={{ fontSize: "14px" }}>
            {cast.character || crew.job}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
