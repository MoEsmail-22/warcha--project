import { Outlet } from 'react-router-dom';
import { LanguageProvider } from '../../contexts/LanguageContext';

export default function AuthLayout({ children }) {
  return <LanguageProvider>{children ?? <Outlet />}</LanguageProvider>;
}
