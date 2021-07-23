import {
  Button,
  Card,
  CardContent,
  Container,
  Typography,
} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/styles";
import { memo } from "react";
import { useHistory } from "react-router-dom";
import confusedTravolta from "$/404.gif";
import movieRollStorage from "$/404_bg.jpg";

const quotes = [
  [
    "Frankly, my dear, I don't give a damn.",
    "Rhett Butler",
    "Clark Gable",
    "Gone With The Wind",
    1939,
  ],
  [
    "Louis, I think this is the beginning of a beautiful friendship.",
    "Rick Blaine",
    "Humphrey Bogart",
    "Casablanca",
    1942,
  ],
  [
    "The greatest trick the Devil ever pulled was convincing the world he did not exist.",
    "Keyser Söze",
    "Kevin Spacey",
    "The Usual Suspects",
    1995,
  ],
  [
    "Nein! Nein! Nein! Nein! Nein!",
    "Adolf Hitler",
    "Martin Wuttke",
    "Inglourious Basterds",
    2009,
  ],
  [
    "I'm going to make him an offer he can't refuse.",
    "Don Vito Corleone",
    "Marlon Brando",
    "The Godfather",
    1972,
  ],
  [
    "Toto, I've got a feeling we're not in Kansas anymore.",
    "Dorothy Gale",
    "Judy Garland",
    "The Wizard of Oz",
    1939,
  ],
  [
    "I got a baad feeling about this.",
    "Han Solo",
    "Harrison Ford",
    "Star Wars: Episode IV A New Hope",
    1977,
  ],
  [
    "Game over man! Game over! What the fuck are we going to do now? What are we gonna do?",
    "Private Hudson",
    "Bill Paxton",
    "Aliens",
    1986,
  ],
];

const useStyles = makeStyles(
  createStyles({
    root: {
      height: "calc(100% - 64px)",
    },
    bg: {
      position: "fixed",
      bottom: 0,
      right: 0,
      top: 0,
      left: 0,
      backgroundImage: "url(" + movieRollStorage + ")",
      backgroundSize: "cover",
      maskImage:
        "linear-gradient(bottom right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))",
    },
    title: {
      position: "relative",
      fontFamily: "Comic Sans MS, Comic Sans, cursive",
      filter: "drop-shadow(2px 2px 8px black)",
      fontSize: "24em",
      zIndex: 1,
    },
    image: {
      position: "absolute",
      bottom: "-20px",
      right: "-30%",
      height: "60%",
      transformOrigin: "bottom right",
      transform: "scale(1.4)",
    },
    text: {
      position: "relative",
      zIndex: 1,
      width: "60%",
    },
  }),
  {
    name: "NotFound",
  },
);

export const NotFound = memo(() => {
  const history = useHistory();
  const classes = useStyles();
  const [quote, character, actor, movie, year] =
    quotes[Math.floor(Math.random() * quotes.length)];
  return (
    <div className={classes.root}>
      <div className={classes.bg}></div>
      <Container sx={{ position: "relative", height: "100%" }}>
        <div>
          <div className={classes.text}>
            <Typography variant="h1" className={classes.title}>
              404
            </Typography>
            <Card sx={{ p: 4 }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontSize: "2em" }}>
                  <i>&ldquo;{quote}&rdquo;</i>
                </Typography>
                <Typography
                  variant="h6"
                  color="secondary"
                  sx={{ mt: 1 }}
                  align="right"
                >
                  {`${actor} as`}
                </Typography>
                <Typography
                  variant="h5"
                  color="secondary"
                  sx={{ mt: 1, fontSize: "2em" }}
                  align="right"
                >
                  {`${character}`}
                </Typography>
                <Typography
                  variant="h6"
                  color="secondary"
                  sx={{ mt: 1 }}
                  align="right"
                >
                  {`in ${movie} (${year})`}
                </Typography>
              </CardContent>
              <CardContent sx={{ mt: 4 }}>
                {"Try to "}
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => history.goBack()}
                  sx={{ ml: 1, mr: 1 }}
                >
                  Go back
                </Button>
                {" or "}
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => history.push("/")}
                  sx={{ ml: 1, mr: 1 }}
                >
                  Go Home
                </Button>
              </CardContent>
            </Card>
          </div>
          <img
            className={classes.image}
            src={confusedTravolta}
            alt="Confused Travolta"
          />
        </div>
      </Container>
    </div>
  );
});
