/**
 * VehiclesContext — provides vehicles data + stage update actions.
 *
 * Used by: Dashboard page (cars in service count), Vehicles page (table/grid).
 *
 * Exposes:
 *   { data, loading, error, addVehicle, updateVehicle, updateStage, deleteVehicle }
 */
import { createContext, useContext, useReducer, useEffect } from 'react';
import mockVehicles from '@/mocks/vehicles.json';

const VehiclesContext = createContext(null);

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
    case 'ADD_VEHICLE':
      return { ...state, data: [action.payload, ...state.data] };
    case 'UPDATE_VEHICLE':
      return {
        ...state,
        data: state.data.map((v) =>
          v.id === action.payload.id ? { ...v, ...action.payload } : v
        ),
      };
    case 'UPDATE_STAGE':
      return {
        ...state,
        data: state.data.map((v) =>
          v.id === action.payload.id ? { ...v, stage: action.payload.stage } : v
        ),
      };
    case 'DELETE_VEHICLE':
      return {
        ...state,
        data: state.data.filter((v) => v.id !== action.payload),
      };
    default:
      return state;
  }
}

export function VehiclesProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        dispatch({ type: 'LOAD_SUCCESS', payload: mockVehicles });
      } catch (err) {
        dispatch({ type: 'LOAD_ERROR', payload: err.message });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const addVehicle = (vehicle) =>
    dispatch({ type: 'ADD_VEHICLE', payload: vehicle });
  const updateVehicle = (id, updates) =>
    dispatch({ type: 'UPDATE_VEHICLE', payload: { id, ...updates } });
  const updateStage = (id, stage) =>
    dispatch({ type: 'UPDATE_STAGE', payload: { id, stage } });
  const deleteVehicle = (id) =>
    dispatch({ type: 'DELETE_VEHICLE', payload: id });

  const value = {
    ...state,
    addVehicle,
    updateVehicle,
    updateStage,
    deleteVehicle,
  };

  return (
    <VehiclesContext.Provider value={value}>
      {children}
    </VehiclesContext.Provider>
  );
}

export function useVehicles() {
  const ctx = useContext(VehiclesContext);
  if (!ctx) throw new Error('useVehicles must be used inside a <VehiclesProvider>');
  return ctx;
}
