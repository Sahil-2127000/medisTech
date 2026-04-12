import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';

const ProtectedRoute = ({ children, allowedRole }) => {
  const user = JSON.parse(sessionStorage.getItem('user') || 'null');
  
  if (!user) return <Navigate to="/auth" />;
  
  // Explicit Role Verification Guard
  if (allowedRole && user.role !== allowedRole) {
     return <Navigate to={user.role === 'doctor' ? '/doctordashboard' : '/patientdashboard'} />;
  }
  
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route 
        path="/patientdashboard/*" 
        element={
          <ProtectedRoute allowedRole="patient">
             <PatientDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/doctordashboard/*" 
        element={
          <ProtectedRoute allowedRole="doctor">
             <DoctorDashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;
