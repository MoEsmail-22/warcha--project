/**
 * ServicesContext — provides services + pricing data + CRUD actions.
 *
 * Used by: Services & Pricing page (table), Quotes page (line items selection).
 *
 * Each service has bilingual names (en/ar) — the page picks the right one
 * based on the current language.
 *
 * Exposes:
 *   { data, loading, error, addService, updateService, toggleStatus, deleteService, duplicateService }
 */
import { createContext, useContext, useReducer, useEffect } from 'react';
import mockServices from '@/mocks/services.json';

const ServicesContext = createContext(null);

const initialState = {
  data: [],
  loading: true,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_SUCCESS':
      return { data: action.payload, loading: false, error: null };
    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_SERVICE':
      return { ...state, data: [action.payload, ...state.data] };
    case 'UPDATE_SERVICE':
      return {
        ...state,
        data: state.data.map((s) =>
          s.id === action.payload.id ? { ...s, ...action.payload } : s
        ),
      };
    case 'TOGGLE_STATUS':
      return {
        ...state,
        data: state.data.map((s) =>
          s.id === action.payload
            ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' }
            : s
        ),
      };
    case 'DELETE_SERVICE':
      return {
        ...state,
        data: state.data.filter((s) => s.id !== action.payload),
      };
    case 'DUPLICATE_SERVICE':
      // Find the original, create a copy with a new ID
      const original = state.data.find((s) => s.id === action.payload);
      if (!original) return state;
      const copy = {
        ...original,
        id: `S-${Date.now()}`,
        name: { ...original.name },
        description: { ...original.description },
      };
      return { ...state, data: [copy, ...state.data] };
    default:
      return state;
  }
}

export function ServicesProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        dispatch({ type: 'LOAD_SUCCESS', payload: mockServices });
      } catch (err) {
        dispatch({ type: 'LOAD_ERROR', payload: err.message });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const addService = (service) =>
    dispatch({ type: 'ADD_SERVICE', payload: service });
  const updateService = (id, updates) =>
    dispatch({ type: 'UPDATE_SERVICE', payload: { id, ...updates } });
  const toggleStatus = (id) =>
    dispatch({ type: 'TOGGLE_STATUS', payload: id });
  const deleteService = (id) =>
    dispatch({ type: 'DELETE_SERVICE', payload: id });
  const duplicateService = (id) =>
    dispatch({ type: 'DUPLICATE_SERVICE', payload: id });

  const value = {
    ...state,
    addService,
    updateService,
    toggleStatus,
    deleteService,
    duplicateService,
  };

  return (
    <ServicesContext.Provider value={value}>
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices() {
  const ctx = useContext(ServicesContext);
  if (!ctx) throw new Error('useServices must be used inside a <ServicesProvider>');
  return ctx;
}
