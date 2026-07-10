import { Suspense } from 'react';
import { createBrowserRouter, redirect } from 'react-router-dom';
import RouteFallback from '../components/ui/RouteFallback';
import AppLayout from '../components/layout/AppLayout';
import AuthLayout from '../components/layout/AuthLayout';
import ProtectedRoute from './ProtectedRoute';
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
  LoginPage,
  RegisterPage,
} from './lazyPages';

const withSuspense = (node) => <Suspense fallback={<RouteFallback />}>{node}</Suspense>;

export const router = createBrowserRouter([
  // ---------- Root redirect: "/" → "/en/dev" ----------
  {
    path: '/',
    loader: () => redirect('/en/dev'),
  },

  // ---------- Language-prefixed routes ----------
  {
    path: '/:lang',
    children: [
      // ---- PUBLIC AUTH ROUTES ----
      {
        path: 'login',
        element: <AuthLayout>{withSuspense(<LoginPage />)}</AuthLayout>,
      },
      {
        path: 'register',
        element: <AuthLayout>{withSuspense(<RegisterPage />)}</AuthLayout>,
      },

      // ---- PROTECTED APP ROUTES ----
      {
        path: 'dev', // your dashboard / UI showcase route
        element: (
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        ),
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
    ],
  },
]);

export default router;
