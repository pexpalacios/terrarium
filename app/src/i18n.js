import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from "i18next-browser-languagedetector";

import en from './text/en_prueba.json';
import es from './text/es_prueba.json';


i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
		en: {
			translation: en,
		},
		es: {
			translation: es,
		},
	},
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
	detection: {
		order: ["localStorage", "navigator"],
		caches: ["localStorage"],
	}
  });

export default i18next;