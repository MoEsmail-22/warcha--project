import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DevPage from '@/pages/DevPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root → redirect to /dev so opening localhost shows the UI showcase */}
        <Route path="/" element={<Navigate to="/dev" replace />} />
        <Route path="/dev" element={<DevPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
