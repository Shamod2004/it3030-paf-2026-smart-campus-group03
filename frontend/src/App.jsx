import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ResourcesManagement from './pages/ResourcesManagement';
import './styles/index.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to resources page */}
        <Route path="/" element={<Navigate to="/admin/resources" replace />} />

        {/* Admin Routes */}
        <Route path="/admin/resources" element={<ResourcesManagement />} />

        {/* Catch all - redirect to resources */}
        <Route path="*" element={<Navigate to="/admin/resources" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
