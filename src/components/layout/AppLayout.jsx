import { Outlet } from 'react-router-dom';
import { LanguageProvider } from '../../contexts/LanguageContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AppLayout() {
  return (
    <LanguageProvider>
      <div className="grid h-screen grid-cols-[16rem_1fr] grid-rows-[auto_1fr]">
        <aside className="row-span-2 border-e border-gray-200 bg-white">
          <Sidebar />
        </aside>
        <header className="border-b border-gray-200 bg-white">
          <Topbar />
        </header>
        <main className="overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </LanguageProvider>
  );
}
