import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { useState } from "react";
import { CreditListitem } from "./CreditListItem";
import {
  CrewFragment,
  TitleWithFilesFragment,
  useTitleCreditsQuery,
} from "~/generated/graphql";

interface CreditBoxProps {
  title?: TitleWithFilesFragment | null;
}

export function CreditsBox({ title }: CreditBoxProps): JSX.Element {
  const [show, setShow] = useState(false);

  const { data } = useTitleCreditsQuery({
    variables: { id: (title && title.id) || "" },
    skip: !show,
  });

  if (!show) {
    const topBilling = title ? title.topBilling : new Array(6).fill(undefined);
    return (
      <Paper>
        <Grid
          container
          sx={{ p: 4, pt: 2, mt: 6 }}
          flexDirection="row"
          spacing={2}
        >
          <Grid item sx={{ mb: 2 }} flexGrow={5}>
            <Grid container>
              <Grid item xs flexGrow={6.8}>
                <Typography variant="h5">Top cast</Typography>
              </Grid>
              {title && topBilling.length > 0 && (
                <Grid item xs>
                  <Button
                    variant="text"
                    color="primary"
                    size="medium"
                    onClick={() => setShow(!show)}
                  >
                    {show ? "Only Top Cast" : "All Cast & Crew"}
                  </Button>
                </Grid>
              )}
            </Grid>
            <Grid container flexDirection="row" spacing={2}>
              {topBilling.map((credit, idx) => (
                <Grid item key={!credit ? idx : credit.id}>
                  <CreditListitem credit={credit} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    );
  }

  const cast = data?.title?.cast || new Array(12).fill(undefined);
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
      <Grid
        container
        sx={{ p: 4, pt: 2, mt: 6 }}
        flexDirection="row"
        spacing={2}
      >
        {[
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
            <Grid
              key={depName}
              item
              xs={depName === "Cast" ? 12 : undefined}
              sx={{ mb: 2 }}
              flexGrow={10}
            >
              <Grid container>
                <Grid item xs flexGrow={7.6}>
                  <Typography variant="h5">{depName}</Typography>
                </Grid>
                {depName === "Cast" && (
                  <Grid item xs>
                    <Button
                      variant="text"
                      color="primary"
                      size="medium"
                      onClick={() => setShow(!show)}
                    >
                      {show ? "Only Top Cast" : "All Cast & Crew"}
                    </Button>
                  </Grid>
                )}
              </Grid>
              <Grid container flexDirection="row" spacing={2} sx={{ mt: 0 }}>
                {credits.map((credit, idx) => (
                  <Grid item key={!credit ? idx : credit.id}>
                    <CreditListitem credit={credit} />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
}
