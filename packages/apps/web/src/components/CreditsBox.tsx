import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Fragment, useState } from "react";
import { CreditListitem } from "./CreditListItem";
import {
  CrewFragment,
  TitleQuery,
  useTitleCreditsQuery,
} from "~/generated/graphql";

interface CreditBoxProps {
  title?: TitleQuery["title"];
}

export function CreditsBox({ title }: CreditBoxProps): JSX.Element {
  const [show, setShow] = useState(false);

  const { data } = useTitleCreditsQuery({
    variables: { id: (title && title.id) || "" },
    skip: !show,
  });

  const topBilling = title ? title.topBilling : new Array(8).fill(undefined);

  const cast = data?.title?.cast || new Array(8).fill(undefined);
  const crew = data?.title?.crew || [];

  const departments: Record<string, CrewFragment[]> = {
    Cast: cast,
    Crew: [],
  };

  crew.forEach((crew) => {
    if (crew && crew.department) {
      if (!departments[crew.department]) {
        departments[crew.department] = [];
      }
      departments[crew.department].push(crew);
    } else {
      departments["Crew"].push(crew);
    }
  });

  return (
    <Paper>
      <Container>
        <Box
          sx={{
            p: 4,
            pl: 1,
            pr: 1,
            display: "grid",
            gap: 2,
            gridAutoFlow: "row",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            justifyItems: "stretch",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              gridColumn: "1 / -1",
              display: "grid",
              gridAutoFlow: "column",
            }}
          >
            <Box>
              <Typography variant="h5">Top cast</Typography>
            </Box>
            {title && topBilling.length > 0 && (
              <Box sx={{ justifySelf: "end" }}>
                <Button
                  variant="text"
                  color="primary"
                  size="medium"
                  onClick={() => setShow(!show)}
                >
                  {show ? "Only Top Cast" : "All Cast & Crew"}
                </Button>
              </Box>
            )}
          </Box>

          {!show &&
            topBilling.map((credit, idx) => (
              <CreditListitem key={credit ? credit.id : idx} credit={credit} />
            ))}
          {show &&
            [
              "Cast",
              "Writing",
              "Directing",
              "Production",
              "Editing",
              "Camera",
              "Art",
              "Sound",
              "Lighting",
              "Visual Effects",
              "Acting",
              "Costume & Make-Up",
              "Crew",
            ].map((depName) => {
              const credits = departments[depName];
              if (!credits || credits.length === 0) {
                return;
              }
              return (
                <Fragment key={depName}>
                  {depName !== "Cast" && (
                    <Box sx={{ gridColumn: "1 / -1" }}>
                      <Typography variant="h5">{depName}</Typography>
                    </Box>
                  )}
                  {credits.map((credit, idx) => (
                    <CreditListitem
                      key={credit ? credit.id : idx}
                      credit={credit}
                    />
                  ))}
                </Fragment>
              );
            })}
        </Box>
      </Container>
    </Paper>
  );
}
