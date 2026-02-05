import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Camera, User as UserIcon } from 'lucide-react';
import { updateUser } from '../services/userService';
import { toast } from 'react-toastify';
import uploadToCloudinary from '../utils/uploadCloudinary';

const EditUserModal = ({ isOpen, onClose, refreshData, user, classes }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', contact: '', address: '', dob: '', 
    gender: '', grade: '', studentId: '', image: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        contact: user.contact || '',
        address: user.address || '',
        gender: user.gender || 'Male',
        studentId: user.studentId || '',
        grade: user.grade?._id || user.grade || '',
        image: user.image || '',
        dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : ''
      });
    }
  }, [user, isOpen]);

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
    setIsSubmitting(true);

    try {
      let imageUrl = formData.image;

      // Upload if a NEW file was selected
      if (selectedFile) {
        toast.info("Uploading image to cloud...");
        imageUrl = await uploadToCloudinary(selectedFile);
        if (!imageUrl) throw new Error("Image upload failed");
      }

      const dataToSubmit = {
        ...formData,
        image: imageUrl,
        grade: typeof formData.grade === 'object' ? formData.grade._id : formData.grade
      };

      await updateUser(user._id, dataToSubmit);
      toast.success("Profile Updated Successfully!");
      refreshData();
      onClose();
      setSelectedFile(null);
    } catch (err) { 
      toast.error(err.response?.data?.error || "Update Failed");
    } finally { 
      setIsSubmitting(false); 
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl p-10 animate-in slide-in-from-bottom-8 duration-500 relative">
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-red-500 transition-colors"><X size={24} /></button>
        
        <h2 className="text-3xl font-black text-gray-800 mb-8 flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-2xl shadow-lg shadow-blue-100"><Save className="text-white" size={24} /></div>
            Update Student Profile
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
          <div className="flex justify-center">
            <label className="relative cursor-pointer group active:scale-95 transition-transform">
              <div className="w-32 h-32 rounded-[2.5rem] border-4 border-blue-50 overflow-hidden bg-gray-50 flex items-center justify-center">
                {formData.image ? <img src={formData.image} className="w-full h-full object-cover" alt="p" /> : <UserIcon size={50} className="text-gray-200" />}
                <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-[2.5rem]"><Camera className="text-white" size={32} /></div>
              </div>
              <input type="file" hidden accept="image/*" onChange={handleImage} />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1 mb-1 block">Student Full Name</label>
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
                    <option value="">Select Grade</option>
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
                <textarea required value={formData.address} rows="2" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-blue-600" onChange={e => setFormData({...formData, address: e.target.value})}></textarea>
            </div>

            <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1 mb-1 block">Email Address</label>
                <input type="email" required value={formData.email} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-blue-600" onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />} Save Profile Updates
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;