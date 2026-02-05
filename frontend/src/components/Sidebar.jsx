import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, Users, UserCircle, BookOpen, Layers, FileText, Bell, LogOut, AlertCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ role }) => {
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    { name: 'Home', icon: <Home size={20}/>, roles: ['admin', 'teacher', 'student', 'visitor'] },
    { name: 'Teachers', icon: <Users size={20}/>, roles: ['admin', 'visitor'] },
    { name: 'Students', icon: <UserCircle size={20}/>, roles: ['admin', 'teacher', 'visitor'] },
    { name: 'Parents', icon: <Users size={20}/>, roles: ['admin', 'teacher', 'visitor'] },
    // Added 'Visitors' link - Only Admin can view this
    { name: 'Visitors', icon: <Users size={20}/>, roles: ['admin'] },
    { name: 'Subjects', icon: <BookOpen size={20}/>, roles: ['admin', 'teacher', 'student', 'visitor'] },
    { name: 'Classes', icon: <Layers size={20}/>, roles: ['admin', 'teacher', 'visitor'] },
    { name: 'Assignments', icon: <FileText size={20}/>, roles: ['teacher', 'student', 'visitor'] },
    { name: 'Announcements', icon: <Bell size={20}/>, roles: ['admin'] },
  ];

  return (
    <>
      <div className="w-64 bg-white h-screen border-r flex flex-col font-sans shrink-0">
        {/* Logo Section */}
        <div className="p-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
          <span className="font-bold text-xl text-gray-800 tracking-tight">SchoolLMS</span>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-2 overflow-y-auto">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-4 px-2">Menu</p>
          <ul className="space-y-1">
            {menuItems.filter(item => item.roles.includes(role)).map((item) => (
              <li key={item.name}>
                <Link to={`/${item.name.toLowerCase()}`} className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors group">
                  <span className="text-gray-400 group-hover:text-blue-600">{item.icon}</span>
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info & Logout Button */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3 px-2 py-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold uppercase">
              {role ? role[0] : 'U'}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800 capitalize">{role || 'User'}</p>
              <p className="text-[10px] text-gray-500">Online</p>
            </div>
          </div>
          <button 
            onClick={() => setShowLogoutModal(true)} 
            className="flex items-center gap-3 px-3 py-2 w-full text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
          >
            <LogOut size={18}/> Logout
          </button>
        </div>
      </div>

      {/* --- LOGOUT CONFIRMATION MODAL --- */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                <AlertCircle size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Confirm Logout</h3>
              <p className="text-gray-500 mt-2">Are you sure you want to leave? Any unsaved changes may be lost.</p>
            </div>

            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button 
                onClick={logout}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 shadow-lg shadow-red-100 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;