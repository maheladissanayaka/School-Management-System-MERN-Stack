import React, { useState, useEffect } from 'react';
import { X, BookOpen, Check } from 'lucide-react';
import { updateSubject } from '../services/subjectService';
import { toast } from 'react-toastify';

const EditSubjectModal = ({ isOpen, onClose, refreshData, subject, teachers }) => {
  const [formData, setFormData] = useState({ name: '', code: '', teachers: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (subject) {
      setFormData({
        name: subject.name,
        code: subject.code,
        // Map existing teacher objects to just their IDs for the form logic
        teachers: subject.teachers.map(t => t._id) 
      });
    }
  }, [subject]);

  const toggleTeacher = (teacherId) => {
    setFormData(prev => {
      const isSelected = prev.teachers.includes(teacherId);
      if (isSelected) return { ...prev, teachers: prev.teachers.filter(id => id !== teacherId) };
      return { ...prev, teachers: [...prev.teachers, teacherId] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateSubject(subject._id, formData);
      toast.success("Subject Updated!");
      refreshData();
      onClose();
    } catch (err) {
      toast.error("Failed to update subject");
      console.log("Failed to update subject"+err)
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
            <div className="bg-orange-500 p-2 rounded-xl text-white"><BookOpen size={20}/></div>
            Edit Subject
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} className="text-gray-400"/></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Subject Name</label>
              <input required type="text" className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-orange-500 font-bold text-gray-700 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Subject Code</label>
              <input required type="text" className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-orange-500 font-bold text-gray-700 outline-none" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Assigned Teachers</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                {teachers.map(teacher => (
                  <div 
                    key={teacher._id}
                    onClick={() => toggleTeacher(teacher._id)}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${formData.teachers.includes(teacher._id) ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:border-orange-200'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${formData.teachers.includes(teacher._id) ? 'bg-orange-500 border-orange-500' : 'border-gray-300'}`}>
                      {formData.teachers.includes(teacher._id) && <Check size={12} className="text-white"/>}
                    </div>
                    <span className={`text-sm font-bold truncate ${formData.teachers.includes(teacher._id) ? 'text-orange-700' : 'text-gray-600'}`}>{teacher.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button disabled={loading} type="submit" className="w-full mt-8 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-orange-200 disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditSubjectModal;