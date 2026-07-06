import { Routes, Route, Navigate } from 'react-router-dom';
import DevPage from '@/pages/DevPage';

function App() {
  return (
    <Routes>
      {/* Root → redirect to /en/dev (default language) */}
      <Route path="/" element={<Navigate to="/en/dev" replace />} />

      {/* Routes with language prefix — :lang will be 'en' or 'ar' */}
      <Route path="/:lang/dev" element={<DevPage />} />

      {/* Catch-all → redirect to default */}
      <Route path="*" element={<Navigate to="/en/dev" replace />} />
    </Routes>
  );
}

export default App;
