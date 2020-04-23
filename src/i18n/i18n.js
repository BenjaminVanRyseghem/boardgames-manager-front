/** @module i18n */
// eslint-disable-next-line filenames/match-exported
import Backend from "i18next-http-backend";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resources from "./locales/fr/index.json";

const defaultLanguage = "fr";

/**
 * I18next instance
 */
let i18n = i18next;

/**
 * I18next [config](https://www.i18next.com/overview/configuration-options)
 */
let config = {
	fallbackLng: defaultLanguage,
	debug: false,
	ns: "index",
	defaultNS: "index",
	partialBundledLanguages: true,
	preload: [defaultLanguage],
	interpolation: {
		escapeValue: false,
		prefix: "%",
		suffix: "%"
	},
	backend: {
		loadPath: (lng, ns) => `/locales/${lng}/${ns}.json`
	}
};

// eslint-disable-next-line no-process-env
if (process.env.NODE_ENV !== "production") {
	config.debug = true;
}

let i18nPromise = i18n
	.use(Backend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init(config);

export { i18nPromise };

i18n.addResourceBundle(defaultLanguage, "index", resources, true, true);

export default i18n;
