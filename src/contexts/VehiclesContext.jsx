import { createContext, useContext, useState } from 'react';

const VehiclesContext = createContext(null);

const mockVehicles = [
  { id: 1, make: 'Toyota', model: 'Camry', year: 2020, plate: 'ABC-1234', status: 'in_service' },
  { id: 2, make: 'Honda', model: 'Civic', year: 2019, plate: 'DEF-5678', status: 'in_service' },
  { id: 3, make: 'Hyundai', model: 'Elantra', year: 2021, plate: 'GHI-9012', status: 'in_service' },
  {
    id: 4,
    make: 'Kia',
    model: 'Sportage',
    year: 2022,
    plate: 'JKL-3456',
    status: 'awaiting_approval',
  },
  {
    id: 5,
    make: 'Nissan',
    model: 'Sentra',
    year: 2020,
    plate: 'MNO-7890',
    status: 'awaiting_approval',
  },
];

export function VehiclesProvider({ children }) {
  const [vehicles] = useState(mockVehicles);

  const carsInService = vehicles.filter((v) => v.status === 'in_service');
  const awaitingApproval = vehicles.filter((v) => v.status === 'awaiting_approval');

  const value = {
    vehicles,
    carsInServiceCount: carsInService.length,
    awaitingApprovalCount: awaitingApproval.length,
  };

  return <VehiclesContext.Provider value={value}>{children}</VehiclesContext.Provider>;
}

export function useVehicles() {
  const ctx = useContext(VehiclesContext);
  if (!ctx) throw new Error('useVehicles must be used inside a <VehiclesProvider>');
  return ctx;
}
