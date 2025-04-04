import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'ar', // Set Arabic as the default language
    supportedLngs: ['en', 'ar'], // Supported languages
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    backend: {
      loadPath: '/locales/{{lng}}.json', // Correct path for Vercel
      debug: false, // Enable backend debugging
    },
    detection: {
      order: ['localStorage', 'cookie', 'navigator', 'htmlTag'], // Detect language from these sources
      caches: ['localStorage', 'cookie'], // Cache the language
    },
    debug: true, // Enable debugging
  })
  .then(() => {
    console.log('i18n initialized successfully.'); // Log when i18n is initialized
    console.log(`Current language: ${i18n.language}`); // Log the current language
  });

// Listen for the `loaded` event to confirm the file was loaded
i18n.on('loaded', (loaded) => {
  console.log('Translation files loaded:', loaded); // Log loaded namespaces
});

// Listen for the `failedLoading` event to debug missing files
i18n.on('failedLoading', (lng, ns, msg) => {
  console.error(`Failed to load ${lng}.json for namespace "${ns}": ${msg}`);
});

// Force the language to Arabic
i18n.changeLanguage('ar'); // This will set the language to Arabic

export default i18n;