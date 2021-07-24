import MuiAppBar, {
  AppBarProps as MuiAppBarProps,
} from "@material-ui/core/AppBar";
import Badge from "@material-ui/core/Badge";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import { experimentalStyled as styled } from "@material-ui/core/styles";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
import MenuIcon from "@material-ui/icons/Menu";
import MoreIcon from "@material-ui/icons/More";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { createStyles, makeStyles } from "@material-ui/styles";
import { useEffect, useState } from "react";
import { isElectron } from "../utils/isElectron";
import { Logo } from "./Logo";
import { ProfileMenu } from "./ProfileMenu";
import { SearchInput } from "./SearchInput";

const drawerWidth = 240;

const useStyles = makeStyles(
  createStyles({
    root: {
      marginRight: isElectron() ? "140px" : undefined,
      "-webkit-app-region": "drag",
      "& *": {
        "-webkit-app-region": "no-drag",
      },
    },
  }),
);

interface Props {
  open: boolean;
  onDrawerOpen(): void;
}

interface MuiAppBarPropsWithOpen extends MuiAppBarProps {
  open?: boolean;
  show?: boolean;
}

const MuiAppBarWithOpen = styled(MuiAppBar, {
  shouldForwardProp: (prop) => !["open", "show"].includes(prop as string),
})<MuiAppBarPropsWithOpen>(({ theme, open, show }) => ({
  transition: theme.transitions.create(["margin", "width", "transform"], {
    easing: theme.transitions.easing.easeIn,
    duration: theme.transitions.duration.leavingScreen,
  }),
  transform: "translate(0, -46px)",
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width", "transform"], {
      easing: theme.transitions.easing.easeIn,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  ...(show && {
    transform: "translate(0, 0)",
  }),
}));

export function AppBar({ open, onDrawerOpen }: Props): JSX.Element {
  const classes = useStyles();
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  const handleProfileMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    console.log("handleProfileMenuOpen", e.currentTarget);
    setMenuAnchorEl(e.currentTarget);
  };

  // const handleMobileMenuClose = () => {
  //   setMobileMoreAnchorEl(null);
  // };

  // const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
  //   setMobileMoreAnchorEl(event.currentTarget);
  // };

  return (
    <>
      <MuiAppBarWithOpen position="fixed" open={open} show={show}>
        <Container>
          <Toolbar className={classes.root}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={onDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>
            <Logo />
            <SearchInput />
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <IconButton aria-label="show 4 new mails" color="inherit">
                <Badge badgeContent={4} color="secondary">
                  <MailIcon />
                </Badge>
              </IconButton>
              <IconButton
                aria-label="show 17 new notifications"
                color="inherit"
              >
                <Badge badgeContent={17} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={"menu-id"}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                aria-label="show more"
                aria-controls={"mobile-menu-id"}
                aria-haspopup="true"
                onClick={(e) => setMenuAnchorEl(e.currentTarget)}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </MuiAppBarWithOpen>
      <ProfileMenu anchorEl={menuAnchorEl} />
    </>
  );
}
