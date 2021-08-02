// import the original type declarations
import "react-i18next";
// import all namespaces (for the default language, only)
import genreNs from "~/locales/en-US/genres.json";
import mainNs from "~/locales/en-US/main.json";

// react-i18next versions lower than 11.11.0
declare module "react-i18next" {
  // and extend them!
  interface Resources {
    main: typeof mainNs;
    genres: typeof genreNs;
  }
}

// react-i18next versions higher than 11.11.0
declare module "react-i18next" {
  // and extend them!
  interface CustomTypeOptions {
    // custom namespace type if you changed it
    defaultNS: "main";
    // custom resources type
    resources: {
      main: typeof mainNs;
      genres: typeof genreNs;
    };
  }
}
