/**
 * RepairJobsContext — provides repair jobs data + move-stage action (Kanban).
 *
 * Used by: Repair Jobs Board page (Kanban with @dnd-kit).
 *
 * Exposes:
 *   { data, loading, error, moveStage, addRepairJob, updateRepairJob, deleteRepairJob }
 */
import { createContext, useContext, useReducer, useEffect } from 'react';
import mockRepairJobs from '@/mocks/repairJobs.json';

const RepairJobsContext = createContext(null);

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
    case 'MOVE_STAGE':
      return {
        ...state,
        data: state.data.map((rj) =>
          rj.id === action.payload.id ? { ...rj, stage: action.payload.stage } : rj
        ),
      };
    case 'ADD_REPAIR_JOB':
      return { ...state, data: [action.payload, ...state.data] };
    case 'UPDATE_REPAIR_JOB':
      return {
        ...state,
        data: state.data.map((rj) =>
          rj.id === action.payload.id ? { ...rj, ...action.payload } : rj
        ),
      };
    case 'DELETE_REPAIR_JOB':
      return {
        ...state,
        data: state.data.filter((rj) => rj.id !== action.payload),
      };
    default:
      return state;
  }
}

export function RepairJobsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        dispatch({ type: 'LOAD_SUCCESS', payload: mockRepairJobs });
      } catch (err) {
        dispatch({ type: 'LOAD_ERROR', payload: err.message });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const moveStage = (id, stage) =>
    dispatch({ type: 'MOVE_STAGE', payload: { id, stage } });
  const addRepairJob = (job) =>
    dispatch({ type: 'ADD_REPAIR_JOB', payload: job });
  const updateRepairJob = (id, updates) =>
    dispatch({ type: 'UPDATE_REPAIR_JOB', payload: { id, ...updates } });
  const deleteRepairJob = (id) =>
    dispatch({ type: 'DELETE_REPAIR_JOB', payload: id });

  const value = {
    ...state,
    moveStage,
    addRepairJob,
    updateRepairJob,
    deleteRepairJob,
  };

  return (
    <RepairJobsContext.Provider value={value}>
      {children}
    </RepairJobsContext.Provider>
  );
}

export function useRepairJobs() {
  const ctx = useContext(RepairJobsContext);
  if (!ctx) throw new Error('useRepairJobs must be used inside a <RepairJobsProvider>');
  return ctx;
}
