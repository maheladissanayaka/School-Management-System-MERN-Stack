import React, { useState, useEffect } from 'react';
import { X, BookOpen, Check } from 'lucide-react';
import { createSubject } from '../services/subjectService';
import { toast } from 'react-toastify';

const AddSubjectModal = ({ isOpen, onClose, refreshData, teachers }) => {
  const [formData, setFormData] = useState({ name: '', code: '', teachers: [] });
  const [loading, setLoading] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) setFormData({ name: '', code: '', teachers: [] });
  }, [isOpen]);

  const toggleTeacher = (teacherId) => {
    setFormData(prev => {
      const isSelected = prev.teachers.includes(teacherId);
      if (isSelected) {
        return { ...prev, teachers: prev.teachers.filter(id => id !== teacherId) };
      } else {
        return { ...prev, teachers: [...prev.teachers, teacherId] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createSubject(formData);
      toast.success("Subject Created Successfully!");
      refreshData();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to create subject");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl text-white"><BookOpen size={20}/></div>
            New Subject
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} className="text-gray-400"/></button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Subject Name</label>
              <input required type="text" className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-700 outline-none transition-all" placeholder="e.g. Mathematics" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Subject Code</label>
              <input required type="text" className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-700 outline-none transition-all" placeholder="e.g. MATH101" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Assign Teachers</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                {teachers.map(teacher => (
                  <div 
                    key={teacher._id}
                    onClick={() => toggleTeacher(teacher._id)}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${formData.teachers.includes(teacher._id) ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-blue-200'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${formData.teachers.includes(teacher._id) ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                      {formData.teachers.includes(teacher._id) && <Check size={12} className="text-white"/>}
                    </div>
                    <span className={`text-sm font-bold truncate ${formData.teachers.includes(teacher._id) ? 'text-blue-700' : 'text-gray-600'}`}>{teacher.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button disabled={loading} type="submit" className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-200 disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Subject'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSubjectModal;