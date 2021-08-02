import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import ChainedBackend from "i18next-chained-backend";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";

i18n
  .use(ChainedBackend)
  .use(LanguageDetector)
  .use(initReactI18next) // bind react-i18next to the instance
  .init({
    fallbackLng: "en-US",
    fallbackNS: "main",
    defaultNS: "main",
    debug: true,
    interpolation: {
      escapeValue: false, // not needed for react
    },
    react: {
      useSuspense: false,
    },
    backend: {
      backends: [
        resourcesToBackend((language, namespace, callback) => {
          import(`./locales/${language}/${namespace}.json`)
            .then(({ default: resources }) => {
              callback(null, resources);
            })
            .catch((error) => {
              callback(error, null);
            });
        }),
      ],
      backendOptions: [
        {
          loadPath: "./locales/{{lng}}/{{ns}}.json",
        },
      ],
    },
  });

export { i18n };
