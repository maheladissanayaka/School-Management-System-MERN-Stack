import React, { useState, useEffect } from 'react';
import { X, Upload, Calendar, FileText, Layers, CheckCircle, Loader2 } from 'lucide-react';
import API from '../api/axiosInstance';
import uploadToCloudinary from '../utils/uploadCloudinary';
import { toast } from 'react-toastify';

const AddAssignmentModal = ({ isOpen, onClose, refreshData }) => {
  const [formData, setFormData] = useState({
    title: '', description: '', grade: '', subject: '', deadline: '', file: null
  });
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch Grades for Dropdown
  useEffect(() => {
    if(isOpen) {
        API.get('/classes').then(res => setGrades(res.data)).catch(err => console.error(err));
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        let fileUrl = '';
        if (formData.file) {
            toast.info("Uploading document...");
            fileUrl = await uploadToCloudinary(formData.file);
        }

        await API.post('/assignments', {
            ...formData,
            fileUrl
        });

        toast.success("Assignment Posted!");
        refreshData();
        onClose();
        setFormData({ title: '', description: '', grade: '', subject: '', deadline: '', file: null });
    } catch (err) {
        toast.error("Failed to post assignment");
    } finally {
        setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl p-8 relative animate-in zoom-in-95">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-red-500"><X/></button>
        
        <h2 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-2">
            <Layers className="text-blue-600"/> Create New Assignment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] uppercase font-black text-gray-400 mb-1 block">Title</label>
                    <input required type="text" className="w-full bg-gray-50 rounded-xl px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div>
                    <label className="text-[10px] uppercase font-black text-gray-400 mb-1 block">Subject</label>
                    <input required type="text" placeholder="e.g. Mathematics" className="w-full bg-gray-50 rounded-xl px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] uppercase font-black text-gray-400 mb-1 block">Target Grade</label>
                    <select required className="w-full bg-gray-50 rounded-xl px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})}>
                        <option value="">Select Grade</option>
                        {grades.map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-[10px] uppercase font-black text-gray-400 mb-1 block">Deadline</label>
                    <input required type="date" className="w-full bg-gray-50 rounded-xl px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
                </div>
            </div>

            <div>
                <label className="text-[10px] uppercase font-black text-gray-400 mb-1 block">Instructions</label>
                <textarea rows="3" className="w-full bg-gray-50 rounded-xl px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
            </div>

            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors relative">
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setFormData({...formData, file: e.target.files[0]})} />
                <div className="text-center">
                    <Upload className="mx-auto text-blue-400 mb-2" size={24}/>
                    <p className="text-xs font-bold text-gray-500">{formData.file ? formData.file.name : "Upload Assignment Document (PDF/Doc)"}</p>
                </div>
            </div>

            <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-black shadow-lg hover:bg-blue-700 transition-all flex justify-center items-center gap-2">
                {loading ? <Loader2 className="animate-spin"/> : <CheckCircle size={20}/>} Publish Assignment
            </button>
        </form>
      </div>
    </div>
  );
};

export default AddAssignmentModal;