/**
 * JobsContext — provides Kanban jobs data + move-stage action (for DnD).
 *
 * Used by: Jobs Board page (Kanban with @dnd-kit).
 *
 * Exposes:
 *   { data, loading, error, moveJobStage, addJob, updateJob, deleteJob }
 *
 * The moveJobStage action is critical for the Kanban DnD — when a user
 * drags a job card from one column to another, this updates the stage.
 */
import { createContext, useContext, useReducer, useEffect } from 'react';
import mockJobs from '@/mocks/jobs.json';

const JobsContext = createContext(null);

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
    case 'MOVE_JOB_STAGE':
      return {
        ...state,
        data: state.data.map((j) =>
          j.id === action.payload.id ? { ...j, stage: action.payload.stage } : j
        ),
      };
    case 'ADD_JOB':
      return { ...state, data: [action.payload, ...state.data] };
    case 'UPDATE_JOB':
      return {
        ...state,
        data: state.data.map((j) =>
          j.id === action.payload.id ? { ...j, ...action.payload } : j
        ),
      };
    case 'DELETE_JOB':
      return {
        ...state,
        data: state.data.filter((j) => j.id !== action.payload),
      };
    default:
      return state;
  }
}

export function JobsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        dispatch({ type: 'LOAD_SUCCESS', payload: mockJobs });
      } catch (err) {
        dispatch({ type: 'LOAD_ERROR', payload: err.message });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const moveJobStage = (id, stage) =>
    dispatch({ type: 'MOVE_JOB_STAGE', payload: { id, stage } });
  const addJob = (job) => dispatch({ type: 'ADD_JOB', payload: job });
  const updateJob = (id, updates) =>
    dispatch({ type: 'UPDATE_JOB', payload: { id, ...updates } });
  const deleteJob = (id) => dispatch({ type: 'DELETE_JOB', payload: id });

  const value = {
    ...state,
    moveJobStage,
    addJob,
    updateJob,
    deleteJob,
  };

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
}

export function useJobs() {
  const ctx = useContext(JobsContext);
  if (!ctx) throw new Error('useJobs must be used inside a <JobsProvider>');
  return ctx;
}
