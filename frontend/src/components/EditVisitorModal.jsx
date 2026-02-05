import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Camera, User } from 'lucide-react';
import { updateUser } from '../services/userService';
import { toast } from 'react-toastify';
import uploadToCloudinary from '../utils/uploadCloudinary';

const EditVisitorModal = ({ isOpen, onClose, refreshData, visitor }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', contact: '', address: '', dob: '', 
    gender: '', visitorId: '', image: '', department: '', position: '', nic: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (visitor && isOpen) {
      setFormData({
        name: visitor.name || '',
        email: visitor.email || '',
        contact: visitor.contact || '',
        address: visitor.address || '',
        gender: visitor.gender || 'Male',
        visitorId: visitor.visitorId || '',
        department: visitor.department || '',
        position: visitor.position || '',
        nic: visitor.nic || '',
        image: visitor.image || '',
        dob: visitor.dob ? new Date(visitor.dob).toISOString().split('T')[0] : '',
      });
    }
  }, [visitor, isOpen]);

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
      if (selectedFile) {
        toast.info("Uploading new image...");
        imageUrl = await uploadToCloudinary(selectedFile);
        if (!imageUrl) throw new Error("Image upload failed");
      }

      const cleanData = { ...formData, image: imageUrl };
      await updateUser(visitor._id, cleanData);
      toast.success("Visitor Profile Updated!");
      refreshData();
      onClose();
    } catch (err) { 
      console.error(err);
      toast.error(err.response?.data?.error || "Update Failed");
    } finally { 
      setIsSubmitting(false); 
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white rounded-[3rem] w-full max-w-3xl shadow-2xl p-10 relative my-8 animate-in slide-in-from-bottom-8 duration-500">
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-red-500 transition-colors"><X size={24} /></button>
        
        <h2 className="text-3xl font-black text-gray-800 mb-8 flex items-center gap-3">
            <div className="bg-purple-600 p-2 rounded-2xl shadow-lg shadow-purple-100"><Save className="text-white" size={24} /></div>
            Update Visitor Profile
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
          <div className="flex justify-center mb-6">
            <label className="relative cursor-pointer group active:scale-95 transition-transform">
              <div className="w-32 h-32 rounded-[2.5rem] border-4 border-purple-50 overflow-hidden bg-gray-50 flex items-center justify-center shadow-sm">
                {formData.image ? <img src={formData.image} className="w-full h-full object-cover" alt="p" /> : <User size={50} className="text-gray-200" />}
                <div className="absolute inset-0 bg-purple-600/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-[2.5rem]"><Camera className="text-white" size={32} /></div>
              </div>
              <input type="file" hidden accept="image/*" onChange={handleImage} />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Full Name</label>
                <input type="text" required value={formData.name} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-purple-600 font-bold transition-all" onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            
            <div>
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Visitor ID</label>
                <input type="text" required value={formData.visitorId} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-purple-600 font-bold text-purple-600" onChange={e => setFormData({...formData, visitorId: e.target.value})} />
            </div>

            <div>
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Gender</label>
                <select value={formData.gender} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-purple-600 font-bold" onChange={e => setFormData({...formData, gender: e.target.value})}>
                    <option value="Male">Male</option><option value="Female">Female</option>
                </select>
            </div>

            <div>
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Department</label>
                <input type="text" required value={formData.department} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-purple-600 outline-none" onChange={e => setFormData({...formData, department: e.target.value})} />
            </div>

            <div>
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Position</label>
                <input type="text" required value={formData.position} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-purple-600 outline-none" onChange={e => setFormData({...formData, position: e.target.value})} />
            </div>

            <div>
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">National ID</label>
                <input type="text" required value={formData.nic} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none" onChange={e => setFormData({...formData, nic: e.target.value})} />
            </div>

            <div>
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Date of Birth</label>
                <input type="date" value={formData.dob} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none" onChange={e => setFormData({...formData, dob: e.target.value})} />
            </div>

            <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Contact Number</label>
                <input type="text" value={formData.contact} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-purple-600" onChange={e => setFormData({...formData, contact: e.target.value})} />
            </div>

            <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Email Address</label>
                <input type="email" required value={formData.email} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-purple-600" onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>

            <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Residential Address</label>
                <textarea required value={formData.address} rows="2" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-purple-600" onChange={e => setFormData({...formData, address: e.target.value})}></textarea>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-purple-600 text-white py-5 rounded-2xl font-black shadow-xl hover:bg-purple-700 transition-all flex items-center justify-center gap-3 mt-6">
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />} Save Visitor Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditVisitorModal;