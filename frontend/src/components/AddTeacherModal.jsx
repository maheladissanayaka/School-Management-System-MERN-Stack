import React, { useState, useEffect } from 'react';
import { X, UserPlus, Camera, User, Loader2, ShieldCheck, Plus, Trash2, BookOpen } from 'lucide-react';
import { registerUser } from '../services/userService';
import { getSubjects } from '../services/subjectService'; // 1. Import Subject Service
import { toast } from 'react-toastify';
import uploadToCloudinary from '../utils/uploadCloudinary';

const AddTeacherModal = ({ isOpen, onClose, refreshData }) => {
  const initialState = {
    name: '', email: '', password: '', role: 'teacher',
    teacherId: '', gender: 'Male', image: '', contact: '', 
    address: '', dob: '', registerDate: '', 
    subject: '', // This will now store the Subject ID
    qualifications: [''], experience: ['']
  };

  const [formData, setFormData] = useState(initialState);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]); // 2. State for subjects

  // 3. Fetch Subjects when modal opens
  useEffect(() => {
    if (isOpen) {
      getSubjects()
        .then(data => setSubjects(Array.isArray(data) ? data : []))
        .catch(err => console.error("Failed to load subjects", err));
    }
  }, [isOpen]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFormData({ ...formData, image: previewUrl });
      setSelectedFile(file);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let imageUrl = formData.image;

      if (selectedFile) {
        toast.info("Uploading image to cloud...");
        imageUrl = await uploadToCloudinary(selectedFile);
        if (!imageUrl) throw new Error("Image upload failed");
      }

      const cleanData = {
        ...formData,
        image: imageUrl,
        qualifications: formData.qualifications.filter(q => q.trim() !== ''),
        experience: formData.experience.filter(ex => ex.trim() !== '')
      };

      await registerUser(cleanData);
      toast.success("Faculty Registered Successfully!");
      refreshData();
      onClose();
      setFormData(initialState);
      setSelectedFile(null);
    } catch (err) { 
      console.error(err);
      toast.error(err.response?.data?.msg || "Registration Failed"); 
    } finally { 
      setLoading(false); 
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white rounded-[3rem] w-full max-w-3xl shadow-2xl p-10 relative my-8 animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-red-500 transition-colors"><X size={24} /></button>
        
        <h2 className="text-3xl font-black text-gray-800 mb-8 flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-2xl shadow-lg shadow-blue-100"><UserPlus className="text-white" size={24} /></div>
            Register New Faculty
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
          <div className="flex justify-center mb-6">
            <label className="relative cursor-pointer group active:scale-95 transition-transform">
              <div className="w-32 h-32 rounded-[2.5rem] border-4 border-blue-50 overflow-hidden bg-gray-50 flex items-center justify-center shadow-sm">
                {formData.image ? <img src={formData.image} className="w-full h-full object-cover" alt="preview" /> : <User size={50} className="text-gray-200" />}
                <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-[2.5rem]"><Camera className="text-white" size={32} /></div>
              </div>
              <input type="file" hidden accept="image/*" onChange={handleImage} />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Full Name</label>
                <input type="text" required value={formData.name} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all" onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            
            <div>
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Teacher ID</label>
                <input type="text" required value={formData.teacherId} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-blue-600 focus:ring-2 focus:ring-blue-600 outline-none" onChange={e => setFormData({...formData, teacherId: e.target.value})} />
            </div>

            <div>
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Gender</label>
                <select value={formData.gender} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-blue-600" onChange={e => setFormData({...formData, gender: e.target.value})}>
                    <option value="Male">Male</option><option value="Female">Female</option>
                </select>
            </div>

            {/* 👇 UPDATED SUBJECT DROPDOWN 👇 */}
            <div>
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Primary Subject</label>
                <div className="relative">
                   <select 
                      required
                      value={formData.subject} 
                      onChange={e => setFormData({...formData, subject: e.target.value})}
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-blue-600 appearance-none"
                   >
                      <option value="">-- Select Subject --</option>
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
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">School Register Date</label>
                <input type="date" required value={formData.registerDate} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none" onChange={e => setFormData({...formData, registerDate: e.target.value})} />
            </div>

            {/* ... Rest of the form remains exactly the same ... */}
            <div>
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Date of Birth</label>
                <input type="date" required value={formData.dob} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none" onChange={e => setFormData({...formData, dob: e.target.value})} />
            </div>

            <div>
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Contact Number</label>
                <input type="text" required value={formData.contact} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none" onChange={e => setFormData({...formData, contact: e.target.value})} />
            </div>

            <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Email Address</label>
                <input type="email" required value={formData.email} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none" onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>

            <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Residential Address</label>
                <textarea required value={formData.address} rows="2" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-blue-600" onChange={e => setFormData({...formData, address: e.target.value})}></textarea>
            </div>

            <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Set Password</label>
                <input type="password" required value={formData.password} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-blue-600" onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>

            {/* Dynamic Lists */}
            <div className="md:col-span-2 space-y-3">
                <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase text-gray-400">Qualifications</label>
                    <button type="button" onClick={() => addListItem('qualifications')} className="text-blue-600 hover:bg-blue-50 p-2 rounded-xl transition-all"><Plus size={18} /></button>
                </div>
                {formData.qualifications.map((q, i) => (
                    <div key={i} className="flex gap-2">
                        <input type="text" value={q} className="flex-1 bg-gray-50 border-none rounded-2xl px-5 py-3 font-medium outline-none focus:ring-2 focus:ring-blue-100" placeholder="e.g. B.Sc. in Physics" onChange={e => handleDynamicList('qualifications', i, e.target.value)} />
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
                        <input type="text" value={ex} className="flex-1 bg-gray-50 border-none rounded-2xl px-5 py-3 font-medium outline-none focus:ring-2 focus:ring-blue-100" placeholder="e.g. 5 Years at City College" onChange={e => handleDynamicList('experience', i, e.target.value)} />
                        <button type="button" onClick={() => removeListItem('experience', i)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-xl transition-colors"><Trash2 size={18} /></button>
                    </div>
                ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 mt-6">
            {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck />} Confirm Faculty Enrollment
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTeacherModal;