import { ApolloProvider } from "@apollo/client";
import CssBaseline from "@mui/material/CssBaseline";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import { createApolloClient } from "./client";
import { AppContainer } from "./containers/AppContainer";
import { i18n } from "./i18n";
import { SnackbarProvider } from "./snackbar/snackbar.provider";
import { StoreProvider } from "./stores";
import { theme } from "./theme";

async function bootstrap(): Promise<void> {
  const client = await createApolloClient();
  const container = document.getElementById("root");
  if (!container) {
    throw new Error("No root element found");
  }
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <I18nextProvider i18n={i18n}>
            <CssBaseline />
            <SnackbarProvider>
              <BrowserRouter>
                <ApolloProvider client={client}>
                  <StoreProvider>
                    <AppContainer />
                  </StoreProvider>
                </ApolloProvider>
              </BrowserRouter>
            </SnackbarProvider>
          </I18nextProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </StrictMode>,
  );
}

bootstrap();
