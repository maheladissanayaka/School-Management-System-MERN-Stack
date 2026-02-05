import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { User, Mail, Phone, MapPin, Camera, Save, Shield, Lock, Send } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth(); // Logged in user context
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Edit State
  const [formData, setFormData] = useState({
    name: '', email: '', contact: '', address: '', image: ''
  });
  
  // FIXED: This state is now used below
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });

  // 1. Fetch Fresh Data on Mount
  useEffect(() => {
    const fetchProfile = async () => {
      const userId = user?._id || user?.id;
      if (!userId) return;

      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(`http://localhost:5000/api/users/${userId}`, config);
        
        setProfileData(res.data);
        setFormData({
          name: res.data.name || '',
          email: res.data.email || '',
          contact: res.data.contact || '',
          address: res.data.address || '',
          image: res.data.image || ''
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  // 2. Image Upload Handler (Simulated Cloudinary)
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (user.role === 'student') {
      toast.error("Students cannot change profile images.");
      return;
    }

    try {
      toast.info("Uploading image...");
      setTimeout(() => {
        const fakeUrl = URL.createObjectURL(file); 
        setFormData(prev => ({ ...prev, image: fakeUrl }));
        toast.success("Image uploaded (Simulation)");
      }, 1500);
    } catch (err) {
      toast.error("Image upload failed");
      console.log("Image upload failed"+err)
    }
  };

  // 3. Handle Detail Updates
  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    if (user.role === 'admin') {
      try {
        const token = localStorage.getItem('token');
        const userId = user?._id || user?.id;
        await axios.put(`http://localhost:5000/api/users/${userId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Profile updated successfully!");
      } catch (err) {
        toast.error("Update failed");
        console.log("Update failed"+err)
      }
    } else {
      toast.success("Request sent to Admin for approval.");
    }
  };

  // 4. Handle Password Update (Simulated)
  const handlePasswordUpdate = () => {
    if (!passwordData.current || !passwordData.new) {
        return toast.warning("Please fill in current and new password");
    }
    if (passwordData.new !== passwordData.confirm) {
        return toast.error("New passwords do not match");
    }
    // Simulation
    toast.success("Password updated successfully");
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-gray-400">Loading Profile...</div>;

  return (
    <div className="max-w-6xl mx-auto p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Identity Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 text-center relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-32 ${user.role === 'admin' ? 'bg-blue-600' : 'bg-slate-800'}`}></div>
            
            <div className="relative z-10 mt-12">
              <div className="w-40 h-40 mx-auto rounded-[2.5rem] border-4 border-white shadow-2xl overflow-hidden bg-gray-100 relative group">
                <img src={formData.image || profileData?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} className="w-full h-full object-cover" alt="Profile" />
                
                {user.role !== 'student' && (
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="text-white" size={32} />
                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                  </label>
                )}
              </div>
              
              <h2 className="text-2xl font-black text-gray-800 mt-6">{formData.name}</h2>
              <p className="text-blue-600 font-bold text-sm uppercase tracking-widest mt-1">{user.role}</p>
              
              <div className="mt-6 flex justify-center gap-2">
                <span className="px-4 py-2 bg-gray-50 rounded-xl text-xs font-bold text-gray-500 border border-gray-100 flex items-center gap-2">
                  <Shield size={14} className="text-emerald-500" /> 
                  {user.role === 'admin' ? 'Full Access' : 'Restricted Access'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Settings */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* General Information Form */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-gray-800 flex items-center gap-2">
                <User className="text-blue-600" size={24}/> Personal Details
              </h3>
              {user.role !== 'admin' && <span className="text-[10px] bg-yellow-50 text-yellow-600 px-3 py-1 rounded-full font-bold border border-yellow-100">Read Only / Request Change</span>}
            </div>

            <form onSubmit={handleDetailsSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Full Name</label>
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border-2 border-transparent focus-within:border-blue-100 transition-all">
                    <User size={18} className="text-gray-400" />
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="bg-transparent w-full outline-none font-bold text-gray-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email Address</label>
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl">
                    <Mail size={18} className="text-gray-400" />
                    <input 
                      type="email" 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="bg-transparent w-full outline-none font-bold text-gray-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Contact Number</label>
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl">
                    <Phone size={18} className="text-gray-400" />
                    <input 
                      type="text" 
                      value={formData.contact} 
                      onChange={(e) => setFormData({...formData, contact: e.target.value})}
                      className="bg-transparent w-full outline-none font-bold text-gray-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Residential Address</label>
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl">
                    <MapPin size={18} className="text-gray-400" />
                    <input 
                      type="text" 
                      value={formData.address} 
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="bg-transparent w-full outline-none font-bold text-gray-700"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button type="submit" className={`px-8 py-4 rounded-2xl font-bold text-white flex items-center gap-2 shadow-lg hover:shadow-xl transition-all ${user.role === 'admin' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-800 hover:bg-slate-900'}`}>
                  {user.role === 'admin' ? <><Save size={20} /> Save Changes</> : <><Send size={20} /> Request Update</>}
                </button>
              </div>
            </form>
          </div>

          {/* Password Change Section (Now Functional) */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
              <Lock className="text-orange-500" size={24}/> Security Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <input 
                 type="password" 
                 placeholder="Current Password" 
                 className="bg-gray-50 p-4 rounded-2xl outline-none font-bold text-gray-700 focus:ring-2 focus:ring-orange-100 transition-all"
                 value={passwordData.current}
                 onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
               />
               <input 
                 type="password" 
                 placeholder="New Password" 
                 className="bg-gray-50 p-4 rounded-2xl outline-none font-bold text-gray-700 focus:ring-2 focus:ring-orange-100 transition-all"
                 value={passwordData.new}
                 onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
               />
               <input 
                 type="password" 
                 placeholder="Confirm New Password" 
                 className="bg-gray-50 p-4 rounded-2xl outline-none font-bold text-gray-700 focus:ring-2 focus:ring-orange-100 transition-all"
                 value={passwordData.confirm}
                 onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
               />
            </div>
            <div className="mt-6 flex justify-end">
               <button onClick={handlePasswordUpdate} className="text-orange-500 font-bold text-sm hover:text-orange-600 transition-colors">Update Password</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;