import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';
import TicketDetailsPage from './components/TicketDetailsPage';
import ErrorBoundary from './components/ErrorBoundary';
import { Building2, ShieldCheck, GraduationCap } from 'lucide-react';

function App() {
  const [role, setRole] = useState(null); // null | 'admin' | 'student'

  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={
            role === null ? (
              // Role selection screen
              <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                  {/* Logo */}
                  <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
                      <Building2 className="w-9 h-9 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Smart Campus</h1>
                    <p className="text-gray-500 mt-1">Maintenance Ticket System</p>
                  </div>

                  {/* Role cards */}
                  <div className="space-y-4">
                    <button
                      onClick={() => setRole('admin')}
                      className="w-full bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all text-left group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                          <ShieldCheck className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900">Admin</p>
                          <p className="text-sm text-gray-500">Manage tickets, update status, assign technicians</p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setRole('student')}
                      className="w-full bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:border-green-400 hover:shadow-md transition-all text-left group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-600 transition-colors">
                          <GraduationCap className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900">Student</p>
                          <p className="text-sm text-gray-500">Submit tickets and track your requests</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Navigate to={`/${role}/dashboard`} replace />
            )
          } />
          
          <Route path="/admin/dashboard" element={
            role === 'admin' ? (
              <AdminDashboard onSwitchRole={() => setRole(null)} />
            ) : (
              <Navigate to="/" replace />
            )
          } />
          
          <Route path="/student/dashboard" element={
            role === 'student' ? (
              <StudentDashboard onSwitchRole={() => setRole(null)} />
            ) : (
              <Navigate to="/" replace />
            )
          } />
          
          <Route path="/tickets/:id" element={
            (role === 'admin' || role === 'student') ? (
              <TicketDetailsPage />
            ) : (
              <Navigate to="/" replace />
            )
          } />
          
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
