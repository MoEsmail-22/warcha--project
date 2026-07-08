import { useTranslation } from 'react-i18next';

/**
 * Wraps react-i18next's useTranslation with sensible defaults.
 * Loads a specific namespace (e.g. 'common', 'dashboard', 'bookings')
 * and falls back to 'common' for any missing keys.
 *
 * Usage:
 *   const { t } = useAppTranslation('dashboard');
 *   <h1>{t('title')}</h1>
 */
export function useAppTranslation(namespace = 'common') {
  const { t, i18n, ready } = useTranslation(namespace, {
    fallbackLng: 'en',
    defaultNS: 'common',
  });

  return { t, i18n, ready };
}

export default useAppTranslation;
