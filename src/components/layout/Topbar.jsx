import { Menu, Bell } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppTranslation } from '../../hooks/useAppTranslation';

export default function Topbar({ onMenuClick, user }) {
  const { toggleLanguage, lang } = useLanguage();
  const { t } = useAppTranslation('common');

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6">
      {/* Left: hamburger (mobile only) + page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-md p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">
          {t('topbar.title', { defaultValue: 'Dashboard' })}
        </h1>
      </div>

      {/* Right: lang toggle + notifications + user */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleLanguage}
          className="rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {lang === 'en' ? 'العربية' : 'English'}
        </button>

        <button
          className="relative rounded-md p-2 text-gray-600 hover:bg-gray-100"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {user && (
          <div className="ms-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0F4C5C] text-sm font-semibold text-white">
              {user.name?.charAt(0).toUpperCase() ?? 'U'}
            </div>
            <span className="hidden text-sm font-medium text-gray-700 sm:inline">{user.name}</span>
          </div>
        )}
      </div>
    </header>
  );
}
