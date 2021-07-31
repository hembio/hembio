import { Paper } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { Theme } from "@material-ui/core/styles";
import { makeStyles, createStyles } from "@material-ui/styles";
import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { Redirect } from "react-router-dom";
import { AuroraCanvas } from "~/aurora/AuroraCanvas";
import { Logo } from "~/components/Logo";
import { SignInForm } from "~/forms/SignInForm";
import { TwoFactorForm } from "~/forms/TwoFactorForm";
import { useStores } from "~/stores";

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      container: {
        position: "absolute",
        left: "5px",
        top: "5px",
        bottom: "5px",
        width: "calc(100% - 5px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 5000,
        "-webkit-app-region": "drag",
        "& *": {
          "-webkit-app-region": "no-drag",
        },
      },
      paper: {
        padding: theme.spacing(4),
        display: "flex",
        placeSelf: "center",
        flexDirection: "column",
        alignItems: "center",
        userSelect: "none",
        // backgroundColor: "rgba(28, 31, 49, .8)",
      },
      footer: {
        userSelect: "none",
      },
      avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
      },
      form: {
        width: "100%",
        marginTop: theme.spacing(1),
      },
      submit: {
        margin: theme.spacing(3, 0, 2),
      },
    }),
  {
    name: "SignIn",
  },
);

export const SignIn = observer(() => {
  const { authStore } = useStores();
  const classes = useStyles();

  if (authStore.isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <Container
        className={classes.container}
        component="main"
        maxWidth={false}
      >
        <Box sx={{ width: "400px" }}>
          <Paper className={clsx(classes.paper)}>
            <Logo sx={{ fontSize: "48px" }} />
            {/* <Typography component="h1" variant="h5">
            Sign in
          </Typography> */}
            {!authStore.isTwoFactorNeeded && <SignInForm />}
            {authStore.isTwoFactorNeeded && <TwoFactorForm />}
          </Paper>
          <Box className={classes.footer} mt={4}>
            <Typography variant="body2" color="textSecondary" align="center">
              {"Made with "}
              <Typography component="span" variant="body1" color="textPrimary">
                <span role="img" aria-label="love">
                  ❤️
                </span>
              </Typography>
              {" by the "}
              <Link color="inherit" href="https://github.com/hembio">
                Hembio team
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
      <AuroraCanvas />
    </>
  );
});
