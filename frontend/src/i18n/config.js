import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationsIT from './locales/it.json';
import translationsEN from './locales/en.json';
import translationsFR from './locales/fr.json';
import translationsES from './locales/es.json';

const resources = {
  it: { translation: translationsIT },
  en: { translation: translationsEN },
  fr: { translation: translationsFR },
  es: { translation: translationsES }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'it',
    supportedLngs: ['it', 'en', 'fr', 'es'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;