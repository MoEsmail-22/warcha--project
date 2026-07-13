/**
 * Sidebar navigation items.
 *
 * Each item has:
 *   key       — unique identifier
 *   labelKey  — translation key (looked up in nav.json)
 *   icon      — lucide-react icon component
 *   path      — URL path RELATIVE to /:lang (no leading slash)
 *               '' = index route (dashboard), 'jobs' = /:lang/jobs, etc.
 *
 * Order here = order in the sidebar.
 */
import {
  LayoutDashboard,
  Briefcase,
  CalendarDays,
  FileText,
  Users,
  Wrench,
  Car,
  UserCog,
  TrendingUp,
  Bell,
  Star,
  Settings as SettingsIcon,
  DollarSign,
} from 'lucide-react';

export const navItems = [
  { key: 'dashboard', labelKey: 'dashboard', icon: LayoutDashboard, path: '' },
  { key: 'jobs', labelKey: 'jobs', icon: Briefcase, path: 'jobs' },
  { key: 'bookings', labelKey: 'bookings', icon: CalendarDays, path: 'bookings' },
  { key: 'repairJobs', labelKey: 'repairJobs', icon: Wrench, path: 'repair-jobs' },
  { key: 'quotes', labelKey: 'quotes', icon: FileText, path: 'quotes' },
  { key: 'customers', labelKey: 'customers', icon: Users, path: 'customers' },
  { key: 'vehicles', labelKey: 'vehicles', icon: Car, path: 'vehicles' },
  { key: 'services', labelKey: 'services', icon: Wrench, path: 'services' },
  { key: 'technicians', labelKey: 'technicians', icon: UserCog, path: 'technicians' },
  { key: 'revenue', labelKey: 'revenue', icon: DollarSign, path: 'revenue' },
  { key: 'notifications', labelKey: 'notifications', icon: Bell, path: 'notifications' },
  { key: 'reviews', labelKey: 'reviews', icon: Star, path: 'reviews' },
  { key: 'settings', labelKey: 'settings', icon: SettingsIcon, path: 'settings' },
];

export default navItems;
