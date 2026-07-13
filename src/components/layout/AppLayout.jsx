import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { LanguageProvider } from '../../contexts/LanguageContext';
import { BookingsProvider } from '../../contexts/BookingsContext';
import { VehiclesProvider } from '../../contexts/VehiclesContext';
import { ReviewsProvider } from '../../contexts/ReviewsContext';
import { RevenueProvider } from '../../contexts/RevenueContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAuth } from '../../contexts/AuthContext';

export default function AppLayout() {
  return (
    <LanguageProvider>
      <BookingsProvider>
        <VehiclesProvider>
          <ReviewsProvider>
            <RevenueProvider>
              <AppLayoutInner />
            </RevenueProvider>
          </ReviewsProvider>
        </VehiclesProvider>
      </BookingsProvider>
    </LanguageProvider>
  );
}

function AppLayoutInner() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden bg-[#F0F8F7]">
      <Sidebar
        collapsed={collapsed}
        onCollapse={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={() => setMobileOpen(true)} user={user} />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export { AppLayoutInner };
