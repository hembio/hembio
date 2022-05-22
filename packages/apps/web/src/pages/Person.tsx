import { Theme } from "@mui/material";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import PersonIcon from "@mui/icons-material/Person";
import { makeStyles, createStyles } from "@mui/styles";
import { useParams } from "react-router-dom";
import { NotFound } from "./NotFound";
import { CreditByTitleListItem } from "~/components/CreditByTitleListItem";
import { PersonDebugBox } from "~/components/PersonDebugBox";
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
  const { data, error, refetch } = usePersonQuery({
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

  const image =
    person && person.image
      ? `${HEMBIO_API_URL}/images/people${person.image}`
      : undefined;

  return (
    <>
      <Paper
        className={classes.cover}
        sx={{
          mt: 16,
        }}
      >
        <Box className={classes.movieCover}></Box>
        <Container
          className={classes.root}
          sx={{ mb: 14, position: "relative" }}
        >
          <Grid
            container
            spacing={2}
            flexDirection="row"
            justifyContent="stretch"
            flexWrap="nowrap"
          >
            <Grid
              item
              xs={12}
              sm={3}
              sx={{
                minWidth: "360px",
                maxWidth: "360px",
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
            <Grid item flexGrow={10}>
              <Box
                sx={{
                  p: 4,
                  userSelect: "text",
                }}
              >
                <Box>
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
                </Box>
                <Box>
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
                </Box>
                <Box
                  sx={{
                    maxHeight: "200px",
                    pr: 1,
                    overflow: "auto",
                  }}
                >
                  {!person ? (
                    <Typography
                      variant="body1"
                      align="justify"
                      sx={{
                        maxHeight: "200px",
                        pr: 1,
                        overflow: "auto",
                      }}
                    >
                      <Skeleton variant="text" />
                      <Skeleton variant="text" />
                      <Skeleton variant="text" />
                    </Typography>
                  ) : (
                    person.bio?.split("\n").map((line: string, idx) => (
                      <Typography
                        variant="body1"
                        key={`bio-${idx}`}
                        sx={{ mt: 1, mb: 2 }}
                      >
                        {line}
                      </Typography>
                    ))
                  )}
                </Box>
              </Box>
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
              gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
              alignItems: "top",
            }}
          >
            {person &&
              person.creditsByTitle &&
              person.creditsByTitle.map((title, idx) => (
                <>
                  <Box
                    sx={{
                      display: "grid",
                      gap: 2,
                      gridAutoFlow: "row",
                      gridTemplateColumns:
                        "repeat(auto-fit, 140px minmax(250px, 1fr))",
                      alignItems: "top",
                    }}
                  >
                    <TitleCard
                      size="small"
                      key={title?.id || idx}
                      title={title}
                    />
                    <Box sx={{ mt: -2 }}>
                      {title &&
                        title.credits.map((credit, idx) => (
                          <CreditByTitleListItem
                            key={credit ? credit.id : idx}
                            credit={{ ...credit, person }}
                          />
                        ))}
                    </Box>
                  </Box>
                </>
              ))}
          </Box>
        </Paper>
        <Box sx={{ pt: 3 }} />
      </Container>

      <Container
        className={classes.root}
        sx={{ position: "relative", zIndex: 1, mt: 2 }}
      >
        {person && <PersonDebugBox person={person} refetch={refetch} />}
        <Box sx={{ pt: 4 }} />
      </Container>
    </>
  );
};
