import React, { useEffect, useState, useCallback } from 'react';
import { getStudents, deleteUser } from '../services/userService';
import { getAllClasses } from '../services/classService';
import { useAuth } from '../context/AuthContext'; 
import { 
  GraduationCap, Search, UserPlus, Edit, Trash2, 
  Loader2, Filter, User, Printer, ChevronLeft, ChevronRight, Lock
} from 'lucide-react';
import { toast } from 'react-toastify';

import AddUserModal from '../components/AddUserModal'; 
import EditUserModal from '../components/EditUserModal';
import StudentProfile from '../components/StudentProfile';
import ParentProfile from '../components/ParentProfile'; // Import Parent Profile
import StudentIDCard from '../components/StudentIDCard';
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

const Students = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); 
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [genderFilter, setGenderFilter] = useState({ Male: true, Female: true });
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // --- Navigation States ---
  const [viewingStudent, setViewingStudent] = useState(null); 
  const [viewingParent, setViewingParent] = useState(null); 
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchData = useCallback(async () => {
      try {
        setLoading(true);
        const [studentData, classData] = await Promise.all([getStudents(), getAllClasses()]);
        setStudents(Array.isArray(studentData) ? studentData : []);
        setClasses(Array.isArray(classData) ? classData : []);
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Session expired. Please Login again.");
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id) => {
      try {
        await deleteUser(id);
        toast.success("Student record deleted");
        fetchData();
      } catch (err) { 
        toast.error("Delete failed");
      }
  };

  const handlePrint = (student) => {
    const printContent = document.getElementById(`id-card-${student._id}`).innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = `<html><body>${printContent}</body></html>`;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); 
  };

  // --- View Handlers ---
  
  // Switch to Parent Profile
  const handleViewParent = (parent) => {
    setViewingStudent(null);
    setViewingParent(parent);
  };

  // Switch back to Student Profile (from Parent view)
  const handleViewStudent = (student) => {
    setViewingParent(null);
    setViewingStudent(student);
  };

  // --- Filtering & Pagination ---
  const filteredStudents = students.filter(s => {
    const matchesSearch = !searchTerm || 
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.studentId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGrade = selectedGrade === 'All' || s.grade?._id === selectedGrade;
    
    const matchesGender = (genderFilter.Male && s.gender === 'Male') || 
                          (genderFilter.Female && s.gender === 'Female') || 
                          (!s.gender);

    return matchesSearch && matchesGrade && matchesGender;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // --- Conditional Rendering for Profiles ---

  // 1. Show Parent Profile if active
  if (viewingParent) {
    return (
      <ParentProfile 
        parent={viewingParent} 
        onBack={() => setViewingParent(null)} 
        onViewStudent={handleViewStudent} // Navigate back to student
      />
    );
  }

  // 2. Show Student Profile if active
  if (viewingStudent) {
    return (
      <StudentProfile 
        student={viewingStudent} 
        onBack={() => setViewingStudent(null)} 
        onViewParent={handleViewParent} // Navigate to parent
      />
    );
  }

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
      <p className="text-gray-400 font-bold uppercase tracking-widest">Loading...</p>
    </div>
  );

  return (
    <div className="h-full flex flex-col p-6 max-w-7xl mx-auto overflow-hidden">
      
      {/* Header */}
      <div className="shrink-0 flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3"><GraduationCap className="text-blue-600" size={32}/> Student Hub</h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-tight">Total Enrolled: {students.length}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search..." 
                    className="pl-10 pr-4 py-3 bg-white rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-600 outline-none w-full lg:w-64 font-medium" 
                    value={searchTerm} 
                    onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
                />
            </div>
            {isAdmin && (
              <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 font-black shadow-xl hover:bg-blue-700 transition-all">
                  <UserPlus size={20} /> Enroll
              </button>
            )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="shrink-0 flex flex-wrap gap-6 mb-6 bg-white p-4 rounded-[1.5rem] border border-gray-100 shadow-sm items-center">
        <div className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-widest"><Filter size={14}/> Filters:</div>
        <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer select-none group">
                <input type="checkbox" checked={genderFilter.Male} onChange={() => { setGenderFilter(prev => ({...prev, Male: !prev.Male})); setCurrentPage(1); }} className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300" />
                <span className="text-sm font-black text-gray-600 uppercase group-hover:text-blue-600 transition-colors">Male</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none group">
                <input type="checkbox" checked={genderFilter.Female} onChange={() => { setGenderFilter(prev => ({...prev, Female: !prev.Female})); setCurrentPage(1); }} className="w-5 h-5 rounded text-pink-600 focus:ring-pink-500 border-gray-300" />
                <span className="text-sm font-black text-gray-600 uppercase group-hover:text-pink-600 transition-colors">Female</span>
            </label>
        </div>
        <select value={selectedGrade} onChange={e => { setSelectedGrade(e.target.value); setCurrentPage(1); }} className="bg-gray-50 border-none rounded-xl px-4 py-2 font-bold text-gray-500 outline-none focus:ring-2 focus:ring-blue-100">
            <option value="All">All Grades</option>
            {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
      </div>

      {/* Main Table */}
      <div className="flex-1 flex flex-col bg-white rounded-[2rem] border border-gray-100 shadow-2xl overflow-hidden min-h-0">
        <div className="flex-1 overflow-auto no-scrollbar">
          <table className="w-full text-left min-w-[1000px]">
            <thead className="bg-gray-50/50 border-b border-gray-100 sticky top-0 z-10 backdrop-blur-sm">
              <tr>
                <th className="px-6 py-5 font-black text-gray-400 uppercase text-[10px] tracking-widest text-center">Profile</th>
                <th className="px-6 py-5 font-black text-gray-400 uppercase text-[10px] tracking-widest">Student ID</th>
                <th className="px-6 py-5 font-black text-gray-400 uppercase text-[10px] tracking-widest">Full Name</th>
                <th className="px-6 py-5 font-black text-gray-400 uppercase text-[10px] tracking-widest">Grade</th>
                <th className="px-6 py-5 font-black text-gray-400 uppercase text-[10px] tracking-widest text-center">Gender</th>
                <th className="px-6 py-5 font-black text-gray-400 uppercase text-[10px] tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentStudents.length > 0 ? currentStudents.map(student => (
                <tr key={student._id} className="hover:bg-blue-50/20 transition-all group">
                  <td className="px-6 py-3 text-center">
                    <div 
                        className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center border-2 border-white shadow-md cursor-pointer overflow-hidden mx-auto hover:scale-110 hover:ring-4 hover:ring-blue-100 hover:border-blue-500 transition-all duration-300 relative group/img"
                        onClick={() => setViewingStudent(student)}
                        title="Click to view full profile"
                    >
                      {student.image ? <img src={student.image} className="w-full h-full object-cover" alt="p" /> : <User className="text-gray-300 group-hover/img:text-blue-500 transition-colors" size={24} />}
                    </div>
                  </td>
                  <td className="px-6 py-3 font-black text-blue-600 tracking-tighter uppercase text-xs">{student.studentId || 'N/A'}</td>
                  <td className="px-6 py-3 font-bold text-gray-800 text-sm">{student.name}</td>
                  <td className="px-6 py-3"><span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold uppercase border border-gray-200">{student.grade?.name || 'Unassigned'}</span></td>
                  <td className="px-6 py-3 text-center"><span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${student.gender === 'Male' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>{student.gender || 'N/A'}</span></td>
                  <td className="px-6 py-3">
                    {isAdmin ? (
                        <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => handlePrint(student)} className="p-2 text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"><Printer size={16}/></button>
                        <button onClick={() => { setSelectedStudent(student); setIsEditModalOpen(true); }} className="p-2 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Edit size={16}/></button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild><button className="p-2 text-red-500 bg-red-50 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={16}/></button></AlertDialogTrigger>
                            <AlertDialogContent className="rounded-3xl border-none shadow-2xl p-8">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-2xl font-black text-gray-800">Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-500 font-medium py-2">This action cannot be undone. This will permanently delete the student record for <strong>{student.name}</strong> from our servers.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="gap-3 mt-4">
                                <AlertDialogCancel className="rounded-xl border-gray-100 font-bold px-6 py-5">Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(student._id)} className="rounded-xl bg-red-600 hover:bg-red-700 font-bold px-6 py-5 shadow-lg shadow-red-100">Continue</AlertDialogAction>
                            </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        </div>
                    ) : (
                        <div className="flex justify-center items-center text-gray-300">
                             <Lock size={14} className="mr-1"/> <span className="text-[10px] font-bold uppercase">View Only</span>
                        </div>
                    )}
                    <div id={`id-card-${student._id}`} className="hidden"><StudentIDCard student={student} /></div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="px-6 py-20 text-center text-gray-400 font-bold italic">No students found. Check your filters or log in again.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {filteredStudents.length > 0 && (
            <div className="shrink-0 p-3 flex items-center justify-between border-t border-gray-100 bg-gray-50/50">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-2">
                    Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredStudents.length)} of {filteredStudents.length}
                </span>
                <div className="flex gap-1.5">
                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"><ChevronLeft size={14} /></button>
                    <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button key={i + 1} onClick={() => paginate(i + 1)} className={`w-8 h-8 rounded-lg font-bold text-[10px] transition-all shadow-sm flex items-center justify-center ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{i + 1}</button>
                        ))}
                    </div>
                    <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"><ChevronRight size={14} /></button>
                </div>
            </div>
        )}
      </div>

      <AddUserModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} refreshData={fetchData} defaultRole="student" classes={classes} />
      {selectedStudent && <EditUserModal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedStudent(null); }} refreshData={fetchData} user={selectedStudent} classes={classes} />}
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Students;