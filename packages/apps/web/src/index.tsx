import { ApolloProvider } from "@apollo/client";
import CssBaseline from "@material-ui/core/CssBaseline";
import { StyledEngineProvider, ThemeProvider } from "@material-ui/core/styles";
import { StrictMode } from "react";
import { render } from "react-dom";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import { createApolloClient } from "./client";
import { AppContainer } from "./containers/AppContainer";
import { i18n } from "./i18n";
import { StoreProvider } from "./stores";
import { theme } from "./theme";

async function bootstrap() {
  const client = await createApolloClient();
  render(
    <StrictMode>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <I18nextProvider i18n={i18n}>
            <CssBaseline />
            <BrowserRouter>
              <ApolloProvider client={client}>
                <StoreProvider>
                  <AppContainer />
                </StoreProvider>
              </ApolloProvider>
            </BrowserRouter>
          </I18nextProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </StrictMode>,
    document.getElementById("root"),
  );
}

bootstrap();
