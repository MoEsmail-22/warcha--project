/**
 * BookingsContext — provides bookings data + CRUD actions.
 *
 * Used by: Dashboard page (today's bookings count), Bookings page (table).
 *
 * Exposes:
 *   { data, loading, error, addBooking, updateBooking, cancelBooking, deleteBooking }
 *
 * Usage in a page:
 *   const { data: bookings, loading, error } = useBookings();
 */
import { createContext, useContext, useReducer, useEffect } from 'react';
import mockBookings from '@/mocks/bookings.json';

const BookingsContext = createContext(null);

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
    case 'ADD_BOOKING':
      return { ...state, data: [action.payload, ...state.data] };
    case 'UPDATE_BOOKING':
      return {
        ...state,
        data: state.data.map((b) =>
          b.id === action.payload.id ? { ...b, ...action.payload } : b
        ),
      };
    case 'CANCEL_BOOKING':
      return {
        ...state,
        data: state.data.map((b) =>
          b.id === action.payload ? { ...b, status: 'cancelled' } : b
        ),
      };
    case 'DELETE_BOOKING':
      return {
        ...state,
        data: state.data.filter((b) => b.id !== action.payload),
      };
    default:
      return state;
  }
}

export function BookingsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Simulate async fetch with 300ms delay (so we can test loading skeletons)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        dispatch({ type: 'LOAD_SUCCESS', payload: mockBookings });
      } catch (err) {
        dispatch({ type: 'LOAD_ERROR', payload: err.message });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Entity-specific actions
  const addBooking = (booking) =>
    dispatch({ type: 'ADD_BOOKING', payload: booking });
  const updateBooking = (id, updates) =>
    dispatch({ type: 'UPDATE_BOOKING', payload: { id, ...updates } });
  const cancelBooking = (id) =>
    dispatch({ type: 'CANCEL_BOOKING', payload: id });
  const deleteBooking = (id) =>
    dispatch({ type: 'DELETE_BOOKING', payload: id });

  const value = {
    ...state,
    addBooking,
    updateBooking,
    cancelBooking,
    deleteBooking,
  };

  return (
    <BookingsContext.Provider value={value}>
      {children}
    </BookingsContext.Provider>
  );
}

export function useBookings() {
  const ctx = useContext(BookingsContext);
  if (!ctx) throw new Error('useBookings must be used inside a <BookingsProvider>');
  return ctx;
}
