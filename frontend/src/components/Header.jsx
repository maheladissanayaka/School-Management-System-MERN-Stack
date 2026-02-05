import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios'; // Ensure axios is imported
import { 
  User, Megaphone, Settings, LogOut, ChevronDown, 
  BadgeCheck, Bell 
} from 'lucide-react';

const Header = ({ title }) => {
  const { user } = useAuth(); 
  const navigate = useNavigate();
  
  // Local state to store the "Real" data fetched from DB
  const [dbUser, setDbUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 1. Fetch latest user data from DB on mount
  useEffect(() => {
    const fetchUserData = async () => {
      // Get ID from the context user object (handle various structures)
      const userId = user?._id || user?.id || user?.user?._id || user?.user?.id;
      
      if (userId) {
        try {
          // Get token from storage to authorize the request
          const token = localStorage.getItem('token'); 
          
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };

          // Fetch fresh data from the backend route we created
          // Adjust URL if your backend port is different (e.g. 5000, 8000)
          const response = await axios.get(`http://localhost:5000/api/users/${userId}`, config);
          
          // Update local state with fresh DB data
          setDbUser(response.data);
          // console.log("Fresh DB Data Loaded:", response.data);
        } catch (error) {
          console.error("Failed to fetch fresh user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  // 2. Decide which data to show (Prefer DB data, fallback to Context data)
  // This ensures 'email' is visible even if Context missed it
  const activeUser = dbUser || user?.user || user || {};
  
  const displayName = activeUser.name || 'Guest User';
  const displayEmail = activeUser.email || 'No Email Available';
  const displayRole = activeUser.role || 'Visitor';
  // Use DB image, or Dicebear avatar if null
  const displayImage = activeUser.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`;

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isVerified = displayRole === 'admin' || displayRole === 'teacher';

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm/50">
      
      {/* Left: Page Title */}
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-black text-gray-800 tracking-tight capitalize">
          {title || "Dashboard Overview"}
        </h2>
      </div>

      {/* Right: User Profile & Actions */}
      <div className="flex items-center gap-6">
        
        {/* Notification Bell */}
        <button className="p-2.5 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-blue-600 transition-all relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Vertical Divider */}
        <div className="h-8 w-px bg-gray-100"></div>

        {/* Profile Dropdown Container */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="text-right hidden md:block">
              <div className="flex items-center justify-end gap-1">
                <p className="text-sm font-bold text-gray-800 leading-none">
                  {displayName}
                </p>
                {isVerified && <BadgeCheck size={14} className="text-blue-500 fill-blue-50" />}
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                {displayRole}
              </p>
            </div>

            <div className="relative">
              <div className={`w-10 h-10 rounded-full p-0.5 border-2 ${isVerified ? 'border-blue-100' : 'border-gray-100'} group-hover:border-blue-200 transition-all`}>
                <img 
                  src={displayImage} 
                  alt="profile" 
                  className="w-full h-full rounded-full object-cover bg-gray-50"
                />
              </div>
              <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${isDropdownOpen ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            </div>
            
            <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-4 w-72 bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-4 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
              
              {/* Dropdown Header with Real Email from DB */}
              <div className="px-4 py-3 border-b border-gray-50 mb-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Signed in as</p>
                <p className="font-bold text-gray-800 truncate" title={displayEmail}>
                    {displayEmail}
                </p>
              </div>

              <div className="space-y-1">
                <p className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">General</p>
                
                <button onClick={() => { navigate('/profile'); setIsDropdownOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-all">
                  <User size={18} /> Profile Details
                </button>

                <button onClick={() => { navigate('/view-announcements'); setIsDropdownOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-all">
                  <Megaphone size={18} /> View Announcements
                </button>

                <button onClick={() => { navigate('/Settings'); setIsDropdownOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-all">
                  <Settings size={18} /> Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;