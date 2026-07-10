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
  { key: 'dashboard', labelKey: 'nav.dashboard', icon: LayoutDashboard, path: '/dev' },
  { key: 'jobs', labelKey: 'nav.jobs', icon: Briefcase, path: '/dev/jobs' },
  { key: 'bookings', labelKey: 'nav.bookings', icon: CalendarDays, path: '/dev/bookings' },
  { key: 'quotes', labelKey: 'nav.quotes', icon: FileText, path: '/dev/quotes' },
  { key: 'customers', labelKey: 'nav.customers', icon: Users, path: '/dev/customers' },
  { key: 'services', labelKey: 'nav.services', icon: DollarSign, path: '/dev/services' },
  { key: 'reviews', labelKey: 'nav.reviews', icon: Star, path: '/dev/reviews' },
  { key: 'settings', labelKey: 'nav.settings', icon: SettingsIcon, path: '/dev/settings' },
];

export default navItems;
