import { createContext, useContext, useState } from 'react';

const RevenueContext = createContext(null);

const mockWeeklyRevenue = [
  { day: 'Sat', revenue: 8200 },
  { day: 'Sun', revenue: 9500 },
  { day: 'Mon', revenue: 7800 },
  { day: 'Tue', revenue: 11200 },
  { day: 'Wed', revenue: 10400 },
  { day: 'Thu', revenue: 13800 },
  { day: 'Fri', revenue: 12450 },
];

export function RevenueProvider({ children }) {
  const [weeklyRevenue] = useState(mockWeeklyRevenue);

  const todayRevenue = 12450;
  const yesterdayRevenue = 10551; // +18% → 12450 / 1.18 ≈ 10551
  const revenueChange = Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100);

  const value = {
    weeklyRevenue,
    todayRevenue,
    yesterdayRevenue,
    revenueChange,
    currency: 'EGP',
  };

  return <RevenueContext.Provider value={value}>{children}</RevenueContext.Provider>;
}

export function useRevenue() {
  const ctx = useContext(RevenueContext);
  if (!ctx) throw new Error('useRevenue must be used inside a <RevenueProvider>');
  return ctx;
}
