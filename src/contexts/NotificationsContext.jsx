/**
 * NotificationsContext — provides notifications + mark-as-read actions.
 *
 * Used by: Notifications page, Topbar bell badge (unread count).
 *
 * Exposes:
 *   { data, loading, error, markAsRead, markAllAsRead, deleteNotification,
 *     addNotification }
 */
import { createContext, useContext, useReducer, useEffect } from 'react';
import mockNotifications from '@/mocks/notifications.json';

const NotificationsContext = createContext(null);

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
    case 'MARK_AS_READ':
      return {
        ...state,
        data: state.data.map((n) =>
          n.id === action.payload ? { ...n, status: 'read' } : n
        ),
      };
    case 'MARK_ALL_AS_READ':
      return {
        ...state,
        data: state.data.map((n) => ({ ...n, status: 'read' })),
      };
    case 'DELETE_NOTIFICATION':
      return {
        ...state,
        data: state.data.filter((n) => n.id !== action.payload),
      };
    case 'ADD_NOTIFICATION':
      return { ...state, data: [action.payload, ...state.data] };
    default:
      return state;
  }
}

export function NotificationsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        dispatch({ type: 'LOAD_SUCCESS', payload: mockNotifications });
      } catch (err) {
        dispatch({ type: 'LOAD_ERROR', payload: err.message });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const markAsRead = (id) =>
    dispatch({ type: 'MARK_AS_READ', payload: id });
  const markAllAsRead = () => dispatch({ type: 'MARK_ALL_AS_READ' });
  const deleteNotification = (id) =>
    dispatch({ type: 'DELETE_NOTIFICATION', payload: id });
  const addNotification = (notif) =>
    dispatch({ type: 'ADD_NOTIFICATION', payload: notif });

  const value = {
    ...state,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used inside a <NotificationsProvider>');
  return ctx;
}
