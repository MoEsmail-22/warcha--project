import { lazy } from 'react';

export const DashboardPage = lazy(() => import('../pages/DashboardPage/index'));
export const JobsBoardPage = lazy(() => import('../pages/JobsBoardPage'));
export const BookingsPage = lazy(() => import('../pages/BookingsPage'));
export const QuotesPage = lazy(() => import('../pages/QuotesPage'));
export const CustomersPage = lazy(() => import('../pages/CustomersPage'));
export const ServicesPricingPage = lazy(() => import('../pages/ServicesPricingPage'));
export const VehiclesPage = lazy(() => import('../pages/VehiclesPage'));
export const TechniciansPage = lazy(() => import('../pages/TechniciansPage'));
export const RevenuePage = lazy(() => import('../pages/RevenuePage'));
export const NotificationsPage = lazy(() => import('../pages/NotificationsPage'));
export const RepairJobsPage = lazy(() => import('../pages/RepairJobsPage'));
export const ReviewsPage = lazy(() => import('../pages/ReviewsPage'));
export const SettingsPage = lazy(() => import('../pages/SettingsPage'));
export const LoginPage = lazy(() => import('../pages/AuthPage/LoginPage'));
export const RegisterPage = lazy(() => import('../pages/AuthPage/RegisterPage'));
