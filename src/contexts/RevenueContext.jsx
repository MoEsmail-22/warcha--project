/**
 * RevenueContext — provides revenue analytics data.
 *
 * Transforms the raw daily records from revenue.json (array of
 * { date, bookings, completedJobs, income, expenses, profit }) into
 * the shape the RevenuePage expects:
 *   {
 *     summary: { today, month, avgOrderValue, outstanding, profitMargin },
 *     comparison: { todayChange, monthChange, avgOrderChange },
 *     weeklyChart: [{ day, current, previous }],
 *     quickSummary: { highestRevenueDay, avgDailyRevenue, profitMargin }
 *   }
 *
 * Used by: RevenuePage, DashboardPage.
 */
import { createContext, useContext, useReducer, useEffect } from 'react';
import mockRevenue from '@/mocks/revenue.json';

const RevenueContext = createContext(null);

const initialState = {
  data: null,
  loading: true,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_SUCCESS':
      return { data: action.payload, loading: false, error: null };
    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

// ===== Transformation helpers =====

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Transform the raw daily array into the structured object the page expects.
 * This is where the "backend aggregation" happens on the frontend.
 */
function transformRevenue(dailyRecords) {
  if (!dailyRecords || !dailyRecords.length) return null;

  // Sort by date ascending (oldest first)
  const sorted = [...dailyRecords].sort((a, b) => a.date.localeCompare(b.date));
  const today = sorted[sorted.length - 1];
  const yesterday = sorted[sorted.length - 2];

  // ===== Summary =====
  const totalIncome = sorted.reduce((sum, r) => sum + r.income, 0);
  const totalBookings = sorted.reduce((sum, r) => sum + r.bookings, 0);
  const totalProfit = sorted.reduce((sum, r) => sum + r.profit, 0);

  // Last 30 days for "monthly" (or all records if fewer than 30)
  const last30 = sorted.slice(-30);
  const monthIncome = last30.reduce((sum, r) => sum + r.income, 0);

  // Avg order value across all records
  const avgOrderValue = totalBookings > 0 ? Math.round(totalIncome / totalBookings) : 0;

  // Outstanding — not in the raw data, use a reasonable placeholder
  // (in a real backend this would come from an invoices table)
  const outstanding = 14000;
  const outstandingInvoices = 14;

  // Profit margin %
  const profitMargin = totalIncome > 0 ? Math.round((totalProfit / totalIncome) * 100) : 0;

  // ===== Comparison (percentage changes) =====
  const todayChange =
    yesterday && yesterday.income > 0
      ? Math.round(((today.income - yesterday.income) / yesterday.income) * 1000) / 10
      : 0;

  // Month change: compare last 30 days vs previous 30 days
  const previous30 = sorted.slice(-60, -30);
  const previousMonthIncome = previous30.reduce((sum, r) => sum + r.income, 0);
  const monthChange =
    previousMonthIncome > 0
      ? Math.round(((monthIncome - previousMonthIncome) / previousMonthIncome) * 1000) / 10
      : 0;

  // Avg order change: compare last 7 days avg vs previous 7 days avg
  const last7 = sorted.slice(-7);
  const previous7 = sorted.slice(-14, -7);
  const last7Avg =
    last7.reduce((s, r) => s + r.income, 0) / (last7.reduce((s, r) => s + r.bookings, 0) || 1);
  const prev7Avg =
    previous7.reduce((s, r) => s + r.income, 0) /
    (previous7.reduce((s, r) => s + r.bookings, 0) || 1);
  const avgOrderChange =
    prev7Avg > 0 ? Math.round(((last7Avg - prev7Avg) / prev7Avg) * 1000) / 10 : 0;

  // ===== Weekly chart (last 7 days with current vs previous week) =====
  const weeklyChart = last7.map((record, i) => {
    const date = new Date(record.date);
    const prevRecord = previous7[i];
    return {
      day: DAY_NAMES[date.getDay()],
      current: record.income,
      previous: prevRecord ? prevRecord.income : 0,
    };
  });

  // ===== Quick Summary =====
  // Highest revenue day
  const highestRecord = sorted.reduce((max, r) => (r.income > max.income ? r : max), sorted[0]);
  const highestDate = new Date(highestRecord.date);
  const highestRevenueDay = {
    day: DAY_NAMES[highestDate.getDay()],
    amount: highestRecord.income,
  };

  // Avg daily revenue
  const avgDailyRevenue = Math.round(totalIncome / sorted.length);

  // Top selling service — not in revenue.json, use a placeholder
  // (would come from services or bookings aggregation in a real backend)
  const topSellingService = {
    name: 'Oil change',
    revenue: 45000,
    count: 128,
  };

  return {
    summary: {
      today: today.income,
      month: monthIncome,
      avgOrderValue,
      outstanding,
      outstandingInvoices,
      profitMargin,
    },
    comparison: {
      todayChange,
      monthChange,
      avgOrderChange,
    },
    weeklyChart,
    quickSummary: {
      highestRevenueDay,
      avgDailyRevenue,
      profitMargin,
      topSellingService,
    },
  };
}

export function RevenueProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const transformed = transformRevenue(mockRevenue);
        dispatch({ type: 'LOAD_SUCCESS', payload: transformed });
      } catch (err) {
        dispatch({ type: 'LOAD_ERROR', payload: err.message });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const value = { ...state };

  return <RevenueContext.Provider value={value}>{children}</RevenueContext.Provider>;
}

export function useRevenue() {
  const ctx = useContext(RevenueContext);
  if (!ctx) throw new Error('useRevenue must be used inside a <RevenueProvider>');
  return ctx;
}
