import React, { useEffect, useState, useCallback } from 'react';
import { getSubjects, deleteSubject } from '../services/subjectService';
import { getTeachers } from '../services/userService'; 
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, Search, Plus, Edit, Trash2, 
  Loader2, ChevronLeft, ChevronRight, User, Lock 
} from 'lucide-react';
import { toast } from 'react-toastify';
import AddSubjectModal from '../components/AddSubjectModal';
import EditSubjectModal from '../components/EditSubjectModal';
import TeacherProfile from '../components/TeacherProfile';
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

const Subjects = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  // Check if user is allowed to view detailed profiles (Admin or Visitor only)
  const canViewProfile = ['admin', 'visitor'].includes(user?.role);

  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [viewingTeacher, setViewingTeacher] = useState(null); 

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [subjectData, teacherData] = await Promise.all([getSubjects(), getTeachers()]);
      setSubjects(Array.isArray(subjectData) ? subjectData : []);
      setTeachers(Array.isArray(teacherData) ? teacherData : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  const handleDelete = async (id) => {
    try {
      await deleteSubject(id);
      toast.success("Subject deleted");
      fetchData();
    } catch (err) {
      toast.error("Delete failed");
      console.log("Delete failed"+err)
    }
  };

  const handleEdit = (subject) => {
    setSelectedSubject(subject);
    setIsEditOpen(true);
  };

  // --- 1. Teacher Click Handler (With Role Check) ---
  const handleViewTeacher = (teacher) => {
    if (canViewProfile) {
      setViewingTeacher(teacher);
    } else {
      toast.error("Access Restricted: Only Admins and Visitors can view teacher profiles.");
    }
  };

  const filteredSubjects = subjects.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSubjects = filteredSubjects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSubjects.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (viewingTeacher) {
    return <TeacherProfile teacher={viewingTeacher} onBack={() => setViewingTeacher(null)} />;
  }

  if (loading) return <div className="h-full flex flex-col items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;

  return (
    <div className="h-full flex flex-col p-6 max-w-7xl mx-auto overflow-hidden">
      
      {/* Header */}
      <div className="shrink-0 flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <BookOpen className="text-blue-600" size={32}/> Subjects
          </h1>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">
            Total Subjects: {subjects.length}
          </p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
           <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
              <input 
                type="text" 
                placeholder="Search subjects..." 
                className="pl-10 pr-4 py-3 rounded-xl border-none w-full md:w-64 font-bold outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
              />
           </div>
           {isAdmin && (
             <button onClick={() => setIsAddOpen(true)} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-200 hover:-translate-y-1 transition-all">
                <Plus size={20}/> New Subject
             </button>
           )}
        </div>
      </div>

      {/* Grid Container */}
      <div className="flex-1 overflow-y-auto no-scrollbar min-h-0 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentSubjects.length > 0 ? currentSubjects.map(subject => (
            <div key={subject._id} className="bg-white rounded-[2.5rem] p-6 shadow-sm hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-gray-100 flex flex-col group relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500 z-0"></div>
               
               <div className="relative z-10 flex justify-between items-start mb-4">
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-2xl">
                     <BookOpen size={24} />
                  </div>
                  {isAdmin && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => handleEdit(subject)} className="p-2 bg-white text-blue-600 rounded-xl hover:bg-blue-50 shadow-sm"><Edit size={16}/></button>
                       <AlertDialog>
                          <AlertDialogTrigger asChild><button className="p-2 bg-white text-red-500 rounded-xl hover:bg-red-50 shadow-sm"><Trash2 size={16}/></button></AlertDialogTrigger>
                          <AlertDialogContent className="rounded-3xl p-8">
                             <AlertDialogHeader>
                                <AlertDialogTitle>Delete Subject?</AlertDialogTitle>
                                <AlertDialogDescription>This will remove <strong>{subject.name}</strong> permanently.</AlertDialogDescription>
                             </AlertDialogHeader>
                             <AlertDialogFooter className="mt-4">
                                <AlertDialogCancel className="rounded-xl font-bold">Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(subject._id)} className="rounded-xl bg-red-600 font-bold">Delete</AlertDialogAction>
                             </AlertDialogFooter>
                          </AlertDialogContent>
                       </AlertDialog>
                    </div>
                  )}
               </div>

               <div className="relative z-10 mb-6">
                  <h3 className="text-xl font-black text-gray-800 leading-tight mb-1">{subject.name}</h3>
                  <span className="inline-block px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-500 uppercase tracking-widest border border-gray-200">
                    {subject.code}
                  </span>
               </div>

               {/* Teachers Section */}
               <div className="relative z-10 mt-auto border-t border-gray-100 pt-4">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                    <User size={12}/> Instructors
                  </p>
                  <div className="flex flex-col gap-2">
                     {subject.teachers && subject.teachers.length > 0 ? subject.teachers.map(teacher => (
                        <div 
                            key={teacher._id} 
                            // 2. Updated Click Logic
                            onClick={() => handleViewTeacher(teacher)}
                            className={`flex items-center gap-3 p-1 rounded-xl transition-colors ${canViewProfile ? 'cursor-pointer hover:bg-slate-50 group/item' : 'cursor-not-allowed opacity-80'}`}
                        >
                           <div className="w-8 h-8 rounded-full border border-gray-200 bg-white p-0.5 shrink-0 relative">
                              {teacher.image ? <img src={teacher.image} className="w-full h-full rounded-full object-cover" alt=""/> : <User className="w-full h-full p-1.5 text-gray-300"/>}
                              {/* Show lock icon if not allowed */}
                              {!canViewProfile && (
                                <div className="absolute -bottom-1 -right-1 bg-gray-100 rounded-full p-0.5 border border-white">
                                    <Lock size={8} className="text-gray-400"/>
                                </div>
                              )}
                           </div>
                           <span className={`text-xs font-bold text-gray-600 ${canViewProfile ? 'group-hover/item:text-blue-600' : ''}`}>{teacher.name}</span>
                        </div>
                     )) : (
                        <span className="text-xs text-gray-300 italic font-medium">No instructors assigned</span>
                     )}
                  </div>
               </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center">
                <p className="text-gray-400 font-bold text-lg">No subjects found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination (Compact & Fixed) */}
      {filteredSubjects.length > 0 && (
        <div className="shrink-0 p-3 mt-4 flex items-center justify-between border-t border-gray-100 bg-white/50 backdrop-blur-sm rounded-xl">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-2">
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredSubjects.length)} of {filteredSubjects.length}
            </span>
            <div className="flex gap-1.5">
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-blue-50 disabled:opacity-50 transition-all shadow-sm"><ChevronLeft size={14} /></button>
                <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button key={i + 1} onClick={() => paginate(i + 1)} className={`w-8 h-8 rounded-lg font-bold text-[10px] transition-all shadow-sm flex items-center justify-center ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{i + 1}</button>
                    ))}
                </div>
                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-blue-50 disabled:opacity-50 transition-all shadow-sm"><ChevronRight size={14} /></button>
            </div>
        </div>
      )}

      {/* Modals */}
      <AddSubjectModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} refreshData={fetchData} teachers={teachers} />
      {selectedSubject && <EditSubjectModal isOpen={isEditOpen} onClose={() => { setIsEditOpen(false); setSelectedSubject(null); }} refreshData={fetchData} subject={selectedSubject} teachers={teachers} />}
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Subjects;