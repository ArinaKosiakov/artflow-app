import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translation files
import itTranslations from "./locales/it.json";
import enTranslations from "./locales/en.json";

const resources = {
  it: {
    translation: itTranslations,
  },
  en: {
    translation: enTranslations,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // default language
  fallbackLng: "en",

  interpolation: {
    escapeValue: false, // React already does escaping
  },

  // Namespace configuration
  defaultNS: "translation",
  ns: ["translation"],
});

export default i18n;
