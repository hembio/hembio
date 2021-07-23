import { Theme, Toolbar } from "@material-ui/core";
import { experimentalStyled as styled } from "@material-ui/core/styles";
import { createStyles, makeStyles } from "@material-ui/styles";
import { observer } from "mobx-react-lite";
import { useLayoutEffect, useState } from "react";
import { Route, Switch, useLocation, useRouteMatch } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { Credits } from "../pages/Credits";
import { Profile } from "../pages/Profile";
import { Footer } from "./Footer";
import { ProtectedRoute } from "./ProtectedRoute";
import { AppBar } from "~/components/AppBar";
import { BackgroundPortal } from "~/components/BackgroundPortal";
import { Drawer } from "~/components/Drawer";
import { TopLoadingBar } from "~/components/TopLoadingBar";
import { Home } from "~/pages/Home";
import { Library } from "~/pages/Library";
import { NotFound } from "~/pages/NotFound";
import { Player } from "~/pages/Player";
import { Settings } from "~/pages/Settings";
import { SignIn } from "~/pages/SignIn";
import { Title } from "~/pages/Title";
import { useStores } from "~/stores";

const drawerWidth = 240;

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      enter: {
        opacity: "0",
        transition: theme.transitions.create("opacity", {
          duration: theme.transitions.duration.enteringScreen,
          easing: theme.transitions.easing.sharp,
        }),
      },
      "enter-active": {
        opacity: "1",
        transition: theme.transitions.create("opacity", {
          duration: theme.transitions.duration.enteringScreen,
          easing: theme.transitions.easing.sharp,
        }),
      },
      exit: {
        opacity: "1",
        transition: theme.transitions.create("opacity", {
          duration: theme.transitions.duration.leavingScreen,
          easing: theme.transitions.easing.sharp,
        }),
      },
      "exit-active": {
        opacity: "0",
        transition: theme.transitions.create("opacity", {
          duration: theme.transitions.duration.leavingScreen,
          easing: theme.transitions.easing.sharp,
        }),
      },
    }),
  { name: "PageTransition" },
);

const Main = styled("main", {
  shouldForwardProp: (prop) =>
    !["open", "isAuthenticated", "isPlayer"].includes(prop as string),
})<{
  open?: boolean;
  isAuthenticated?: boolean;
  isPlayer?: boolean;
}>(({ theme, open, isAuthenticated, isPlayer }) => ({
  flexGrow: 1,
  width: "100%",
  height: "100%",
  padding: !isAuthenticated || isPlayer ? undefined : theme.spacing(2),
  transition: !isAuthenticated
    ? undefined
    : theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
  marginLeft: isAuthenticated ? `-${drawerWidth}px` : "",
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

export const AppContainer = observer(() => {
  useStyles();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { authStore } = useStores();
  const location = useLocation();

  // Scroll to top if path changes
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (!authStore.isReady) {
    return null;
  }

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const { isAuthenticated } = authStore;
  return (
    <>
      {isAuthenticated && (
        <>
          <AppBar open={drawerOpen} onDrawerOpen={handleDrawerOpen} />
          <Drawer
            drawerWidth={drawerWidth}
            open={drawerOpen}
            onDrawerClose={handleDrawerClose}
          />
        </>
      )}
      <Main open={drawerOpen} isAuthenticated={isAuthenticated}>
        <Toolbar />
        <CSSTransition
          // key={location.key}
          classNames="PageTransition"
          timeout={300}
        >
          <Switch>
            <ProtectedRoute
              path="/"
              exact
              render={(props) => <Home key={props.location.key} {...props} />}
            />
            <ProtectedRoute path="/library">
              <LibraryRoutes />
            </ProtectedRoute>
            <ProtectedRoute
              path="/play/:fileId"
              exact
              render={(props) => <Player key={props.location.key} {...props} />}
            />
            <ProtectedRoute path="/title">
              <TitleRoutes />
            </ProtectedRoute>
            <ProtectedRoute
              path="/title/:titleId"
              exact
              render={(props) => <Title key={props.location.key} {...props} />}
            />
            <ProtectedRoute
              path="/profile"
              exact
              render={(props) => (
                <Profile key={props.location.key} {...props} />
              )}
            />
            <ProtectedRoute
              path="/settings"
              exact
              render={(props) => (
                <Settings key={props.location.key} {...props} />
              )}
            />
            <Route path="/sign-in" exact>
              <SignIn />
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </CSSTransition>
        <Footer />
      </Main>
      <TopLoadingBar />
      <BackgroundPortal />
    </>
  );
});

function LibraryRoutes() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={path}>
        <h3>Please select a library</h3>
      </Route>
      <Route
        path={`${path}/:libraryId`}
        exact
        render={(props) => {
          const libraryId = props.match.params.libraryId;
          return <Library key={libraryId} {...props} />;
        }}
      />
    </Switch>
  );
}

function TitleRoutes() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route
        path={`${path}/:titleId`}
        exact
        render={(props) => <Title key={props.location.key} {...props} />}
      />
      <Route
        path={`${path}/:titleId/credits`}
        exact
        render={(props) => <Credits key={props.location.key} {...props} />}
      />
    </Switch>
  );
}
