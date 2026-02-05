import React, { useState, useEffect } from 'react';
import { X, Download, FileText, Calendar, Clock, UploadCloud, Check, User, ShieldAlert, Loader2, Eye, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axiosInstance';
import uploadToCloudinary from '../utils/uploadCloudinary';
import { toast } from 'react-toastify';

const AssignmentDetailModal = ({ assignment, onClose, refreshData }) => {
  const { user } = useAuth();
  const isStudent = user?.role === 'student';
  const isVisitor = user?.role === 'visitor';
  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';

  const [submissionFile, setSubmissionFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  const deadlineDate = new Date(assignment.deadline);
  const isExpired = deadlineDate < new Date();
  const isPortalClosed = !assignment.isPortalOpen || isExpired;

  // 🛠️ FIX: Robust check for student ID (Matches Object or String)
  const mySubmission = assignment.submissions?.find(s => {
      const studentId = s.student?._id || s.student; // Handle populated vs unpopulated
      return studentId?.toString() === user?._id?.toString();
  });

  // Countdown Logic
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = deadlineDate - now;

      if (difference <= 0) {
        setTimeLeft('Expired');
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        
        if(days > 0) setTimeLeft(`${days}d ${hours}h left`);
        else if(hours > 0) setTimeLeft(`${hours}h ${minutes}m left`);
        else setTimeLeft(`${minutes}m left`);
      }
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, [assignment.deadline]);

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    if (!submissionFile) return toast.warning("Please attach a file!");

    setSubmitting(true);
    try {
        toast.info("Uploading document...");
        const url = await uploadToCloudinary(submissionFile);
        if (!url) throw new Error("Upload failed");
        
        await API.post(`/assignments/${assignment._id}/submit`, {
            fileUrl: url,
            remarks: "Submitted via Portal"
        });

        toast.success("Assignment Submitted Successfully!");
        refreshData(); 
        setSubmissionFile(null);
        onClose(); // Close modal on success
    } catch (err) {
        console.error(err);
        toast.error("Submission failed. Check your file.");
    } finally {
        setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-in zoom-in-95">
        
        {/* LEFT SIDE: DETAILS */}
        <div className="p-8 md:w-1/2 overflow-y-auto custom-scrollbar border-r border-gray-100">
            <div className="mb-6">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide">{assignment.subject}</span>
                <h2 className="text-3xl font-black text-gray-800 mt-3 leading-tight">{assignment.title}</h2>
            </div>

            <div className="space-y-6">
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Instructions</h4>
                    <p className="text-gray-700 font-medium leading-relaxed whitespace-pre-wrap">{assignment.description || "No specific instructions."}</p>
                </div>

                <div className="flex gap-4">
                    <div className="flex-1 bg-orange-50 p-4 rounded-2xl border border-orange-100">
                        <div className="flex items-center gap-2 text-orange-600 mb-1"><User size={16}/><span className="text-[10px] font-black uppercase">Teacher</span></div>
                        <p className="font-bold text-gray-800">{assignment.teacher?.name}</p>
                    </div>
                    <div className="flex-1 bg-purple-50 p-4 rounded-2xl border border-purple-100 relative overflow-hidden">
                        <div className="flex items-center gap-2 text-purple-600 mb-1"><Calendar size={16}/><span className="text-[10px] font-black uppercase">Deadline</span></div>
                        <p className="font-bold text-gray-800">{deadlineDate.toLocaleDateString()}</p>
                        {!isExpired && <div className="absolute top-0 right-0 bg-purple-200 text-purple-800 text-[10px] font-black px-3 py-1 rounded-bl-xl">{timeLeft}</div>}
                    </div>
                </div>

                {/* TEACHER DOCUMENT DOWNLOAD BUTTON */}
                {assignment.fileUrl && (
                    <a href={assignment.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-blue-600 text-white p-4 rounded-2xl shadow-lg hover:bg-blue-700 transition-all group mt-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-lg"><FileText size={20}/></div>
                            <div>
                                <p className="text-xs font-bold opacity-80 uppercase">Assignment Material</p>
                                <p className="font-bold">Download Attachment</p>
                            </div>
                        </div>
                        <Download size={20} className="group-hover:translate-y-1 transition-transform"/>
                    </a>
                )}
            </div>
        </div>

        {/* RIGHT SIDE: PORTAL */}
        <div className="bg-slate-50 p-8 md:w-1/2 flex flex-col relative">
            <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 bg-white p-2 rounded-full shadow-sm"><X size={20}/></button>

            <div className="mt-8 flex-1 flex flex-col">
                <h3 className="text-xl font-black text-gray-800 mb-4 flex items-center gap-2">
                    {isStudent ? <UploadCloud className="text-blue-600"/> : isTeacher ? <User className="text-orange-500"/> : <ShieldAlert className="text-gray-400"/>} 
                    {isStudent ? "Submission Portal" : isTeacher ? "Student Submissions" : "Status"}
                </h3>

                {/* 1. VISITOR */}
                {isVisitor && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 p-6 border-2 border-dashed border-gray-200 rounded-2xl">
                        <Eye size={40} className="mb-2 text-gray-300"/>
                        <h4 className="text-lg font-bold text-gray-500 mb-1">View Only Mode</h4>
                        <p className="text-xs font-medium">Please login as a student to submit work.</p>
                    </div>
                )}

                {/* 2. TEACHER LIST */}
                {isTeacher && (
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {assignment.submissions?.length > 0 ? (
                            <div className="space-y-3">
                                {assignment.submissions.map((sub) => (
                                    <div key={sub._id} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold shrink-0">
                                                {sub.student?.name ? sub.student.name.charAt(0) : 'S'}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-gray-800 truncate">{sub.student?.name || 'Unknown'}</p>
                                                <p className="text-[10px] text-gray-400">{new Date(sub.submittedAt).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <a href={sub.fileUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors" title="View Document">
                                            <Eye size={18}/>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400">
                                <User size={40} className="mb-2 text-gray-300"/>
                                <p className="text-sm font-bold">No submissions yet.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* 3. STUDENT PORTAL */}
                {isStudent && (
                    isPortalClosed ? (
                        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center flex-1 flex flex-col justify-center items-center">
                            <Clock size={40} className="text-red-400 mb-3"/>
                            <h4 className="text-lg font-black text-red-600 mb-1">Portal Closed</h4>
                            <p className="text-xs font-bold text-red-400">Deadline passed or closed by teacher.</p>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col">
                            {/* GREEN SUCCESS BOX */}
                            {mySubmission ? (
                                <div className="flex-1 flex flex-col items-center justify-center bg-emerald-50 rounded-2xl border-2 border-emerald-100 p-6 text-center animate-in zoom-in-95">
                                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
                                        <Check size={32} />
                                    </div>
                                    <h4 className="text-xl font-black text-emerald-800 mb-2">Submitted!</h4>
                                    <p className="text-xs font-bold text-emerald-600 mb-6">Your work has been uploaded.</p>
                                    
                                    <a href={mySubmission.fileUrl} target="_blank" rel="noopener noreferrer" className="w-full bg-white border border-emerald-200 text-emerald-700 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors mb-6">
                                        <Eye size={16}/> View Your Submission
                                    </a>

                                    {/* REPLACE FORM */}
                                    <div className="w-full border-t border-emerald-200 pt-6">
                                        <p className="text-[10px] font-bold text-emerald-600 mb-3 uppercase tracking-widest text-left">Update / Replace File</p>
                                        <form onSubmit={handleStudentSubmit} className="flex flex-col gap-3">
                                            <label className="w-full border-2 border-dashed border-emerald-300 bg-white rounded-xl flex items-center justify-center cursor-pointer hover:bg-emerald-50 transition-all p-4 group">
                                                <input type="file" className="hidden" onChange={e => setSubmissionFile(e.target.files[0])} />
                                                <div className="flex items-center gap-2 text-emerald-600">
                                                    <RefreshCw size={16} className={`group-hover:rotate-180 transition-transform duration-500 ${submissionFile ? 'text-emerald-700' : ''}`}/>
                                                    <span className="text-xs font-bold">{submissionFile ? submissionFile.name : "Click to Replace File"}</span>
                                                </div>
                                            </label>
                                            
                                            {submissionFile && (
                                                <button disabled={submitting} type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-black shadow-lg hover:bg-emerald-700 transition-all flex justify-center items-center gap-2 text-xs">
                                                    {submitting ? <Loader2 className="animate-spin" size={16}/> : "Confirm Replacement"}
                                                </button>
                                            )}
                                        </form>
                                    </div>
                                </div>
                            ) : (
                                /* INITIAL UPLOAD FORM */
                                <form onSubmit={handleStudentSubmit} className="flex-1 flex flex-col justify-center">
                                    <label className="flex-1 border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-all p-6 text-center group">
                                        <input type="file" className="hidden" onChange={e => setSubmissionFile(e.target.files[0])} />
                                        <div className="flex flex-col items-center">
                                            <UploadCloud size={48} className="text-blue-300 group-hover:text-blue-500 mb-4 transition-colors"/>
                                            <p className="text-sm font-black text-gray-600 mb-1">{submissionFile ? submissionFile.name : "Click to Upload Work"}</p>
                                            <p className="text-[10px] font-bold text-gray-400">PDF, Word, Images supported</p>
                                        </div>
                                    </label>
                                    <button disabled={submitting} type="submit" className="mt-6 w-full bg-blue-600 text-white py-4 rounded-xl font-black shadow-lg hover:bg-blue-700 transition-all flex justify-center items-center gap-2">
                                        {submitting ? <Loader2 className="animate-spin"/> : "Submit Assignment"}
                                    </button>
                                </form>
                            )}
                        </div>
                    )
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default AssignmentDetailModal;