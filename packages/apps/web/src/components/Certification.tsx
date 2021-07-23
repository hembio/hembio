import { createStyles, makeStyles } from "@material-ui/styles";
import gRating from "$/certification/g.svg";
import nc17Rating from "$/certification/nc-17.svg";
import nrRating from "$/certification/nr.svg";
import pg13Rating from "$/certification/pg-13.svg";
import pgRating from "$/certification/pg.svg";
import rRating from "$/certification/r.svg";

const certifications: Record<string, string> = {
  NR: nrRating,
  R: rRating,
  G: gRating,
  PG: pgRating,
  "PG-13": pg13Rating,
  "NC-17": nc17Rating,
};

const useStyles = makeStyles(
  createStyles({
    root: {
      height: "19px",
      marginBottom: "-0.1em",
    },
  }),
  { name: "Certification" },
);

export function Certification({
  certification,
}: {
  certification: string;
}): JSX.Element {
  const classes = useStyles();
  return (
    <img
      className={classes.root}
      src={certifications[certification]}
      alt={`Rated ${certification}`}
      title={`Rated ${certification}`}
    />
  );
}
