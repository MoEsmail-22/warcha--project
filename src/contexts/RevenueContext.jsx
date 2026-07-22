/**
 * RevenueContext keeps the raw daily revenue records available to consumers.
 * Aggregation is exported separately so the Revenue page can recalculate every
 * card and chart whenever the user changes a preset or custom date range.
 */
import { createContext, useContext, useEffect, useReducer } from 'react';
import mockRevenue from '@/mocks/revenue.json';

const RevenueContext = createContext(null);
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const initialState = { records: [], loading: true, error: null };

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_SUCCESS':
      return { records: action.payload, loading: false, error: null };
    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

const toISODate = (date) => date.toISOString().slice(0, 10);

/**
 * The supplied JSON only has 15 days. Build a deterministic 180-day demo
 * history so the 90-day preset and prior-period comparisons contain data.
 * Existing JSON rows always win, making this easy to replace with API data.
 */
function buildDemoHistory(seedRecords, totalDays = 180) {
  const byDate = new Map(seedRecords.map((record) => [record.date, record]));
  const lastDate = new Date(`${seedRecords.at(-1).date}T00:00:00`);

  for (let offset = 0; offset < totalDays; offset += 1) {
    const date = new Date(lastDate);
    date.setDate(lastDate.getDate() - offset);
    const key = toISODate(date);
    if (byDate.has(key)) continue;

    // Repeatable variation makes the mock chart realistic without random data.
    const bookings = 4 + ((offset * 7 + date.getDay() * 3) % 10);
    const income = bookings * (680 + ((offset * 137) % 520));
    const expenses = Math.round(income * (0.31 + (offset % 8) / 100));
    byDate.set(key, {
      date: key,
      bookings,
      completedJobs: Math.max(1, bookings - (offset % 3)),
      income,
      expenses,
      profit: income - expenses,
    });
  }

  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

const percentChange = (current, previous) =>
  previous > 0 ? Math.round(((current - previous) / previous) * 1000) / 10 : 0;

/** Aggregate one selected range and an equally-sized preceding range. */
export function aggregateRevenue(selectedRecords, previousRecords = [], options = {}) {
  if (!selectedRecords.length) return null;

  const total = (records, key) => records.reduce((sum, record) => sum + record[key], 0);
  const currentIncome = total(selectedRecords, 'income');
  const previousIncome = total(previousRecords, 'income');
  const currentBookings = total(selectedRecords, 'bookings');
  const previousBookings = total(previousRecords, 'bookings');
  const currentProfit = total(selectedRecords, 'profit');
  const latest = selectedRecords.at(-1);
  const priorDay = selectedRecords.at(-2) || previousRecords.at(-1);
  const currentAverage = currentBookings ? currentIncome / currentBookings : 0;
  const previousAverage = previousBookings ? previousIncome / previousBookings : 0;

  const highest = selectedRecords.reduce(
    (best, record) => (record.income > best.income ? record : best),
    selectedRecords[0]
  );

  // Chart granularity follows report length: daily (up to 31 days), weekly
  // (32–89 days), and monthly (the 90-day report). Matching prior-period
  // buckets are kept at the same position for a fair comparison.
  const chartData =
    options.granularity === 'monthly'
      ? buildMonthlyChart(selectedRecords, previousRecords)
      : options.granularity === 'weekly'
        ? buildWeeklyChart(selectedRecords, previousRecords)
        : selectedRecords.map((record, index) => ({
            day:
              selectedRecords.length <= 14
                ? DAY_NAMES[new Date(`${record.date}T00:00:00`).getDay()]
                : record.date.slice(5),
            current: record.income,
            previous: previousRecords[index]?.income || 0,
          }));

  return {
    summary: {
      today: latest.income,
      month: currentIncome,
      avgOrderValue: Math.round(currentAverage),
      outstanding: Math.round(currentIncome * 0.08),
      outstandingInvoices: Math.max(1, Math.round(currentBookings * 0.08)),
      profitMargin: currentIncome ? Math.round((currentProfit / currentIncome) * 100) : 0,
    },
    comparison: {
      todayChange: percentChange(latest.income, priorDay?.income || 0),
      monthChange: percentChange(currentIncome, previousIncome),
      avgOrderChange: percentChange(currentAverage, previousAverage),
    },
    weeklyChart: chartData,
    quickSummary: {
      highestRevenueDay: {
        day: new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(
          new Date(`${highest.date}T00:00:00`)
        ),
        amount: highest.income,
      },
      avgDailyRevenue: Math.round(currentIncome / selectedRecords.length),
      profitMargin: currentIncome ? Math.round((currentProfit / currentIncome) * 100) : 0,
      topSellingService: {
        name: 'Oil change',
        revenue: Math.round(currentIncome * 0.28),
        count: Math.round(currentBookings * 0.32),
      },
    },
    // Demo breakdowns update with the selected total. Replace this helper with
    // service/payment fields from the API once transaction-level data exists.
    breakdowns: buildRevenueBreakdowns(currentIncome),
  };
}

function buildRevenueBreakdowns(totalIncome) {
  const amountFor = (share) => Math.round(totalIncome * share);
  return {
    serviceRevenue: [
      { name: 'Mechanical Repair', revenue: amountFor(0.44) },
      { name: 'Oil & Filter', revenue: amountFor(0.29) },
      { name: 'Brake Service', revenue: amountFor(0.16) },
      { name: 'Diagnostics', revenue: amountFor(0.11) },
    ],
    paymentMethods: [
      { name: 'Cash', value: amountFor(0.7), color: '#004B46' },
      { name: 'Card', value: amountFor(0.2), color: '#1158D8' },
      { name: 'Installments', value: amountFor(0.1), color: '#FFD5A6' },
    ],
  };
}

function buildMonthlyChart(selectedRecords, previousRecords) {
  const groupByMonth = (records) =>
    records.reduce((groups, record) => {
      const monthKey = record.date.slice(0, 7);
      const group = groups.at(-1);
      if (group?.key === monthKey) {
        group.income += record.income;
      } else {
        groups.push({
          key: monthKey,
          label: new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(
            new Date(`${monthKey}-01T00:00:00`)
          ),
          income: record.income,
        });
      }
      return groups;
    }, []);

  const currentMonths = groupByMonth(selectedRecords);
  const previousMonths = groupByMonth(previousRecords);
  return currentMonths.map((month, index) => ({
    day: month.label,
    current: month.income,
    previous: previousMonths[index]?.income || 0,
  }));
}

function buildWeeklyChart(selectedRecords, previousRecords) {
  // Split from the selected start date into seven-day blocks. This avoids
  // partial calendar weeks and makes current/previous blocks line up exactly.
  const groupIntoWeeks = (records) => {
    const weeks = [];
    for (let index = 0; index < records.length; index += 7) {
      const week = records.slice(index, index + 7);
      weeks.push({
        label:
          week.length === 1
            ? week[0].date.slice(5)
            : `${week[0].date.slice(5)}–${week.at(-1).date.slice(5)}`,
        income: week.reduce((sum, record) => sum + record.income, 0),
      });
    }
    return weeks;
  };

  const currentWeeks = groupIntoWeeks(selectedRecords);
  const previousWeeks = groupIntoWeeks(previousRecords);
  return currentWeeks.map((week, index) => ({
    day: week.label,
    current: week.income,
    previous: previousWeeks[index]?.income || 0,
  }));
}

export function RevenueProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        dispatch({ type: 'LOAD_SUCCESS', payload: buildDemoHistory(mockRevenue) });
      } catch (err) {
        dispatch({ type: 'LOAD_ERROR', payload: err.message });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const records = state.records;
  const data = records.length
    ? aggregateRevenue(records.slice(-30), records.slice(-60, -30))
    : null;
  // Dashboard analytics are deliberately fixed to the newest seven days.
  // Keeping this separate prevents Revenue-page report filters (7/30/90/custom)
  // from changing the Dashboard's "Revenue this week" chart or KPI values.
  const dashboardData = records.length
    ? aggregateRevenue(records.slice(-7), records.slice(-14, -7))
    : null;
  const value = {
    ...state,
    data,
    dashboardData,
    records,
    minDate: records[0]?.date || '',
    maxDate: records.at(-1)?.date || '',
  };

  return <RevenueContext.Provider value={value}>{children}</RevenueContext.Provider>;
}

export function useRevenue() {
  const context = useContext(RevenueContext);
  if (!context) throw new Error('useRevenue must be used inside a <RevenueProvider>');
  return context;
}
