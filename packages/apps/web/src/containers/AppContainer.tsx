import { Theme, Toolbar } from "@mui/material";
import { experimentalStyled as styled } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";
import { observer } from "mobx-react-lite";
import { useLayoutEffect, useState } from "react";
import { Route, Routes, useLocation, useParams } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { AppBar } from "~/components/AppBar";
import { BackgroundPortal } from "~/components/BackgroundPortal";
import { Drawer } from "~/components/Drawer";
import { TopLoadingBar } from "~/components/TopLoadingBar";
import { Home } from "~/pages/Home";
import { Library } from "~/pages/Library";
import { NotFound } from "~/pages/NotFound";
import { Person } from "~/pages/Person";
import { Player } from "~/pages/Player";
import { Settings } from "~/pages/Settings";
import { SignIn } from "~/pages/SignIn";
import { Title } from "~/pages/Title";
import { useStores } from "~/stores";
import { Credits } from "../pages/Credits";
import { Profile } from "../pages/Profile";
import { Footer } from "./Footer";
import { ProtectedRoute } from "./ProtectedRoute";

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
}>(({ theme, open, isAuthenticated }) => ({
  flexGrow: 1,
  width: "100%",
  height: "100%",
  padding: 0,
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

  const handleDrawerOpen = (): void => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = (): void => {
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
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/library/:libraryId"
              element={
                <ProtectedRoute>
                  <LibraryRoutes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/play/:fileId"
              element={
                <ProtectedRoute>
                  <Player />
                </ProtectedRoute>
              }
            />
            <Route
              path="/title/:titleId"
              element={
                <ProtectedRoute>
                  <TitleRoutes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/person/:personId"
              element={
                <ProtectedRoute>
                  <Person />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </CSSTransition>
        <Footer />
      </Main>
      <TopLoadingBar />
      <BackgroundPortal />
    </>
  );
});

function LibraryRoutes(): JSX.Element {
  const { libraryId } = useParams();
  return (
    <Routes>
      <Route path={"/"} element={<Library key={libraryId} />} />
    </Routes>
  );
}

function TitleRoutes(): JSX.Element {
  const location = useLocation();
  return (
    <Routes>
      <Route path={"/"} element={<Title key={location.key} />} />
      <Route path={"/credits"} element={<Credits key={location.key} />} />
    </Routes>
  );
}
