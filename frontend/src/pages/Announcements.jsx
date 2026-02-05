import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Megaphone, Plus, X, Send, Loader2, Edit, Trash2, 
  Calendar, Target, Info, Filter, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { getAllAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../services/announceService';
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

const Announcements = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Filter State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2); // View 2 items per page
  const [audienceFilter, setAudienceFilter] = useState('All'); 

  // Modal & Form State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null); 
  const [formData, setFormData] = useState({ title: '', content: '', targetRoles: [] });

  const fetchNotices = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllAnnouncements();
      setAnnouncements(Array.isArray(data) ? data : []);
    } catch (err) { 
      console.error("Failed to load announcements:", err); 
      toast.error("Failed to load notice board");
    } finally {
      setLoading(false); 
    }
  }, []);

  useEffect(() => { 
    fetchNotices(); 
  }, [fetchNotices]);

  // --- Filter Logic ---
  const filteredAnnouncements = announcements.filter(item => {
    if (audienceFilter === 'All') return true;
    return item.targetRoles.includes(audienceFilter.toLowerCase()) || item.targetRoles.includes('all');
  });

  // --- Pagination Logic ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAnnouncements = filteredAnnouncements.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // --- Form Handlers ---
  const handleCheckbox = (role) => {
    setFormData(prev => ({
      ...prev,
      targetRoles: prev.targetRoles.includes(role)
        ? prev.targetRoles.filter(r => r !== role)
        : [...prev.targetRoles, role]
    }));
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      title: item.title,
      content: item.content,
      targetRoles: item.targetRoles || []
    });
    setShowModal(true);
  };

  const confirmDelete = async (id) => {
    try {
      await deleteAnnouncement(id);
      toast.success("Notice deleted successfully");
      fetchNotices();
    } catch (err) { 
      toast.error("Delete failed: " + (err.message || "Server Error"));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.targetRoles.length === 0) {
      toast.warning("Please select at least one target audience");
      return;
    }
    
    try {
      if (editingId) {
        await updateAnnouncement(editingId, formData);
        toast.success("Announcement updated!");
      } else {
        await createAnnouncement(formData);
        toast.success("Notice published!");
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({ title: '', content: '', targetRoles: [] });
      fetchNotices(); 
    } catch (err) { 
      toast.error("Save failed: " + (err.response?.data?.error || "Server Error")); 
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: 'bg-purple-50 text-purple-600 border-purple-100',
      teacher: 'bg-blue-50 text-blue-600 border-blue-100',
      student: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      visitor: 'bg-orange-50 text-orange-600 border-orange-100',
      all: 'bg-slate-100 text-slate-600 border-slate-200'
    };
    return colors[role] || colors.all;
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Fetching notices...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col p-6 max-w-5xl mx-auto overflow-hidden">
      
      {/* Header - Fixed */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-blue-200 shadow-lg">
                <Megaphone className="text-white" size={24} />
            </div>
            Notice Board
          </h1>
          <p className="text-gray-500 mt-1 font-medium text-sm">Stay updated with the latest news</p>
        </div>
        
        {user?.role === 'admin' && (
          <button 
            onClick={() => {
              setEditingId(null);
              setFormData({ title: '', content: '', targetRoles: [] });
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-blue-700 active:scale-95 transition-all shadow-xl shadow-blue-100 font-bold"
          >
            <Plus size={20} /> New Announcement
          </button>
        )}
      </div>

      {/* Filter Bar - Fixed */}
      <div className="flex flex-wrap gap-4 mb-6 bg-white p-4 rounded-[1.5rem] border border-gray-100 shadow-sm items-center shrink-0">
        <div className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-widest">
            <Filter size={14}/> Filter Audience:
        </div>
        <div className="flex items-center gap-2">
            {['All', 'Teacher', 'Student', 'Visitor'].map((role) => (
                <button
                    key={role}
                    onClick={() => { setAudienceFilter(role); setCurrentPage(1); }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                        audienceFilter === role 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                >
                    {role}
                </button>
            ))}
        </div>
      </div>

      {/* Content List - Scrollable with Hidden Scrollbar */}
      {/* 'scrollbar-none' is a custom utility often used, or we use CSS to hide it */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-6 pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {/* Inline style ensures scrollbar is hidden in Firefox/IE/Edge. Webkit style handled by Tailwind plugin usually or custom CSS */}
        <style>{`
            .scrollbar-hide::-webkit-scrollbar {
                display: none;
            }
        `}</style>

        {currentAnnouncements.length > 0 ? (
          currentAnnouncements.map((item) => (
            <div key={item._id} className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 relative group overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-xl text-gray-800 group-hover:text-blue-600 transition-colors capitalize">{item.title}</h3>
                  <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                    <Calendar size={14} />
                    {new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </div>
                </div>
                
                {user?.role === 'admin' && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      onClick={() => handleEdit(item)}
                      className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all hover:scale-110"
                      title="Edit Notice"
                    >
                      <Edit size={18} />
                    </button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button 
                          className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all hover:scale-110"
                          title="Delete Notice"
                        >
                          <Trash2 size={18} />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-3xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the notice 
                            "<strong>{item.title}</strong>".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => confirmDelete(item._id)}
                            className="bg-red-600 hover:bg-red-700 rounded-xl"
                          >
                            Delete Notice
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50/50 p-4 rounded-2xl mb-5">
                <p className="text-gray-600 text-[15px] leading-relaxed whitespace-pre-wrap">{item.content}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-gray-400 font-bold text-[11px] uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-lg">
                    <Target size={12} /> Targeted To:
                </div>
                <div className="flex flex-wrap gap-2">
                    {item.targetRoles && item.targetRoles.length > 0 ? (
                    item.targetRoles.map(r => (
                        <span key={r} className={`text-[11px] px-3 py-1 rounded-full uppercase font-bold tracking-tight border ${getRoleColor(r)} transition-transform hover:scale-105`}>
                        {r}
                        </span>
                    ))
                    ) : (
                    <span className="text-[11px] bg-slate-50 text-slate-400 px-3 py-1 rounded-full uppercase font-bold border border-slate-100">General</span>
                    )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-gray-100 h-full flex flex-col items-center justify-center">
              <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Info className="text-gray-300" size={32} />
              </div>
              <p className="text-gray-400 font-medium">No announcements found for this filter.</p>
          </div>
        )}
      </div>

      {/* Pagination Footer - Fixed */}
      {filteredAnnouncements.length > 0 && (
        <div className="py-4 p-4 rounded-3xl mt-2 border-t border-gray-100 flex items-center justify-between bg-white shrink-0">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredAnnouncements.length)} of {filteredAnnouncements.length}
            </span>
            <div className="flex gap-2">
                <button 
                    onClick={() => paginate(currentPage - 1)} 
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-blue-50 disabled:opacity-50 transition-all"
                >
                    <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => paginate(i + 1)}
                        className={`w-8 h-8 rounded-lg font-bold text-[10px] transition-all ${
                            currentPage === i + 1 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button 
                    onClick={() => paginate(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-blue-50 disabled:opacity-50 transition-all"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
      )}

      {/* Modal - Fixed Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl animate-in slide-in-from-bottom-8 duration-500 overflow-hidden border border-white/20 max-h-[90vh] flex flex-col">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-2xl font-black text-gray-800">
                    {editingId ? 'Edit Notice' : 'New Announcement'}
                </h2>
                <p className="text-gray-400 text-sm font-medium">Fill in the details for the school community</p>
              </div>
              <button onClick={() => setShowModal(false)} className="bg-gray-100 p-2 rounded-full text-gray-400 hover:text-red-500 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Announcement Title</label>
                <input 
                  type="text" required
                  className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300 font-medium text-gray-700"
                  placeholder="e.g. Annual Sports Meet 2026"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Description</label>
                <textarea 
                  required rows="5"
                  className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all placeholder:text-gray-300 font-medium text-gray-700"
                  placeholder="Write the full details here..."
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 ml-1">Choose Audience</label>
                <div className="grid grid-cols-2 gap-3">
                  {['teacher', 'student', 'visitor', 'all'].map(role => (
                    <label key={role} className={`flex items-center gap-3 cursor-pointer px-4 py-3 rounded-2xl border-2 transition-all ${formData.targetRoles.includes(role) ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}>
                      <input 
                        type="checkbox" 
                        checked={formData.targetRoles.includes(role)}
                        onChange={() => handleCheckbox(role)}
                        className="w-5 h-5 accent-blue-600 rounded-lg border-gray-300"
                      />
                      <span className="text-sm capitalize font-bold">{role}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-700 active:scale-95 transition-all mt-4 shadow-xl shadow-blue-100">
                <Send size={22} /> {editingId ? 'Update Notice' : 'Publish to Board'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;