import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

const LanguageContext = createContext(null);

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside a <LanguageProvider>');
  return ctx;
}

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract language from the URL (/en/dev → 'en', /ar/dev → 'ar')
  const urlLang = location.pathname.split('/')[1];
  const initialLang = urlLang === 'ar' ? 'ar' : 'en';
  const [lang, setLang] = useState(initialLang);

  // Sync i18next + <html> tag whenever the URL language changes
  useEffect(() => {
    if (urlLang === 'en' || urlLang === 'ar') {
      i18n.changeLanguage(urlLang);
      setLang(urlLang);
      document.documentElement.lang = urlLang;
      document.documentElement.dir = urlLang === 'ar' ? 'rtl' : 'ltr';
    }
  }, [urlLang, i18n]);

  // Change language: updates URL → the useEffect above handles the rest
  const changeLanguage = useCallback(
    (newLang) => {
      const currentPath = location.pathname;
      // Replace the /en/ or /ar/ segment in the current URL with the new language
      const newPath = currentPath.replace(/^\/(en|ar)/, `/${newLang}`);
      navigate(newPath);
    },
    [navigate, location.pathname]
  );

  // Convenience helper: flips between 'ar' and 'en'
  const toggleLanguage = useCallback(() => {
    changeLanguage(lang === 'ar' ? 'en' : 'ar');
  }, [lang, changeLanguage]);

  const value = { lang, changeLanguage, toggleLanguage };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
