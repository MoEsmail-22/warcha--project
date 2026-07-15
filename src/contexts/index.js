/**
 * Barrel file for all 12 entity Context providers.
 *
 * Lets you import them all from one path:
 *   import {
 *     BookingsProvider, useBookings,
 *     VehiclesProvider, useVehicles,
 *     ...
 *   } from '@/contexts';
 *
 * The providers should be nested inside AuthProvider (in main.jsx) so they
 * have access to the auth state.
 */
export { BookingsProvider, useBookings } from './BookingsContext';
export { VehiclesProvider, useVehicles } from './VehiclesContext';
export { JobsProvider, useJobs } from './JobsContext';
export { RepairJobsProvider, useRepairJobs } from './RepairJobsContext';
export { CustomersProvider, useCustomers } from './CustomersContext';
export { QuotesProvider, useQuotes } from './QuotesContext';
export { ServicesProvider, useServices } from './ServicesContext';
export { TechniciansProvider, useTechnicians } from './TechniciansContext';
export { ReviewsProvider, useReviews } from './ReviewsContext';
export { NotificationsProvider, useNotifications } from './NotificationsContext';
export { RevenueProvider, useRevenue } from './RevenueContext';
export { SettingsProvider, useSettings } from './SettingsContext';
