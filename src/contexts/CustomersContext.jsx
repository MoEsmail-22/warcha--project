/**
 * CustomersContext — provides customers data + CRUD actions.
 *
 * Used by: Customers page (table + detail drawer), Bookings page (customer info).
 *
 * Exposes:
 *   { data, loading, error, addCustomer, updateCustomer, deleteCustomer }
 */
import { createContext, useContext, useReducer, useEffect } from 'react';
import mockCustomers from '@/mocks/customers.json';

const CustomersContext = createContext(null);

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
    case 'ADD_CUSTOMER':
      return { ...state, data: [action.payload, ...state.data] };
    case 'UPDATE_CUSTOMER':
      return {
        ...state,
        data: state.data.map((c) =>
          c.id === action.payload.id ? { ...c, ...action.payload } : c
        ),
      };
    case 'DELETE_CUSTOMER':
      return {
        ...state,
        data: state.data.filter((c) => c.id !== action.payload),
      };
    default:
      return state;
  }
}

export function CustomersProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        dispatch({ type: 'LOAD_SUCCESS', payload: mockCustomers });
      } catch (err) {
        dispatch({ type: 'LOAD_ERROR', payload: err.message });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const addCustomer = (customer) =>
    dispatch({ type: 'ADD_CUSTOMER', payload: customer });
  const updateCustomer = (id, updates) =>
    dispatch({ type: 'UPDATE_CUSTOMER', payload: { id, ...updates } });
  const deleteCustomer = (id) =>
    dispatch({ type: 'DELETE_CUSTOMER', payload: id });

  const value = {
    ...state,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  };

  return (
    <CustomersContext.Provider value={value}>
      {children}
    </CustomersContext.Provider>
  );
}

export function useCustomers() {
  const ctx = useContext(CustomersContext);
  if (!ctx) throw new Error('useCustomers must be used inside a <CustomersProvider>');
  return ctx;
}
