import { Theme } from "@material-ui/core";
import Alert from "@material-ui/core/Alert";
import AlertTitle from "@material-ui/core/AlertTitle";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Skeleton from "@material-ui/core/Skeleton";
import Typography from "@material-ui/core/Typography";
import PersonIcon from "@material-ui/icons/Person";
import { makeStyles, createStyles } from "@material-ui/styles";
import { useParams } from "react-router-dom";
import { NotFound } from "./NotFound";
import { TitleCard } from "~/components/TitleCard";
import { HEMBIO_API_URL } from "~/constants";
import { usePersonQuery } from "~/generated/graphql";

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      root: {
        flexGrow: 1,
        perspective: "1000px",
      },
      logo: {
        maxWidth: "440px",
        height: "180px",
      },
      cover: {
        position: "relative",
        borderRadius: "0",
        backgroundColor: "#1c1f3130",
        backgroundImage: `linear-gradient(90deg, #1c1f3130 10%, #1c1f31a6 50%, #1c1f3130 90%)`,
        backdropFilter: "blur(8px)",
        border: "none",
        transition: theme.transitions.create("backgroundImage", {
          duration: "2000ms",
          easing: "ease-in",
        }),
      },
      movieCover: {
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        opacity: "0",
        borderRadius: "0",
        transition: theme.transitions.create("opacity", {
          duration: "1000ms",
          easing: "ease",
        }),
        "&.show": {
          opacity: 1,
        },
      },
      background: {
        position: "fixed",
        top: 0,
        zIndex: -1,
        width: "100vw",
        height: "100vw",
        opacity: "0.4",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "50% 50%",
      },
      actionBox: {
        position: "absolute",
        right: "5px",
        bottom: "-60px",
        marginRight: "60px",
      },
      actionButton: {
        boxShadow: "2px 0px 24px rgba(0,0,0,.4), 0px 0px 1px rgba(0,0,0,.4)",
        height: "80px",
        width: "80px",
        backgroundColor: "rgba(51, 62, 78, 1)",
        "&:hover": {
          backgroundColor: "rgba(41, 52, 68, 1)",
        },
        "& .MuiSvgIcon-root": {
          width: "48px",
          height: "48px",
        },
        "&.big": {
          marginTop: "-20px",
          height: "120px",
          width: "120px",
          "& .MuiSvgIcon-root": {
            width: "100px",
            height: "100px",
          },
        },
      },
    }),
  { name: "Person" },
);

export const Person = (): JSX.Element => {
  const classes = useStyles();
  const { personId } = useParams<{ personId: string }>();
  const { data, error } = usePersonQuery({
    variables: { id: personId },
  });

  if (error) {
    if (error.message === "Person not found") {
      return <NotFound />;
    }
    return (
      <Container>
        <Alert severity="error">
          <AlertTitle>GraphQL Error</AlertTitle>
          {error.message}
          <br />
          <pre style={{ whiteSpace: "pre-wrap" }}>{error.stack}</pre>
        </Alert>
      </Container>
    );
  }

  const person = data?.person;

  console.log(person?.credits);

  const image =
    person && person.image
      ? `${HEMBIO_API_URL}/images/people${person.image}`
      : undefined;

  const directing =
    person?.credits.filter((c) => c.job === "Director") ||
    new Array(4).fill(undefined);

  const acting =
    person?.credits.filter((c) => c.job === "Actor") ||
    new Array(4).fill(undefined);

  return (
    <>
      <Paper
        className={classes.cover}
        sx={{
          ml: -2,
          mr: -2,
          mt: 16,
        }}
      >
        <Box className={classes.movieCover}></Box>
        <Container
          className={classes.root}
          sx={{ mb: 14, position: "relative" }}
        >
          <Grid container spacing={2} flexDirection="row">
            <Grid
              item
              xs
              flexShrink={4}
              flexGrow={0}
              sx={{
                ml: 1,
              }}
            >
              <Card
                sx={{
                  boxShadow: "-4px 4px 24px rgba(0,0,0,.4)",
                  marginTop: "-100px",
                  marginBottom: "-75px",
                  width: "360px",
                  height: "540px",
                  display: "grid",
                  justifyContent: "stretch",
                  alignContent: "stretch",
                }}
              >
                {person && !image && (
                  <PersonIcon
                    sx={{
                      mt: 8,
                      alignSelf: "center",
                      justifySelf: "center",
                      opacity: 0.5,
                      width: "256px",
                      height: "256px",
                    }}
                  />
                )}
                {person && <CardMedia title={person.name} image={image} />}
              </Card>
            </Grid>
            <Grid item xs>
              <Grid
                item
                container
                flexDirection="column"
                sx={{
                  p: 4,
                  pl: 6,
                  pr: 6,
                  userSelect: "text",
                }}
              >
                <Grid item>
                  <Grid
                    container
                    flexDirection="row"
                    justifyContent="space-between"
                  >
                    <Grid item xs flexGrow={5}>
                      <Typography
                        variant="h4"
                        fontWeight="fontWeightBold"
                        sx={{
                          mb: 0.2,
                          fontSize: "30px",
                          textShadow: "1px 2px 1px rgba(0,0,0,.5)",
                        }}
                      >
                        {!person ? (
                          <Skeleton sx={{ width: "50%" }} />
                        ) : (
                          person.name
                        )}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid
                    container
                    flexDirection="row"
                    justifyContent="space-between"
                  >
                    <Grid item xs flexGrow={5}>
                      <Typography variant="h6" sx={{ opacity: "0.5" }}>
                        {!person && (
                          <Skeleton variant="text" sx={{ width: "40%" }} />
                        )}
                        {person && person?.birthday && (
                          <>{`Born on ${person?.birthday} in ${person?.placeOfBirth}`}</>
                        )}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Typography
                    variant="body1"
                    align="justify"
                    sx={{ mt: 1, mb: 2 }}
                  >
                    {!person ? (
                      <>
                        <Skeleton variant="text" />
                        <Skeleton variant="text" />
                        <Skeleton variant="text" />
                      </>
                    ) : (
                      person.bio
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Paper>

      <Container>
        <Paper>
          <Box
            sx={{
              p: 4,
              display: "grid",
              gap: 2,
              gridAutoFlow: "row",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              // justifyItems: "stretch",
              alignItems: "center",
            }}
          >
            {directing.length > 0 && (
              <>
                <Box sx={{ gridColumn: "1 / -1" }}>
                  <Typography variant="h5" color="body1">
                    Directing
                  </Typography>
                </Box>
                {directing.map((credit, idx) => (
                  <TitleCard key={credit?.id || idx} title={credit?.title} />
                ))}
              </>
            )}
            {acting.length > 0 && (
              <>
                <Box sx={{ gridColumn: "1 / -1" }}>
                  <Typography variant="h5" color="body1">
                    Starring
                  </Typography>
                </Box>
                {acting.map((credit, idx) => (
                  <TitleCard key={credit?.id || idx} title={credit?.title} />
                ))}
              </>
            )}
          </Box>
        </Paper>
        <Box sx={{ pt: 6 }} />
      </Container>

      {/* <Container
        className={classes.root}
        sx={{ position: "relative", zIndex: 1, mt: 2 }}
      >
        <CreditsBox title={person} />

        {person && (
          <TitleDebugBox title={person} reload={reload} refetch={refetch} />
        )}
        <Box sx={{ pt: 4 }} />

        {person && (
          <BackgroundPortal
            src={`${HEMBIO_API_URL}/images/titles/${person.id}/background`}
            opacity={0.4}
          />
        )}
      </Container> */}
    </>
  );
};
