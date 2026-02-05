import React, { useEffect, useState, useCallback } from 'react';
import { getAllClasses, createClass, updateClass, deleteClass } from '../services/classService';
import { getTeachers } from '../services/userService'; 
// 1. IMPORT USEAUTH
import { useAuth } from '../context/AuthContext';
import { 
  Layers, Plus, Search, Loader2, X, Save, Edit, Trash2, 
  ChevronLeft, ChevronRight, Lock 
} from 'lucide-react';
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

const Classes = () => {
  // 2. CHECK USER ROLE
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Show 6 cards per page

  // Form State
  const [formData, setFormData] = useState({ name: '', classTeacher: '', roomNumber: '' });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [classData, teacherData] = await Promise.all([
        getAllClasses(),
        getTeachers() 
      ]);

      setClasses(Array.isArray(classData) ? classData : []);
      setTeachers(Array.isArray(teacherData) ? teacherData : []); 
      
    } catch (err) {
      toast.error("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateClass(editingId, formData);
        toast.success("Class updated successfully");
      } else {
        await createClass(formData);
        toast.success("New class created");
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({ name: '', classTeacher: '', roomNumber: '' });
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Operation failed");
    }
  };

  const handleEdit = (cls) => {
    setEditingId(cls._id);
    setFormData({
      name: cls.name,
      classTeacher: cls.classTeacher?._id || '',
      roomNumber: cls.roomNumber || ''
    });
    setShowModal(true);
  };

  const confirmDelete = async (id) => {
    try {
      await deleteClass(id);
      toast.success("Class deleted successfully");
      loadData();
    } catch (err) {
      toast.error("Delete failed");
      console.error(err);
    }
  };

  // 1. Filter Logic
  const filteredClasses = classes.filter(cls => 
    cls.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClasses = filteredClasses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Reset to page 1 when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading) return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={32} /></div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-black text-gray-800 flex items-center gap-2">
          <Layers className="text-blue-600" size={32} /> Class Management
        </h1>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" placeholder="Search classes..."
              className="pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64 font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* 3. ADMIN ONLY: CREATE BUTTON */}
          {isAdmin && (
            <button 
                onClick={() => { setEditingId(null); setFormData({name:'', classTeacher:'', roomNumber:''}); setShowModal(true); }}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg hover:bg-blue-700 transition-all"
            >
                <Plus size={20} /> New Class
            </button>
          )}
        </div>
      </div>

      {/* Class Cards Grid (Paginated) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {currentClasses.length > 0 ? (
            currentClasses.map((cls) => (
            <div key={cls._id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 group relative">
                
                {/* 4. ADMIN ONLY: ACTION BUTTONS */}
                <div className="absolute top-4 right-4 flex gap-2">
                    {isAdmin ? (
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(cls)} className="p-2 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 hover:scale-110 transition-transform"><Edit size={16}/></button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                <button className="p-2 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 hover:scale-110 transition-transform">
                                    <Trash2 size={16}/>
                                </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="rounded-2xl border-none shadow-2xl p-8">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-xl font-black text-gray-800">Delete Class?</AlertDialogTitle>
                                    <AlertDialogDescription className="text-gray-500 font-medium py-2">
                                    Are you sure you want to delete <strong>{cls.name}</strong>? This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="gap-3 mt-4">
                                    <AlertDialogCancel className="rounded-xl border-gray-100 font-bold px-6 py-5">Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                    onClick={() => confirmDelete(cls._id)} 
                                    className="rounded-xl bg-red-600 hover:bg-red-700 font-bold px-6 py-5 shadow-lg shadow-red-100"
                                    >
                                    Delete Class
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    ) : (
                        <div className="p-2 text-gray-300">
                             <Lock size={16} />
                        </div>
                    )}
                </div>

                <h3 className="text-xl font-black text-gray-800 mb-1">{cls.name}</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Room: {cls.roomNumber || 'N/A'}</p>
                
                <div className="flex items-center gap-3 text-sm font-bold text-gray-600 bg-gray-50 p-3 rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center text-sm font-black uppercase shadow-sm border border-gray-100">
                    {cls.classTeacher?.name ? cls.classTeacher.name[0] : '?'}
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider">Class Teacher</span>
                    <span>{cls.classTeacher?.name || 'Not Assigned'}</span>
                </div>
                </div>
            </div>
            ))
        ) : (
            <div className="col-span-3 text-center py-20 text-gray-400 font-bold">No classes found.</div>
        )}
      </div>

      {/* Pagination Footer */}
      {filteredClasses.length > itemsPerPage && (
        <div className="flex justify-center gap-2 mt-8">
            <button 
                onClick={() => paginate(currentPage - 1)} 
                disabled={currentPage === 1}
                className="p-3 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-blue-50 disabled:opacity-50 transition-all"
            >
                <ChevronLeft size={20} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
                <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`w-12 h-12 rounded-xl font-bold text-sm transition-all shadow-sm ${
                        currentPage === i + 1 
                        ? 'bg-blue-600 text-white shadow-blue-200 scale-110' 
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    {i + 1}
                </button>
            ))}
            <button 
                onClick={() => paginate(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="p-3 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-blue-50 disabled:opacity-50 transition-all"
            >
                <ChevronRight size={20} />
            </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300 border border-white/20">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-gray-800">{editingId ? 'Edit Class' : 'New Class'}</h2>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Manage Class Details</p>
              </div>
              <button onClick={() => setShowModal(false)} className="bg-gray-50 p-2 rounded-full text-gray-400 hover:text-red-500 transition-colors"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-gray-400 uppercase ml-1">Class Name</label>
                <input type="text" required placeholder="e.g. Grade 10-A" className="w-full bg-gray-50 border-none p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-700 placeholder:text-gray-300 transition-all"
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-black text-gray-400 uppercase ml-1">Assign Class Teacher</label>
                <select 
                  required 
                  className="w-full bg-gray-50 border-none p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-700 transition-all appearance-none"
                  value={formData.classTeacher} 
                  onChange={(e) => setFormData({...formData, classTeacher: e.target.value})}
                >
                  <option value="">-- Select Teacher --</option>
                  {teachers.map(t => (
                    <option key={t._id} value={t._id}>{t.name} ({t.teacherId})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-black text-gray-400 uppercase ml-1">Room Number</label>
                <input type="text" placeholder="e.g. 402" className="w-full bg-gray-50 border-none p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-700 placeholder:text-gray-300 transition-all"
                  value={formData.roomNumber} onChange={(e) => setFormData({...formData, roomNumber: e.target.value})} />
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-700 active:scale-95 transition-all shadow-xl shadow-blue-100 mt-4">
                <Save size={20} /> {editingId ? 'Update Class' : 'Create Class'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Classes;