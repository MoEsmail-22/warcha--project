import { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import RouteFallback from '../components/ui/RouteFallback';
import AppLayout from '../components/layout/AppLayout';
import {
  DashboardPage,
  JobsBoardPage,
  BookingsPage,
  QuotesPage,
  CustomersPage,
  ServicesPricingPage,
  VehiclesPage,
  TechniciansPage,
  RevenuePage,
  NotificationsPage,
  RepairJobsPage,
  ReviewsPage,
  SettingsPage,
} from './lazyPages';

const withSuspense = (node) => <Suspense fallback={<RouteFallback />}>{node}</Suspense>;

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: withSuspense(<DashboardPage />) },
      { path: 'jobs', element: withSuspense(<JobsBoardPage />) },
      { path: 'bookings', element: withSuspense(<BookingsPage />) },
      { path: 'quotes', element: withSuspense(<QuotesPage />) },
      { path: 'customers', element: withSuspense(<CustomersPage />) },
      { path: 'services', element: withSuspense(<ServicesPricingPage />) },
      { path: 'vehicles', element: withSuspense(<VehiclesPage />) },
      { path: 'technicians', element: withSuspense(<TechniciansPage />) },
      { path: 'revenue', element: withSuspense(<RevenuePage />) },
      { path: 'notifications', element: withSuspense(<NotificationsPage />) },
      { path: 'repair-jobs', element: withSuspense(<RepairJobsPage />) },
      { path: 'reviews', element: withSuspense(<ReviewsPage />) },
      { path: 'settings', element: withSuspense(<SettingsPage />) },
    ],
  },
]);

export default router;
