import React, { useState, useEffect } from 'react';
import { X, Save, Search, User, Loader2, Camera } from 'lucide-react';
import { createParent } from '../services/parentService';
import { getStudents } from '../services/userService'; 
import uploadToCloudinary from '../utils/uploadCloudinary';
import { toast } from 'react-toastify';

const AddParentModal = ({ isOpen, onClose, refreshData }) => {
  const [formData, setFormData] = useState({
    parentId: '', name: '', type: 'Father', nic: '', 
    job: '', dob: '', address: '', contact: '', image: '',
    students: [] 
  });
  
  const [allStudents, setAllStudents] = useState([]); 
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudentsData, setSelectedStudentsData] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (isOpen) {
      getStudents().then(data => setAllStudents(data)).catch(console.error);
    }
  }, [isOpen]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: URL.createObjectURL(file) });
      setImageFile(file);
    }
  };

  const handleAddStudent = (student) => {
    if (!formData.students.includes(student._id)) {
      setFormData(prev => ({ ...prev, students: [...prev.students, student._id] }));
      setSelectedStudentsData(prev => [...prev, student]);
    }
    setStudentSearch(''); 
  };

  const handleRemoveStudent = (studentId) => {
    setFormData(prev => ({ ...prev, students: prev.students.filter(id => id !== studentId) }));
    setSelectedStudentsData(prev => prev.filter(s => s._id !== studentId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = formData.image;
      if (imageFile) {
        toast.info("Uploading image...");
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const cleanData = { ...formData, image: imageUrl };
      if (!cleanData.dob) delete cleanData.dob;

      await createParent(cleanData);
      toast.success("Parent Profile Created!");
      refreshData();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to create parent");
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = allStudents.filter(s => 
    (s.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
     s.studentId.toLowerCase().includes(studentSearch.toLowerCase())) &&
    !formData.students.includes(s._id) 
  ).slice(0, 5);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
      {/* Changed 'custom-scrollbar' to 'no-scrollbar' */}
      <div className="bg-white rounded-[2rem] w-full max-w-4xl shadow-2xl p-8 relative max-h-[90vh] overflow-y-auto no-scrollbar">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"><X size={20}/></button>
        
        <h2 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-2">
           <User className="text-blue-600" /> Add Parent Record
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
           {/* Image Upload */}
           <div className="flex flex-col items-center justify-center mb-4">
            <label className="relative cursor-pointer group">
              <div className="w-28 h-28 rounded-full border-4 border-blue-50 overflow-hidden bg-gray-50 flex items-center justify-center shadow-sm">
                {formData.image ? <img src={formData.image} className="w-full h-full object-cover" alt="p" /> : <User size={48} className="text-gray-300"/>}
              </div>
              <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                <Camera className="text-white drop-shadow-md" size={24} />
              </div>
              <input type="file" hidden onChange={handleImage} />
            </label>
            <span className="text-[10px] font-bold text-gray-400 uppercase mt-2">Upload Photo</span>
           </div>

           {/* Input Grid with Labels */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">Parent Full Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-field" placeholder="Full Name" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">Parent ID</label>
                      <input required value={formData.parentId} onChange={e => setFormData({...formData, parentId: e.target.value})} className="input-field" placeholder="P-001" />
                  </div>
                  <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">Relationship</label>
                      <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="input-field appearance-none">
                          <option value="Father">Father</option>
                          <option value="Mother">Mother</option>
                          <option value="Guardian">Guardian</option>
                      </select>
                  </div>
              </div>

              <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">National ID (NIC)</label>
                  <input required value={formData.nic} onChange={e => setFormData({...formData, nic: e.target.value})} className="input-field" placeholder="National ID" />
              </div>

              <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">Occupation / Job</label>
                  <input value={formData.job} onChange={e => setFormData({...formData, job: e.target.value})} className="input-field" placeholder="Current Job" />
              </div>

              <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">Date of Birth</label>
                  <input type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} className="input-field" />
              </div>

              <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">Contact Number</label>
                  <input required value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} className="input-field" placeholder="Phone Number" />
              </div>

              <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">Residential Address</label>
                  <input required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="input-field" placeholder="Home Address" />
              </div>
           </div>

           {/* --- STUDENT SEARCH & LINKING --- */}
           <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 mt-4">
              <h3 className="text-sm font-bold text-blue-800 uppercase mb-3 flex items-center gap-2">
                  <User size={16}/> Link Students
              </h3>
              
              <div className="flex flex-wrap gap-2 mb-4 min-h-[30px]">
                {selectedStudentsData.length > 0 ? selectedStudentsData.map(student => (
                   <div key={student._id} className="flex items-center gap-2 bg-white pl-2 pr-1 py-1 rounded-full border border-blue-200 shadow-sm animate-in fade-in zoom-in duration-200">
                      <img src={student.image || ""} className="w-6 h-6 rounded-full bg-gray-200 object-cover" alt="" />
                      <div className="text-xs">
                          <span className="font-bold block text-gray-700">{student.name}</span>
                          <span className="text-gray-400 font-medium">{student.studentId}</span>
                      </div>
                      <button type="button" onClick={() => handleRemoveStudent(student._id)} className="ml-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-1 transition-colors"><X size={14}/></button>
                   </div>
                )) : (
                    <span className="text-xs text-gray-400 italic">Search below to link children.</span>
                )}
              </div>

              <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                 <input 
                    type="text" 
                    placeholder="Search student by Name or ID..." 
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500 font-medium placeholder:text-gray-400 bg-white"
                    value={studentSearch}
                    onChange={e => setStudentSearch(e.target.value)}
                 />
                 
                 {studentSearch && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl z-20 overflow-hidden border border-gray-100 max-h-48 overflow-y-auto no-scrollbar">
                        {filteredStudents.length > 0 ? filteredStudents.map(student => (
                            <div 
                                key={student._id} 
                                onClick={() => handleAddStudent(student)}
                                className="flex items-center gap-3 p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-none"
                            >
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                    {student.image ? <img src={student.image} className="w-full h-full object-cover" alt="s"/> : <User size={14} className="text-gray-400"/>}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-800">{student.name}</p>
                                    <p className="text-[10px] text-gray-400 font-medium">{student.studentId} • {student.grade?.name || 'No Grade'}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="p-3 text-xs text-gray-400 text-center">No students found</div>
                        )}
                    </div>
                 )}
              </div>
           </div>

           <button disabled={loading} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex justify-center items-center gap-2 shadow-lg shadow-blue-200">
              {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />} Save Parent Record
           </button>
        </form>
      </div>
      
      {/* CSS Rules for Hidden Scrollbars */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .input-field { 
          width: 100%; 
          background: #f9fafb; 
          padding: 12px 16px; 
          border-radius: 12px; 
          font-weight: 600; 
          color: #374151; 
          outline: none; 
          border: 1px solid transparent; 
          transition: all; 
        } 
        .input-field:focus { 
          background: white; 
          border-color: #2563eb; 
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); 
        }
      `}</style>
    </div>
  );
};

export default AddParentModal;