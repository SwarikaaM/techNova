import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { PatientDashboard } from './pages/PatientDashboard';
import { ScheduleResultPage } from './pages/ScheduleResultPage';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { authService } from './services/api';

const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: 'patient' | 'doctor' }) => {
  const user = authService.getCurrentUser();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return <>{children}</>;
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white font-sans text-gray-900">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route 
              path="/patient/dashboard" 
              element={
                <ProtectedRoute role="patient">
                  <PatientDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/patient/schedule" 
              element={
                <ProtectedRoute role="patient">
                  <ScheduleResultPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/doctor/dashboard" 
              element={
                <ProtectedRoute role="doctor">
                  <DoctorDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        
        <footer className="bg-gray-50 border-t border-gray-100 py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} AI ChronoMed. All rights reserved.
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Disclaimer: This platform provides AI-generated suggestions. Always consult with a medical professional before changing your medication schedule.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}
