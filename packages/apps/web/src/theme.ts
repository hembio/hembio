import { red } from "@material-ui/core/colors";
import { createTheme } from "@material-ui/core/styles";
import { isElectron } from "./utils/isElectron";
import CocosignumCorsivoItalicoBoldWoff from "$/font.woff";
import CocosignumCorsivoItalicoBoldWoff2 from "$/font.woff2";

const cocosignum = {
  fontFamily: "CocosignumCorsivoItalico-Bold",
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: 400,
  src: `
    local('CocosignumCorsivoItalico-Bold'),
    url(${CocosignumCorsivoItalicoBoldWoff2}) format('woff2'),
    url(${CocosignumCorsivoItalicoBoldWoff}) format('woff')
  `,
};

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "rgba(51, 62, 78, 0.9)",
    },
    secondary: {
      main: "#A0B9BE",
    },
    error: {
      main: red.A400,
    },
    background: {
      paper: "rgba(28, 31, 49, .95)",
      default: "#1C1F2C",
    },
    text: {
      primary: "rgba(255, 255, 255, 0.87)",
      secondary: "rgba(255, 255, 255, 0.54)",
      disabled: "rgba(255, 255, 255, 0.38)",
      // hint: "rgba(255, 255, 255, 0.38)",
    },
  },
  components: {
    MuiContainer: {
      defaultProps: {
        maxWidth: isElectron() ? false : "xl",
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& label.Mui-focused": {
            color: "#57adbd",
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          "& label.Mui-focused": {
            color: "#57adbd",
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          "& label.Mui-focused": {
            color: "#57adbd",
          },
          "&.MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
              borderColor: "#57adbd",
            },
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          "&.Mui-checked": {
            color: "#57adbd",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(43, 47, 66, .9)",
          fontFamily: "Open Sans",
          "&:hover": {
            backgroundColor: "rgba(53, 59, 89, 0.9)",
          },
        },
        textPrimary: {
          color: "rgba(255, 255, 255, 0.87)",
        },
        containedSecondary: {
          "&:hover": {
            backgroundColor: "rgb(180, 205, 210)",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backdropFilter: "blur(4px)",
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: "none",
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: "Open Sans",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        "@font-face": [cocosignum],
        "html, body": {
          color: "white",
          padding: 0,
          margin: 0,
          height: "100vh",
          fontFamily: "Open Sans",
          overflow: "hidden",
          userSelect: "none",
        },
        "a, a:link, a:visited": {
          color: "white",
          textDecoration: "none",
        },
        html: {
          "*": {
            scrollbarWidth: "thin",
          },
          "*::-webkit-scrollbar": {
            background: "rgba(28, 31, 49, .5)",
            width: "8px",
            height: "8px",
          },
          "*::-webkit-scrollbar-track": {
            // #3d3b4d
            top: "46px",
            background: "transparent", // color of the tracking area
          },
          "*::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(255, 255, 255, 0.54)",
            borderRadius: "0px" /* roundness of the scroll thumb */,
            // border: "6px solid white rgba(255, 255, 255, 0.54)" /* creates padding around scroll thumb */,
          },
          "*::-webkit-scrollbar-button": {
            background: "transparent",
            height: "0px",
            width: "0px",
          },
          "*::-webkit-scrollbar-corner": {
            background: "transparent",
            height: "0px",
            width: "0px",
          },
          "*::-webkit-scrollbar-track-piece:start": {
            background: "transparent",
          },
          "*::-webkit-scrollbar-track-piece:end": {
            background: "transparent",
          },
        },
        "#root": {
          position: "relative",
          height: "100vh",
          zIndex: 1,
          overflow: "auto",
          "&::-webkit-scrollbar-track-piece:start": {
            marginTop: "64px",
          },
        },
        ".electron-drag": {
          userSelect: "none",
          WebkitAppRegion: "drag",
        },
        ".electron-no-drag": {
          userSelect: "inherit",
          WebkitAppRegion: "no-drag",
        },
      },
    },
  },
});
