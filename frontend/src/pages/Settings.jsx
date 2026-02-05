import React, { useState } from 'react';
import { Moon, Bell, Lock, Shield, ChevronRight, Save } from 'lucide-react';
import { toast } from 'react-toastify';

const Settings = () => {
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        toast.success("Settings saved successfully!");
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-black text-gray-800 mb-8 flex items-center gap-3">
        <SettingsIcon className="text-blue-600" size={32} /> Settings & Preferences
      </h1>

      <div className="grid gap-8">
        
        {/* Appearance Section */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Moon size={20} className="text-purple-500"/> Appearance
            </h3>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div>
                    <p className="font-bold text-gray-700">Dark Mode</p>
                    <p className="text-xs text-gray-400 font-medium mt-1">Adjust the appearance of the dashboard to reduce eye strain.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
            </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Bell size={20} className="text-orange-500"/> Notifications
            </h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <span className="font-bold text-gray-600 text-sm">Email Alerts for Announcements</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-blue-600 rounded" />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <span className="font-bold text-gray-600 text-sm">Exam Schedule Updates</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-blue-600 rounded" />
                </div>
            </div>
        </div>

        {/* Security Section */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Shield size={20} className="text-emerald-500"/> Security
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-2">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 font-bold text-gray-700" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-2">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 font-bold text-gray-700" />
                </div>
            </div>
            <button 
                onClick={handleSave}
                disabled={loading}
                className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
                {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
            </button>
        </div>

      </div>
    </div>
  );
};

// Helper icon component
const SettingsIcon = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);

export default Settings;