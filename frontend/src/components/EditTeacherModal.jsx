import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Camera, User, Plus, Trash2, BookOpen } from 'lucide-react';
import { updateUser } from '../services/userService';
import { getSubjects } from '../services/subjectService'; // Import
import { toast } from 'react-toastify';
import uploadToCloudinary from '../utils/uploadCloudinary';

const EditTeacherModal = ({ isOpen, onClose, refreshData, teacher }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', contact: '', address: '', dob: '', 
    gender: '', teacherId: '', image: '', subject: '', registerDate: '',
    qualifications: [], experience: []
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subjects, setSubjects] = useState([]); // Subject State

  useEffect(() => {
    if (teacher && isOpen) {
       // Fetch subjects
       getSubjects()
        .then(data => setSubjects(Array.isArray(data) ? data : []))
        .catch(err => console.error("Failed to load subjects", err));

      setFormData({
        name: teacher.name || '',
        email: teacher.email || '',
        contact: teacher.contact || '',
        address: teacher.address || '',
        gender: teacher.gender || 'Male',
        teacherId: teacher.teacherId || '',
        // Handle subject population (Object vs String)
        subject: teacher.subject && typeof teacher.subject === 'object' 
                 ? teacher.subject._id 
                 : (teacher.subject || ''),
        image: teacher.image || '',
        dob: teacher.dob ? new Date(teacher.dob).toISOString().split('T')[0] : '',
        registerDate: teacher.registerDate ? new Date(teacher.registerDate).toISOString().split('T')[0] : '',
        qualifications: teacher.qualifications?.length ? teacher.qualifications : [''],
        experience: teacher.experience?.length ? teacher.experience : ['']
      });
    }
  }, [teacher, isOpen]);

  // ... (Keep handleDynamicList, addListItem, removeListItem, handleImage exactly as they are) ...
  const handleDynamicList = (type, index, value) => {
    const list = [...formData[type]];
    list[index] = value;
    setFormData({ ...formData, [type]: list });
  };

  const addListItem = (type) => {
    setFormData({ ...formData, [type]: [...formData[type], ''] });
  };

  const removeListItem = (type, index) => {
    const list = formData[type].filter((_, i) => i !== index);
    setFormData({ ...formData, [type]: list });
  };

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

      const cleanData = {
        ...formData,
        image: imageUrl, 
        qualifications: formData.qualifications.filter(q => q.trim() !== ''),
        experience: formData.experience.filter(ex => ex.trim() !== '')
      };

      await updateUser(teacher._id, cleanData);
      toast.success("Faculty Profile Updated!");
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
            <div className="bg-blue-600 p-2 rounded-2xl shadow-lg shadow-blue-100"><Save className="text-white" size={24} /></div>
            Update Faculty Profile
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
          <div className="flex justify-center mb-6">
            <label className="relative cursor-pointer group active:scale-95 transition-transform">
              <div className="w-32 h-32 rounded-[2.5rem] border-4 border-blue-50 overflow-hidden bg-gray-50 flex items-center justify-center shadow-sm">
                {formData.image ? <img src={formData.image} className="w-full h-full object-cover" alt="p" /> : <User size={50} className="text-gray-200" />}
                <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-[2.5rem]"><Camera className="text-white" size={32} /></div>
              </div>
              <input type="file" hidden accept="image/*" onChange={handleImage} />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ... Other fields (Name, ID, Gender) remain same ... */}
            <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Faculty Full Name</label>
                <input type="text" required value={formData.name} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all" onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            
            <div>
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Teacher ID</label>
                <input type="text" required value={formData.teacherId} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600 font-bold text-blue-600" onChange={e => setFormData({...formData, teacherId: e.target.value})} />
            </div>

            <div>
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Gender</label>
                <select value={formData.gender} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600 font-bold" onChange={e => setFormData({...formData, gender: e.target.value})}>
                    <option value="Male">Male</option><option value="Female">Female</option>
                </select>
            </div>

            {/* 👇 UPDATED SUBJECT DROPDOWN 👇 */}
            <div>
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Primary Subject</label>
                <div className="relative">
                   <select 
                      value={formData.subject} 
                      onChange={e => setFormData({...formData, subject: e.target.value})}
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-blue-600 appearance-none"
                   >
                      <option value="">-- General / No Subject --</option>
                      {subjects.map(sub => (
                        <option key={sub._id} value={sub._id}>
                          {sub.name} ({sub.code})
                        </option>
                      ))}
                   </select>
                   <BookOpen className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18}/>
                </div>
            </div>
            {/* 👆 END UPDATE 👆 */}

            <div>
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Date of Birth</label>
                <input type="date" value={formData.dob} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none" onChange={e => setFormData({...formData, dob: e.target.value})} />
            </div>

            <div>
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">School Register Date</label>
                <input type="date" value={formData.registerDate} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none" onChange={e => setFormData({...formData, registerDate: e.target.value})} />
            </div>

            <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Contact Number</label>
                <input type="text" value={formData.contact} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-blue-600" onChange={e => setFormData({...formData, contact: e.target.value})} />
            </div>

            <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Email Address</label>
                <input type="email" required value={formData.email} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-blue-600" onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>

            <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Residential Address</label>
                <textarea required value={formData.address} rows="2" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-blue-600" onChange={e => setFormData({...formData, address: e.target.value})}></textarea>
            </div>

            {/* Dynamic Lists */}
            <div className="md:col-span-2 space-y-3">
                <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase text-gray-400">Qualifications</label>
                    <button type="button" onClick={() => addListItem('qualifications')} className="text-blue-600 hover:bg-blue-50 p-2 rounded-xl transition-all"><Plus size={18} /></button>
                </div>
                {formData.qualifications.map((q, i) => (
                    <div key={i} className="flex gap-2">
                        <input type="text" value={q} className="flex-1 bg-gray-50 border-none rounded-2xl px-5 py-3 font-medium outline-none focus:ring-2 focus:ring-blue-100" onChange={e => handleDynamicList('qualifications', i, e.target.value)} />
                        <button type="button" onClick={() => removeListItem('qualifications', i)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-xl transition-colors"><Trash2 size={18} /></button>
                    </div>
                ))}
            </div>

            <div className="md:col-span-2 space-y-3">
                <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase text-gray-400">Teaching Experience</label>
                    <button type="button" onClick={() => addListItem('experience')} className="text-blue-600 hover:bg-blue-50 p-2 rounded-xl transition-all"><Plus size={18} /></button>
                </div>
                {formData.experience.map((ex, i) => (
                    <div key={i} className="flex gap-2">
                        <input type="text" value={ex} className="flex-1 bg-gray-50 border-none rounded-2xl px-5 py-3 font-medium outline-none focus:ring-2 focus:ring-blue-100" onChange={e => handleDynamicList('experience', i, e.target.value)} />
                        <button type="button" onClick={() => removeListItem('experience', i)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-xl transition-colors"><Trash2 size={18} /></button>
                    </div>
                ))}
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 mt-6">
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />} Save Profile Updates
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTeacherModal;