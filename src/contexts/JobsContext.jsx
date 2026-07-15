import { createContext, useContext, useState } from 'react';

const JobsContext = createContext(null);

// 4 stages matching the mockup
export const JOB_STAGES = ['new', 'diagnosing', 'in_progress', 'ready'];

const mockJobs = [
  // ---- New (2 cards) ----
  {
    id: 'job-1',
    stage: 'new',
    vehicle: 'Hyundai Elantra',
    service: 'Brake check',
    customer: 'Sara K.',
    initials: 'SK',
    time: '11:00',
  },
  {
    id: 'job-2',
    stage: 'new',
    vehicle: 'Nissan Sunny',
    service: 'General check',
    customer: 'Nadia F.',
    initials: 'NF',
    time: '2:30',
  },
  // ---- Diagnosing (1 card) ----
  {
    id: 'job-3',
    stage: 'diagnosing',
    vehicle: 'Kia Sportage',
    service: 'A/C not cooling',
    customer: 'Omar T.',
    initials: 'OT',
    time: '1:00',
  },
  // ---- In Progress (2 cards) ----
  {
    id: 'job-4',
    stage: 'in_progress',
    vehicle: 'Toyota Corolla',
    service: 'Oil change',
    customer: 'Hazem M.',
    initials: 'HM',
    time: '10:30',
  },
  {
    id: 'job-5',
    stage: 'in_progress',
    vehicle: 'Chevrolet Optra',
    service: 'Suspension',
    customer: 'Mostafa R.',
    initials: 'MR',
    time: '9:00',
  },
  // ---- Ready (1 card) ----
  {
    id: 'job-6',
    stage: 'ready',
    vehicle: 'Honda Civic',
    service: 'Oil + filter',
    customer: 'Youssef H.',
    initials: 'YH',
    time: null,
    done: true,
  },
];

export function JobsProvider({ children }) {
  const [jobs, setJobs] = useState(mockJobs);

  // Move a job to a different stage (called after drag)
  const moveJob = (jobId, newStage) => {
    setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, stage: newStage } : j)));
  };

  // Reorder within a stage
  const reorderJobs = (sourceIndex, destIndex, stage) => {
    setJobs((prev) => {
      const stageJobs = prev.filter((j) => j.stage === stage);
      const otherJobs = prev.filter((j) => j.stage !== stage);
      const [moved] = stageJobs.splice(sourceIndex, 1);
      stageJobs.splice(destIndex, 0, moved);
      return [...otherJobs, ...stageJobs];
    });
  };

  const value = { jobs, moveJob, reorderJobs };
  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
}

export function useJobs() {
  const ctx = useContext(JobsContext);
  if (!ctx) throw new Error('useJobs must be used inside a <JobsProvider>');
  return ctx;
}
