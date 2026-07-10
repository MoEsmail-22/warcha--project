// Each item uses a labelKey that maps to public/locales/{lang}/nav.json
// icon is a JSX element rendered by the Sidebar (kept as component for tree-shaking)
import {
  LayoutDashboard,
  Briefcase,
  CalendarDays,
  FileText,
  Users,
  DollarSign,
  Star,
  Settings as SettingsIcon,
} from 'lucide-react';

export const navItems = [
  { key: 'dashboard', labelKey: 'dashboard', icon: LayoutDashboard, path: '/dev' },
  { key: 'jobs', labelKey: 'jobs', icon: Briefcase, path: '/dev/jobs' },
  { key: 'bookings', labelKey: 'bookings', icon: CalendarDays, path: '/dev/bookings' },
  { key: 'quotes', labelKey: 'quotes', icon: FileText, path: '/dev/quotes' },
  { key: 'customers', labelKey: 'customers', icon: Users, path: '/dev/customers' },
  { key: 'services', labelKey: 'services', icon: DollarSign, path: '/dev/services' },
  { key: 'reviews', labelKey: 'reviews', icon: Star, path: '/dev/reviews' },
  { key: 'settings', labelKey: 'settings', icon: SettingsIcon, path: '/dev/settings' },
];

export default navItems;
