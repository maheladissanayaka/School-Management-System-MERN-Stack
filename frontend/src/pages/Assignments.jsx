import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axiosInstance';
import { Plus, BookOpen, Calendar, User, FileText, Clock, ChevronRight, Loader2, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import AddAssignmentModal from '../components/AddAssignmentModal';
import AssignmentDetailModal from '../components/AssignmentDetailModal';
import EditAssignmentModal from '../components/EditAssignmentModal'; // Import Edit Modal
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

const Assignments = () => {
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  // State for viewing full details
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  
  // State for editing
  const [assignmentToEdit, setAssignmentToEdit] = useState(null);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await API.get('/assignments');
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleDelete = async (id, e) => {
      e.stopPropagation(); // Prevent opening the detail modal
      try {
          await API.delete(`/assignments/${id}`);
          toast.success("Assignment Deleted");
          fetchAssignments();
      } catch (err) {
          toast.error("Delete failed");
      }
  };

  const handleEdit = (assign, e) => {
      e.stopPropagation(); // Prevent opening the detail modal
      setAssignmentToEdit(assign);
  };

  if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={48}/></div>;

  return (
    <div className="h-full flex flex-col p-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <FileText className="text-blue-600" size={32}/> 
            {user?.role === 'student' ? 'My Assignments' : 'Class Assignments'}
          </h1>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">
            {user?.role === 'student' ? 'Tasks for your grade' : 'Manage & Review Tasks'}
          </p>
        </div>
        
        {isTeacher && (
          <button onClick={() => setIsAddOpen(true)} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 flex items-center gap-2 shadow-lg hover:-translate-y-1 transition-all">
            <Plus size={20}/> New Assignment
          </button>
        )}
      </div>

      {/* Assignment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-4 no-scrollbar">
        {assignments.length > 0 ? assignments.map(assign => (
          <div 
            key={assign._id} 
            onClick={() => setSelectedAssignment(assign)}
            className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all group relative overflow-hidden flex flex-col"
          >
            {/* Status Badge */}
            <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${new Date(assign.deadline) > new Date() ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
               {new Date(assign.deadline) > new Date() ? 'Active' : 'Closed'}
            </div>

            <div className="mb-4 pr-16"> {/* Add padding right so text doesn't overlap badge */}
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-widest mb-2">
                {assign.subject}
              </span>
              <h3 className="text-xl font-black text-gray-800 leading-tight line-clamp-2">{assign.title}</h3>
            </div>

            <div className="space-y-3 mb-6 flex-1">
              <div className="flex items-center gap-3 text-gray-500">
                <User size={16} className="text-blue-400"/>
                <span className="text-xs font-bold">{assign.teacher?.name || 'Unknown Teacher'}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-500">
                 <BookOpen size={16} className="text-orange-400"/>
                 <span className="text-xs font-bold">Grade: {assign.grade?.name}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-500">
                <Clock size={16} className="text-red-400"/>
                <span className="text-xs font-bold">Due: {new Date(assign.deadline).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
               <span className="text-xs font-bold text-gray-400 group-hover:text-blue-600 transition-colors">View Details</span>
               
               <div className="flex gap-2">
                   {/* Teacher Actions: Edit & Delete */}
                   {isTeacher && (
                       <>
                           <button 
                                onClick={(e) => handleEdit(assign, e)} 
                                className="bg-gray-50 p-2 rounded-full hover:bg-blue-100 text-blue-600 transition-all"
                                title="Edit Assignment"
                           >
                                <Edit size={16}/>
                           </button>
                           
                           <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <button 
                                        onClick={(e) => e.stopPropagation()} // Only stop propagation for trigger
                                        className="bg-gray-50 p-2 rounded-full hover:bg-red-100 text-red-500 transition-all"
                                        title="Delete Assignment"
                                    >
                                        <Trash2 size={16}/>
                                    </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="rounded-3xl p-8">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Assignment?</AlertDialogTitle>
                                        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="mt-4">
                                        <AlertDialogCancel className="rounded-xl font-bold">Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={(e) => handleDelete(assign._id, e)} className="rounded-xl bg-red-600 font-bold">Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                           </AlertDialog>
                       </>
                   )}

                   {/* View Arrow (For everyone) */}
                   <div className="bg-gray-50 p-2 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <ChevronRight size={16}/>
                   </div>
               </div>
            </div>
          </div>
        )) : (
            <div className="col-span-full py-20 text-center text-gray-400 font-bold italic">
                No assignments found.
            </div>
        )}
      </div>

      {/* Modals */}
      <AddAssignmentModal 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
        refreshData={fetchAssignments} 
      />
      
      {/* Detail Modal (View/Submit) */}
      {selectedAssignment && (
        <AssignmentDetailModal 
            isOpen={!!selectedAssignment}
            assignment={selectedAssignment}
            onClose={() => setSelectedAssignment(null)}
            refreshData={fetchAssignments} 
        />
      )}

      {/* Edit Modal */}
      {assignmentToEdit && (
          <EditAssignmentModal
            isOpen={!!assignmentToEdit}
            assignment={assignmentToEdit}
            onClose={() => setAssignmentToEdit(null)}
            refreshData={fetchAssignments}
          />
      )}

    </div>
  );
};

export default Assignments;