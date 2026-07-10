/**
 * RevenueContext — provides revenue analytics data (read-only, no mutations).
 *
 * Used by: Dashboard page (today's revenue KPI + weekly chart), Revenue page.
 *
 * Exposes:
 *   { data, loading, error }
 *
 * Note: data here is an OBJECT (not an array) because the revenue.json file
 * has a single object with summary, comparison, weeklyChart, topServices.
 */
import { createContext, useContext, useReducer, useEffect } from 'react';
import mockRevenue from '@/mocks/revenue.json';

const RevenueContext = createContext(null);

const initialState = {
  data: null, // null because it's an object, not an array
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

export function RevenueProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        dispatch({ type: 'LOAD_SUCCESS', payload: mockRevenue });
      } catch (err) {
        dispatch({ type: 'LOAD_ERROR', payload: err.message });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Read-only — no actions. Revenue data is computed on the backend.
  const value = { ...state };

  return (
    <RevenueContext.Provider value={value}>{children}</RevenueContext.Provider>
  );
}

export function useRevenue() {
  const ctx = useContext(RevenueContext);
  if (!ctx) throw new Error('useRevenue must be used inside a <RevenueProvider>');
  return ctx;
}
