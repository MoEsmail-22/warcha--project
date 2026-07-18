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
import { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import mockRevenue from '@/mocks/revenue.json';

const RevenueContext = createContext(null);

const initialState = {
  data: null,
  rawRecords: null,
  loading: true,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_SUCCESS':
      return {
        data: action.payload.data,
        rawRecords: action.payload.rawRecords,
        loading: false,
        error: null,
      };
    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

// ===== Transformation helpers =====

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const RANGE_DAYS = {
  last7: 7,
  last30: 30,
  last90: 90,
};

// Convert YYYY-MM-DD strings into local Date objects so month math does not shift across time zones.
const toDate = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

// Convert Date objects back into YYYY-MM-DD strings for stable comparisons with mock data keys.
const toDateKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;

// Move a date by whole days while keeping the original date object untouched.
const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
const endOfMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);

function getRangeBounds(range, latestDate) {
  // "This month" ends at the latest available mock record, which acts as today in this dataset.
  if (range === 'thisMonth') {
    return {
      start: startOfMonth(latestDate),
      end: latestDate,
    };
  }

  // "Last month" uses full calendar-month boundaries before the latest available date.
  if (range === 'lastMonth') {
    const lastMonthDate = new Date(latestDate.getFullYear(), latestDate.getMonth() - 1, 1);
    return {
      start: startOfMonth(lastMonthDate),
      end: endOfMonth(lastMonthDate),
    };
  }

  const days = RANGE_DAYS[range] || RANGE_DAYS.last30;
  return {
    start: addDays(latestDate, -(days - 1)),
    end: latestDate,
  };
}

function filterRecordsByBounds(records, bounds) {
  // Dates are stored as YYYY-MM-DD, so string comparison is safe after formatting the bounds.
  const startKey = toDateKey(bounds.start);
  const endKey = toDateKey(bounds.end);
  return records.filter((record) => record.date >= startKey && record.date <= endKey);
}

function getPreviousRangeRecords(records, bounds) {
  // Match the comparison period length exactly, then place it immediately before the selected range.
  const daysInRange =
    Math.round((bounds.end.getTime() - bounds.start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const previousEnd = addDays(bounds.start, -1);
  const previousStart = addDays(previousEnd, -(daysInRange - 1));

  return filterRecordsByBounds(records, {
    start: previousStart,
    end: previousEnd,
  });
}

function sum(records, key) {
  // Keep all total calculations in one tiny helper so the summary math reads clearly below.
  return records.reduce((total, record) => total + record[key], 0);
}

function percentChange(current, previous) {
  // Avoid dividing by zero when there is no matching previous-period data in the mock file.
  return previous > 0 ? Math.round(((current - previous) / previous) * 1000) / 10 : 0;
}

/**
 * Transform the raw daily array into the structured object the page expects.
 * This is where the "backend aggregation" happens on the frontend.
 */
export function transformRevenue(dailyRecords, range = 'last30') {
  if (!dailyRecords || !dailyRecords.length) return null;

  // Sort by date ascending (oldest first)
  const sorted = [...dailyRecords].sort((a, b) => a.date.localeCompare(b.date));
  const latestDate = toDate(sorted[sorted.length - 1].date);
  const bounds = getRangeBounds(range, latestDate);
  // Build the selected range first; if a range has no records, fall back to all mock data.
  const selected = filterRecordsByBounds(sorted, bounds);
  const currentRecords = selected.length ? selected : sorted;
  const previousRecords = getPreviousRangeRecords(sorted, bounds);
  const today = currentRecords[currentRecords.length - 1];
  const yesterday = sorted[sorted.findIndex((record) => record.date === today.date) - 1];

  // ===== Summary =====
  const totalIncome = sum(currentRecords, 'income');
  const totalBookings = sum(currentRecords, 'bookings');
  const totalProfit = sum(currentRecords, 'profit');
  const previousIncome = sum(previousRecords, 'income');
  const previousBookings = sum(previousRecords, 'bookings');

  // Avg order value across the selected period
  const avgOrderValue = totalBookings > 0 ? Math.round(totalIncome / totalBookings) : 0;
  const previousAvgOrderValue =
    previousBookings > 0 ? Math.round(previousIncome / previousBookings) : 0;

  // Outstanding — not in the raw data, use a reasonable placeholder
  // (in a real backend this would come from an invoices table)
  const outstanding = 14000;
  const outstandingInvoices = 14;

  // Profit margin %
  const profitMargin = totalIncome > 0 ? Math.round((totalProfit / totalIncome) * 100) : 0;

  // ===== Comparison (percentage changes) =====
  const todayChange = yesterday ? percentChange(today.income, yesterday.income) : 0;
  const monthChange = percentChange(totalIncome, previousIncome);
  const avgOrderChange = percentChange(avgOrderValue, previousAvgOrderValue);

  // ===== Period chart with current vs previous matching period =====
  const weeklyChart = currentRecords.map((record, i) => {
    const date = new Date(record.date);
    const prevRecord = previousRecords[i];
    return {
      day:
        currentRecords.length > 14
          ? `${date.getMonth() + 1}/${date.getDate()}`
          : DAY_NAMES[date.getDay()],
      current: record.income,
      previous: prevRecord ? prevRecord.income : 0,
    };
  });

  // ===== Quick Summary =====
  // Highest revenue day
  const highestRecord = currentRecords.reduce(
    (max, r) => (r.income > max.income ? r : max),
    currentRecords[0]
  );
  const highestDate = new Date(highestRecord.date);
  const highestRevenueDay = {
    day: DAY_NAMES[highestDate.getDay()],
    amount: highestRecord.income,
  };

  // Avg daily revenue
  const avgDailyRevenue = Math.round(totalIncome / currentRecords.length);

  // Top selling service — not in revenue.json, use a placeholder
  // (would come from services or bookings aggregation in a real backend)
  const topSellingService = {
    name: 'Oil change',
    revenue: 45000,
    count: 128,
  };

  return {
    range,
    rangeLabel: {
      start: toDateKey(bounds.start),
      end: toDateKey(bounds.end),
    },
    records: currentRecords,
    previousRecords,
    summary: {
      today: today.income,
      month: totalIncome,
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
        // The dashboard consumes the default context data for its "Revenue this week" chart.
        // Keep that default as the last 7 days; RevenuePage asks for its own selected range.
        const transformed = transformRevenue(mockRevenue, 'last7');
        dispatch({ type: 'LOAD_SUCCESS', payload: { data: transformed, rawRecords: mockRevenue } });
      } catch (err) {
        dispatch({ type: 'LOAD_ERROR', payload: err.message });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      getRevenueByRange: (range) => transformRevenue(state.rawRecords, range),
    }),
    [state]
  );

  return <RevenueContext.Provider value={value}>{children}</RevenueContext.Provider>;
}

export function useRevenue() {
  const ctx = useContext(RevenueContext);
  if (!ctx) throw new Error('useRevenue must be used inside a <RevenueProvider>');
  return ctx;
}
