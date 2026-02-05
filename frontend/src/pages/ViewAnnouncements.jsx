import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Megaphone, Plus, X, Send, Loader2, Edit, Trash2, Calendar, Target, Info, Filter } from 'lucide-react';
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

const ViewAnnouncements = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null); 
  const [formData, setFormData] = useState({ title: '', content: '', targetRoles: [] });

  const fetchNotices = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllAnnouncements();
      setAnnouncements(Array.isArray(data) ? data : []);
    } catch (err) { 
      toast.error("Failed to load notice board");
      console.log("Failed to load notice board"+err)
    } finally {
      setLoading(false); 
    }
  }, []);

  useEffect(() => { fetchNotices(); }, [fetchNotices]);

  // --- Strict Role-Based Filtering ---
  // Admin & Teacher: View ALL
  // Student: View only 'student' + 'all'
  // Visitor: View only 'visitor' + 'all'
  const filteredAnnouncements = announcements.filter(item => {
    const userRole = user?.role || 'visitor';
    
    if (userRole === 'admin' || userRole === 'teacher') return true; 
    
    // For students/visitors, check if their role is in the target list OR 'all'
    const targets = item.targetRoles.map(r => r.toLowerCase());
    return targets.includes(userRole) || targets.includes('all');
  });

  // --- CRUD Handlers (Admin Only) ---
  const handleCheckbox = (role) => {
    setFormData(prev => ({
      ...prev,
      targetRoles: prev.targetRoles.includes(role) ? prev.targetRoles.filter(r => r !== role) : [...prev.targetRoles, role]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateAnnouncement(editingId, formData);
        toast.success("Announcement updated!");
      } else {
        await createAnnouncement(formData);
        toast.success("Notice published!");
      }
      setShowModal(false);
      fetchNotices(); 
    } catch (err) { 
        toast.error("Save failed"); 
        console.log("Save failed"+err)
    }
  };

  const confirmDelete = async (id) => {
    try {
      await deleteAnnouncement(id);
      toast.success("Deleted");
      fetchNotices();
    } catch (err) { 
        console.log("Deleted"+err)
        toast.error("Delete failed"); }
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

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={32} /></div>;

  return (
    <div className="h-screen flex flex-col p-6 max-w-5xl mx-auto overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <Megaphone className="text-blue-600" size={28} /> Notice Board
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">
            Viewing as: <span className="uppercase font-bold text-blue-600">{user?.role}</span>
          </p>
        </div>
        
        {user?.role === 'admin' && (
          <button 
            onClick={() => { setEditingId(null); setFormData({ title: '', content: '', targetRoles: [] }); setShowModal(true); }}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-blue-700 shadow-xl font-bold"
          >
            <Plus size={20} /> Publish
          </button>
        )}
      </div>

      {/* Content List */}
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
      <div className="flex-1 overflow-y-auto pr-2 space-y-6 pb-4 no-scrollbar">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((item) => (
            <div key={item._id} className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-xl text-gray-800 capitalize">{item.title}</h3>
                  <div className="flex items-center gap-2 text-gray-400 text-xs font-bold mt-1 uppercase tracking-wide">
                    <Calendar size={12} />
                    {new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                
                {user?.role === 'admin' && (
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingId(item._id); setFormData(item); setShowModal(true); }} className="p-2 text-blue-600 bg-blue-50 rounded-xl"><Edit size={16}/></button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><button className="p-2 text-red-500 bg-red-50 rounded-xl"><Trash2 size={16}/></button></AlertDialogTrigger>
                      <AlertDialogContent className="rounded-3xl p-8"><AlertDialogHeader><AlertDialogTitle>Delete Notice?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel className="rounded-xl font-bold">Cancel</AlertDialogCancel><AlertDialogAction onClick={() => confirmDelete(item._id)} className="bg-red-600 rounded-xl font-bold">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 p-5 rounded-2xl mb-4">
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap font-medium">{item.content}</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {item.targetRoles.map(r => (
                  <span key={r} className={`text-[10px] px-3 py-1 rounded-full uppercase font-black border ${getRoleColor(r)}`}>{r}</span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-gray-400 font-bold bg-white rounded-3xl border-2 border-dashed">No announcements for you.</div>
        )}
      </div>

      {/* Admin Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl p-8 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-gray-800">{editingId ? 'Edit' : 'New'} Notice</h2>
              <button onClick={() => setShowModal(false)} className="bg-gray-100 p-2 rounded-full"><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" required className="w-full bg-gray-50 p-4 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500" placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              <textarea required rows="4" className="w-full bg-gray-50 p-4 rounded-xl font-medium outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Details..." value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
              
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1 block mb-2">Audience</label>
                <div className="flex gap-3">
                  {['teacher', 'student', 'visitor', 'all'].map(r => (
                    <label key={r} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase cursor-pointer border-2 transition-all ${formData.targetRoles.includes(r) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-400 border-gray-100'}`}>
                      <input type="checkbox" className="hidden" checked={formData.targetRoles.includes(r)} onChange={() => handleCheckbox(r)} /> {r}
                    </label>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-black shadow-xl mt-4">Publish</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAnnouncements;