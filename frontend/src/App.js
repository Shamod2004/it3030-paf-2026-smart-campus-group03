import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ResourcesManagement from './pages/ResourcesManagement';
import UserDashboard from './pages/UserDashboard';
import UserResourcesPage from './pages/UserResourcesPage';
import './styles/index.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Home Page - Portal Selection */}
        <Route path="/" element={<HomePage />} />

        {/* Admin Routes */}
        <Route path="/admin/resources" element={<ResourcesManagement />} />

        {/* User Routes */}
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/resources" element={<UserResourcesPage />} />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
