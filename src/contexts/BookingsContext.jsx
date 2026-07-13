import { createContext, useContext, useState } from 'react';

const BookingsContext = createContext(null);

const mockBookings = [
  {
    id: 1,
    customer: 'Ahmed Ali',
    service: 'Oil Change',
    time: '09:00',
    status: 'completed',
    vehicle: 'Toyota Camry 2020',
  },
  {
    id: 2,
    customer: 'Mohamed Salah',
    service: 'Brake Replacement',
    time: '10:30',
    status: 'in_progress',
    vehicle: 'Honda Civic 2019',
  },
  {
    id: 3,
    customer: 'Sara Hassan',
    service: 'Tire Rotation',
    time: '11:00',
    status: 'confirmed',
    vehicle: 'Hyundai Elantra 2021',
  },
  {
    id: 4,
    customer: 'Omar Yasser',
    service: 'Engine Diagnostic',
    time: '12:00',
    status: 'pending',
    vehicle: 'Kia Sportage 2022',
  },
  {
    id: 5,
    customer: 'Fatma Nour',
    service: 'Battery Replacement',
    time: '13:30',
    status: 'confirmed',
    vehicle: 'Nissan Sentra 2020',
  },
  {
    id: 6,
    customer: 'Khaled Mostafa',
    service: 'AC Repair',
    time: '14:00',
    status: 'pending',
    vehicle: 'Volkswagen Golf 2019',
  },
  {
    id: 7,
    customer: 'Layla Adel',
    service: 'Transmission Service',
    time: '15:30',
    status: 'confirmed',
    vehicle: 'Mazda 3 2021',
  },
  {
    id: 8,
    customer: 'Youssef Tarek',
    service: 'Wheel Alignment',
    time: '16:00',
    status: 'completed',
    vehicle: 'Ford Focus 2020',
  },
];

export function BookingsProvider({ children }) {
  const [bookings] = useState(mockBookings);

  const todaysBookings = bookings;
  const todaysCount = bookings.length;
  const yesterdaysCount = 6; // mock: yesterday had 6 bookings
  const difference = todaysCount - yesterdaysCount;

  const value = {
    bookings,
    todaysBookings,
    todaysCount,
    yesterdaysCount,
    difference,
  };

  return <BookingsContext.Provider value={value}>{children}</BookingsContext.Provider>;
}

export function useBookings() {
  const ctx = useContext(BookingsContext);
  if (!ctx) throw new Error('useBookings must be used inside a <BookingsProvider>');
  return ctx;
}
