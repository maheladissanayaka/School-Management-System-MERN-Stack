import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import { Loader2 } from 'lucide-react';

// --- FIXED IMPORT HERE ---
// It must match the filename 'AuthContext.jsx'
import { AuthProvider, useAuth } from './context/AuthContext'; 

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Pages
import Login from './pages/Login';
import Home from './pages/Home';
import Teachers from './pages/Teachers';
import Students from './pages/Students';
import Classes from './pages/Classes';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Visitors from './pages/Visitors';
import ViewAnnouncements from './pages/ViewAnnouncements'; 
import Parents from './pages/Parents';
import Subjects from './pages/Subjects';
import Assignments from './pages/Assignments';

// --- 1. PROTECTED ROUTE GUARD ---
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
        <p className="text-gray-400 font-bold animate-pulse tracking-widest">VERIFYING SESSION...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/home" replace />; 
  }

  return <Outlet />;
};

// --- 2. DASHBOARD LAYOUT WRAPPER ---
const DashboardLayout = () => {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar role={user.role} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Dashboard Overview" />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

// --- 3. PUBLIC ROUTE GUARD ---
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) return <Navigate to="/home" replace />;
  return children;
};

// --- 4. MAIN APP COMPONENT ---
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} theme="light" />
        
        <Routes>
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />

          <Route element={<ProtectedRoute allowedRoles={['admin', 'teacher', 'student', 'visitor']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/teachers" element={<Teachers />} />
              <Route path="/students" element={<Students />} />
              <Route path="/visitors" element={<Visitors />} />
              <Route path="/classes" element={<Classes />} />
              <Route path="/announcements" element={<ViewAnnouncements />} />
              <Route path="/view-announcements" element={<ViewAnnouncements />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              
              {/* Placeholders */}
              <Route path="/parents" element={<Parents/>} />
              <Route path="/subjects" element={<Subjects/>} />
              <Route path="/assignments" element={<Assignments/>} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;