import React, { useState } from 'react';
import { X, UserPlus, Camera, User, Loader2, ShieldCheck } from 'lucide-react';
import { registerUser } from '../services/userService';
import { toast } from 'react-toastify';
import uploadToCloudinary from '../utils/uploadCloudinary';

const AddUserModal = ({ isOpen, onClose, refreshData, defaultRole, classes }) => {
  const initialState = {
    name: '', email: '', password: '', role: defaultRole || 'student',
    studentId: '', gender: 'Male', grade: '', image: '', contact: '', address: '', dob: ''
  };

  const [formData, setFormData] = useState(initialState);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFormData({ ...formData, image: previewUrl });
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.grade && defaultRole === 'student') return toast.warning("Please select a Grade");
    
    setLoading(true);
    try {
      let imageUrl = formData.image;

      // Upload to Cloudinary if file selected
      if (selectedFile) {
        toast.info("Uploading image...");
        imageUrl = await uploadToCloudinary(selectedFile);
        if (!imageUrl) throw new Error("Image upload failed");
      }

      const dataToSubmit = {
        ...formData,
        image: imageUrl
      };

      await registerUser(dataToSubmit);
      toast.success("Student Enrolled Successfully!");
      refreshData();
      onClose();
      setFormData(initialState);
      setSelectedFile(null);
    } catch (err) { 
      toast.error(err.response?.data?.msg || "Enrollment Failed"); 
    } finally { 
      setLoading(false); 
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl p-10 animate-in zoom-in-95 duration-300 relative">
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-red-500 transition-colors"><X size={24} /></button>
        
        <h2 className="text-3xl font-black text-gray-800 mb-8 flex items-center gap-3 capitalize">
            <div className="bg-blue-600 p-2 rounded-2xl shadow-lg shadow-blue-100"><UserPlus className="text-white" size={24} /></div>
            Register New {defaultRole}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
          <div className="flex justify-center">
            <label className="relative cursor-pointer group active:scale-95 transition-transform">
              <div className="w-32 h-32 rounded-[2.5rem] border-4 border-blue-50 overflow-hidden bg-gray-50 flex items-center justify-center">
                {formData.image ? <img src={formData.image} className="w-full h-full object-cover" alt="preview" /> : <User size={50} className="text-gray-200" />}
                <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-[2.5rem]"><Camera className="text-white" size={32} /></div>
              </div>
              <input type="file" hidden accept="image/*" onChange={handleImage} />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1 mb-1 block">Full Name</label>
                <input type="text" required value={formData.name} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600 font-bold" onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1 mb-1 block">Student ID</label>
                <input type="text" required value={formData.studentId} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600 font-bold text-blue-600" onChange={e => setFormData({...formData, studentId: e.target.value})} />
            </div>
            <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1 mb-1 block">Gender</label>
                <select value={formData.gender} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600 font-bold" onChange={e => setFormData({...formData, gender: e.target.value})}>
                    <option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                </select>
            </div>
            <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1 mb-1 block">Class/Grade</label>
                <select required value={formData.grade} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600 font-bold" onChange={e => setFormData({...formData, grade: e.target.value})}>
                  <option value="">-- Assigned Grade --</option>
                  {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
            </div>
            
            <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1 mb-1 block">Date of Birth</label>
                <input type="date" required value={formData.dob} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-blue-600" onChange={e => setFormData({...formData, dob: e.target.value})} />
            </div>
            <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1 mb-1 block">Contact Number</label>
                <input type="text" value={formData.contact} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-blue-600" onChange={e => setFormData({...formData, contact: e.target.value})} />
            </div>

            <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1 mb-1 block">Residential Address</label>
                <textarea required value={formData.address} rows="2" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-blue-600" onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Enter Address..."></textarea>
            </div>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="email" required placeholder="Email Address" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-blue-600" onChange={e => setFormData({...formData, email: e.target.value})} />
                <input type="password" required placeholder="Security Password" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-blue-600" onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
            {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck />} Confirm Enrollment
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;