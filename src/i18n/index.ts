import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from './locales/en.json';
import mrTranslations from './locales/mr.json';
import hiTranslations from './locales/hi.json';
import mlTranslations from './locales/ml.json';

const resources = {
  en: { translation: enTranslations },
  mr: { translation: mrTranslations },
  hi: { translation: hiTranslations },
  ml: { translation: mlTranslations }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('ayucarez_patient_language') || 'en', 
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
