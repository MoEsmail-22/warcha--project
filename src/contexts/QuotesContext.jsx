/**
 * QuotesContext — provides quotes data + status-change actions.
 *
 * Used by: Quotes page (table + multi-step create modal), Repair Jobs page (link).
 *
 * Exposes:
 *   { data, loading, error, addQuote, updateQuote, sendQuote, acceptQuote,
 *     rejectQuote, deleteQuote }
 */
import { createContext, useContext, useReducer, useEffect } from 'react';
import mockQuotes from '@/mocks/quotes.json';

const QuotesContext = createContext(null);

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
    case 'ADD_QUOTE':
      return { ...state, data: [action.payload, ...state.data] };
    case 'UPDATE_QUOTE':
      return {
        ...state,
        data: state.data.map((q) =>
          q.id === action.payload.id ? { ...q, ...action.payload } : q
        ),
      };
    case 'SET_QUOTE_STATUS':
      return {
        ...state,
        data: state.data.map((q) =>
          q.id === action.payload.id ? { ...q, status: action.payload.status } : q
        ),
      };
    case 'DELETE_QUOTE':
      return {
        ...state,
        data: state.data.filter((q) => q.id !== action.payload),
      };
    default:
      return state;
  }
}

export function QuotesProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        dispatch({ type: 'LOAD_SUCCESS', payload: mockQuotes });
      } catch (err) {
        dispatch({ type: 'LOAD_ERROR', payload: err.message });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const addQuote = (quote) => dispatch({ type: 'ADD_QUOTE', payload: quote });
  const updateQuote = (id, updates) =>
    dispatch({ type: 'UPDATE_QUOTE', payload: { id, ...updates } });
  const sendQuote = (id) =>
    dispatch({ type: 'SET_QUOTE_STATUS', payload: { id, status: 'sent' } });
  const acceptQuote = (id) =>
    dispatch({ type: 'SET_QUOTE_STATUS', payload: { id, status: 'accepted' } });
  const rejectQuote = (id) =>
    dispatch({ type: 'SET_QUOTE_STATUS', payload: { id, status: 'rejected' } });
  const deleteQuote = (id) =>
    dispatch({ type: 'DELETE_QUOTE', payload: id });

  const value = {
    ...state,
    addQuote,
    updateQuote,
    sendQuote,
    acceptQuote,
    rejectQuote,
    deleteQuote,
  };

  return (
    <QuotesContext.Provider value={value}>{children}</QuotesContext.Provider>
  );
}

export function useQuotes() {
  const ctx = useContext(QuotesContext);
  if (!ctx) throw new Error('useQuotes must be used inside a <QuotesProvider>');
  return ctx;
}
