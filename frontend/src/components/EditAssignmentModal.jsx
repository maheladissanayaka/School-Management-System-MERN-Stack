import React, { useState, useEffect } from 'react';
import { X, Save, Layers, Upload, Trash2, Loader2, FileText } from 'lucide-react';
import { updateAssignment, deleteAssignment } from '../services/assignmentService';
import API from '../api/axiosInstance'; // To fetch classes
import uploadToCloudinary from '../utils/uploadCloudinary';
import { toast } from 'react-toastify';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "../components/ui/alert-dialog";

const EditAssignmentModal = ({ isOpen, onClose, refreshData, assignment }) => {
  const [formData, setFormData] = useState({
    title: '', description: '', grade: '', subject: '', deadline: '', file: null
  });
  const [existingFile, setExistingFile] = useState('');
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load Data on Open
  useEffect(() => {
    if (isOpen && assignment) {
      // 1. Load Grades List
      API.get('/classes').then(res => setGrades(res.data)).catch(console.error);

      // 2. Pre-fill Form
      setFormData({
        title: assignment.title || '',
        description: assignment.description || '',
        grade: assignment.grade?._id || assignment.grade || '', // Handle populated or unpopulated grade
        subject: assignment.subject || '',
        deadline: assignment.deadline ? new Date(assignment.deadline).toISOString().split('T')[0] : '',
        file: null
      });
      setExistingFile(assignment.fileUrl || '');
    }
  }, [isOpen, assignment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        let fileUrl = existingFile;

        // Upload new file if selected
        if (formData.file) {
            toast.info("Uploading new document...");
            fileUrl = await uploadToCloudinary(formData.file);
        }

        const payload = {
            title: formData.title,
            description: formData.description,
            grade: formData.grade,
            subject: formData.subject,
            deadline: formData.deadline,
            fileUrl // Send the URL (either new or old)
        };

        await updateAssignment(assignment._id, payload);
        toast.success("Assignment Updated!");
        refreshData();
        onClose();
    } catch (err) {
        toast.error(err.response?.data?.msg || "Update failed");
    } finally {
        setLoading(false);
    }
  };

  const handleDelete = async () => {
      try {
          await deleteAssignment(assignment._id);
          toast.success("Assignment Deleted");
          refreshData();
          onClose();
      } catch (err) {
          toast.error("Failed to delete assignment");
      }
  };

  if (!isOpen || !assignment) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl p-8 relative animate-in zoom-in-95">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-red-500"><X/></button>
        
        <div className="flex justify-between items-center mb-6 pr-8">
            <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                <Layers className="text-blue-600"/> Edit Assignment
            </h2>
            
            {/* Delete Button */}
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <button type="button" className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-xl transition-colors">
                        <Trash2 size={20}/>
                    </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-3xl p-8">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Assignment?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <strong>{assignment.title}</strong>? This will also remove all student submissions associated with it.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel className="rounded-xl font-bold">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="rounded-xl bg-red-600 font-bold">Delete Forever</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] uppercase font-black text-gray-400 mb-1 block">Title</label>
                    <input required type="text" className="w-full bg-gray-50 rounded-xl px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div>
                    <label className="text-[10px] uppercase font-black text-gray-400 mb-1 block">Subject</label>
                    <input required type="text" className="w-full bg-gray-50 rounded-xl px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-blue-500"
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

            {/* File Section */}
            <div>
                <label className="text-[10px] uppercase font-black text-gray-400 mb-1 block">Document</label>
                
                {existingFile && !formData.file && (
                    <div className="flex items-center justify-between bg-blue-50 p-3 rounded-xl mb-2 border border-blue-100">
                        <div className="flex items-center gap-2">
                            <FileText size={16} className="text-blue-500"/>
                            <span className="text-xs font-bold text-blue-700">Current File Attached</span>
                        </div>
                        <button type="button" onClick={() => setExistingFile('')} className="text-xs font-bold text-red-400 hover:text-red-600">Remove</button>
                    </div>
                )}

                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors relative">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setFormData({...formData, file: e.target.files[0]})} />
                    <div className="text-center">
                        <Upload className="mx-auto text-blue-400 mb-2" size={24}/>
                        <p className="text-xs font-bold text-gray-500">{formData.file ? formData.file.name : "Upload New File (Overwrites Old)"}</p>
                    </div>
                </div>
            </div>

            <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-black shadow-lg hover:bg-blue-700 transition-all flex justify-center items-center gap-2">
                {loading ? <Loader2 className="animate-spin"/> : <Save size={20}/>} Save Changes
            </button>
        </form>
      </div>
    </div>
  );
};

export default EditAssignmentModal;