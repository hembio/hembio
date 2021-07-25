import { Theme } from "@material-ui/core";
import Alert from "@material-ui/core/Alert";
import AlertTitle from "@material-ui/core/AlertTitle";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Skeleton from "@material-ui/core/Skeleton";
import Typography from "@material-ui/core/Typography";
import { makeStyles, createStyles } from "@material-ui/styles";
import clsx from "clsx";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import { ActionBox } from "../components/ActionBox";
import { Certification } from "../components/Certification";
import { CreditsBox } from "../components/CreditsBox";
import { TitleDebugBox } from "../components/TitleDebugBox";
import { HEMBIO_API_URL } from "../constants";
import { NotFound } from "./NotFound";
import { BackgroundPortal } from "~/components/BackgroundPortal";
import { PosterImage } from "~/components/PosterImage";
import { Rating } from "~/components/Rating";
import { TitleLogo } from "~/components/TitleLogo";
import { TitleWithFilesFragment, useTitleQuery } from "~/generated/graphql";
import { useRefresh } from "~/hooks/useRefresh";

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      root: {
        flexGrow: 1,
        perspective: "1000px",
      },
      logo: {
        maxWidth: "340px",
        height: "112px",
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
        bottom: 0,
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
        // transform: "rotate3d(0, -1, 0, 5deg)",
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
  { name: "Title" },
);

export const Title = (): JSX.Element => {
  const classes = useStyles();
  const history = useHistory();
  const refresh = useRefresh();

  const { titleId } = useParams<{ titleId: string }>();
  const { data, error, refetch } = useTitleQuery({
    variables: { id: titleId },
  });

  if (error) {
    if (error.message === "Title not found") {
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

  const reload = (goBack = false) => {
    if (!goBack) {
      refetch();
    }
    setTimeout(() => {
      if (goBack) {
        history.goBack();
      } else {
        refresh();
      }
    }, 250);
  };

  const title = data?.title;
  const dominantColor = title?.dominantColor ? `#${title.dominantColor}` : "";

  return (
    <div>
      <Container sx={{ mt: -1 }}>
        <Box sx={{ display: "grid", mr: 2 }}>
          <Box className={classes.logo} sx={{ justifySelf: "end" }}>
            {title && <TitleLogo id={title.id} name={title.name} />}
          </Box>
        </Box>
      </Container>

      <Paper
        className={classes.cover}
        sx={{
          ml: -2,
          mr: -2,
          mt: 3,
        }}
      >
        <Box
          className={clsx(classes.movieCover, { show: !!dominantColor })}
          sx={{
            backgroundImage: dominantColor
              ? `linear-gradient(90deg, ${dominantColor}20 10%, ${dominantColor}FF 50%, ${dominantColor}20 90%) !important`
              : undefined,
          }}
        ></Box>
        <Container
          className={classes.root}
          sx={{ mb: 14, position: "relative" }}
        >
          <Grid
            container
            spacing={2}
            flexDirection="row"
            justifyContent="stretch"
          >
            <Grid
              item
              xs={12}
              sm={3}
              flexShrink={0}
              flexGrow={0}
              sx={{
                transform: "rotate3d(0, -1, 0, -5deg)",
                minWidth: "360px",
                ml: 1,
              }}
            >
              <PosterImage
                id={title ? title.id : undefined}
                thumbnail={title ? title.thumb : undefined}
                size="large"
                style={{
                  boxShadow: "-4px 4px 24px rgba(0,0,0,.4)",
                  marginTop: "-100px",
                  marginBottom: "-75px",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
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
                        {!title ? (
                          <Skeleton sx={{ width: "50%" }} />
                        ) : (
                          title.name
                        )}
                      </Typography>
                    </Grid>
                    {title?.ratings.aggregated && (
                      <Grid item flexShrink={1}>
                        <Rating rating={title.ratings.aggregated || 0} />
                      </Grid>
                    )}
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
                        {!title && (
                          <Skeleton variant="text" sx={{ width: "40%" }} />
                        )}
                        {title && (
                          <>
                            {title.year}
                            {title.runtime &&
                              `\u00A0\u00A0\u00A0${title.runtime} mins`}
                            {title.certification && "\u00A0\u00A0\u00A0"}
                            {title.certification && (
                              <Certification
                                certification={title.certification}
                              />
                            )}
                            {"\u00A0\u00A0\u00A0"}
                            {title.genres.map((g) => g.name).join(", ")}
                          </>
                        )}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Typography variant="h6" sx={{ mt: 0.4 }} fontStyle="italic">
                    {!title ? (
                      <Skeleton variant="text" sx={{ width: "70%" }} />
                    ) : (
                      title.tagline
                    )}
                  </Typography>
                </Grid>
                <Grid item md={12} lg={10} xl={9}>
                  <Typography variant="body1" align="justify" sx={{ mt: 1 }}>
                    {!title ? (
                      <>
                        <Skeleton variant="text" />
                        <Skeleton variant="text" />
                        <Skeleton variant="text" />
                      </>
                    ) : (
                      title.overview
                    )}
                  </Typography>
                </Grid>
              </Grid>
              <ActionBox title={title as TitleWithFilesFragment} />
            </Grid>
          </Grid>
        </Container>
      </Paper>

      <Container>
        <CreditsBox title={title} />
      </Container>

      <Container sx={{ position: "relative", zIndex: 1, mt: 2 }}>
        {title && (
          <TitleDebugBox title={title} reload={reload} refetch={refetch} />
        )}
        <Box sx={{ pt: 4 }} />

        {title && (
          <BackgroundPortal
            src={`${HEMBIO_API_URL}/images/titles/${title.id}/background`}
            opacity={0.4}
          />
        )}
      </Container>
    </div>
  );
};
