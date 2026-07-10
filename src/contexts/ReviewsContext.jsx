/**
 * ReviewsContext — provides reviews data + reply/edit actions.
 *
 * Used by: Dashboard page (avg rating), Reviews page (list + reply flow).
 *
 * Exposes:
 *   { data, loading, error, replyReview, editReply, deleteReview }
 */
import { createContext, useContext, useReducer, useEffect } from 'react';
import mockReviews from '@/mocks/reviews.json';

const ReviewsContext = createContext(null);

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
    case 'REPLY_REVIEW':
      return {
        ...state,
        data: state.data.map((r) =>
          r.id === action.payload.id
            ? {
                ...r,
                replied: true,
                replyText: action.payload.text,
                replyTimestamp: new Date().toISOString(),
              }
            : r
        ),
      };
    case 'EDIT_REPLY':
      return {
        ...state,
        data: state.data.map((r) =>
          r.id === action.payload.id
            ? { ...r, replyText: action.payload.text }
            : r
        ),
      };
    case 'DELETE_REVIEW':
      return {
        ...state,
        data: state.data.filter((r) => r.id !== action.payload),
      };
    default:
      return state;
  }
}

export function ReviewsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        dispatch({ type: 'LOAD_SUCCESS', payload: mockReviews });
      } catch (err) {
        dispatch({ type: 'LOAD_ERROR', payload: err.message });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const replyReview = (id, text) =>
    dispatch({ type: 'REPLY_REVIEW', payload: { id, text } });
  const editReply = (id, text) =>
    dispatch({ type: 'EDIT_REPLY', payload: { id, text } });
  const deleteReview = (id) =>
    dispatch({ type: 'DELETE_REVIEW', payload: id });

  const value = {
    ...state,
    replyReview,
    editReply,
    deleteReview,
  };

  return (
    <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>
  );
}

export function useReviews() {
  const ctx = useContext(ReviewsContext);
  if (!ctx) throw new Error('useReviews must be used inside a <ReviewsProvider>');
  return ctx;
}
