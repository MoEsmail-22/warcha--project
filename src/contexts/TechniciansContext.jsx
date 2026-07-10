/**
 * TechniciansContext — provides technicians data + CRUD actions.
 *
 * Used by: Technicians page (cards grid + detail drawer), Bookings page (assignment).
 *
 * Exposes:
 *   { data, loading, error, addTechnician, updateTechnician, deleteTechnician }
 */
import { createContext, useContext, useReducer, useEffect } from 'react';
import mockTechnicians from '@/mocks/technicians.json';

const TechniciansContext = createContext(null);

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
    case 'ADD_TECHNICIAN':
      return { ...state, data: [action.payload, ...state.data] };
    case 'UPDATE_TECHNICIAN':
      return {
        ...state,
        data: state.data.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        ),
      };
    case 'DELETE_TECHNICIAN':
      return {
        ...state,
        data: state.data.filter((t) => t.id !== action.payload),
      };
    default:
      return state;
  }
}

export function TechniciansProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        dispatch({ type: 'LOAD_SUCCESS', payload: mockTechnicians });
      } catch (err) {
        dispatch({ type: 'LOAD_ERROR', payload: err.message });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const addTechnician = (tech) =>
    dispatch({ type: 'ADD_TECHNICIAN', payload: tech });
  const updateTechnician = (id, updates) =>
    dispatch({ type: 'UPDATE_TECHNICIAN', payload: { id, ...updates } });
  const deleteTechnician = (id) =>
    dispatch({ type: 'DELETE_TECHNICIAN', payload: id });

  const value = {
    ...state,
    addTechnician,
    updateTechnician,
    deleteTechnician,
  };

  return (
    <TechniciansContext.Provider value={value}>
      {children}
    </TechniciansContext.Provider>
  );
}

export function useTechnicians() {
  const ctx = useContext(TechniciansContext);
  if (!ctx) throw new Error('useTechnicians must be used inside a <TechniciansProvider>');
  return ctx;
}
