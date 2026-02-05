import React, { useEffect, useState, useCallback } from 'react';
import { getVisitors, deleteUser } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { 
  Users, Search, UserPlus, Edit, Trash2, 
  Loader2, Printer, Filter, ChevronLeft, ChevronRight, Lock 
} from 'lucide-react';
import { toast } from 'react-toastify';
import AddVisitorModal from '../components/AddVisitorModal'; 
import EditVisitorModal from '../components/EditVisitorModal';
import VisitorProfile from '../components/VisitorProfile';
import VisitorIDCard from '../components/VisitorIDCard';
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

const Visitors = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); 
  const [genderFilter, setGenderFilter] = useState({ Male: true, Female: true });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [viewingVisitor, setViewingVisitor] = useState(null); 
  const [selectedVisitor, setSelectedVisitor] = useState(null);

  const fetchVisitors = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getVisitors();
      setVisitors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error(err.response?.data?.msg || "Failed to load visitors");
      setVisitors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVisitors();
  }, [fetchVisitors]);

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      toast.success("Visitor deleted");
      fetchVisitors();
    } catch (err) { 
      toast.error("Delete failed");
      console.log("deleted failed"+err)
    }
  };

  const handleEditClick = (visitor) => {
    setSelectedVisitor(visitor);
    setIsEditModalOpen(true);
  };

  const handlePrint = (visitor) => {
    const printContent = document.getElementById(`visitor-id-${visitor._id}`).innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = `<html><body>${printContent}</body></html>`;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); 
  };

  // --- Filter Logic ---
  const filteredVisitors = visitors.filter(v => {
    const matchesSearch = 
      v.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      v.visitorId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.department?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGender = 
      (genderFilter.Male && v.gender === 'Male') || 
      (genderFilter.Female && v.gender === 'Female') ||
      (!v.gender); 

    return matchesSearch && matchesGender;
  });

  // --- Pagination Logic ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVisitors = filteredVisitors.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredVisitors.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (viewingVisitor) return <VisitorProfile visitor={viewingVisitor} onBack={() => setViewingVisitor(null)} />;

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-purple-600 mb-4" size={48} />
      <p className="text-gray-400 font-bold uppercase tracking-widest">Loading Visitor Data...</p>
    </div>
  );

  return (
    <div className="h-full flex flex-col p-6 max-w-7xl mx-auto overflow-hidden">
      
      {/* 1. Header (Fixed) */}
      <div className="shrink-0 flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <Users className="text-purple-600" size={32} /> Visitors
          </h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-tight">Total: {visitors.length}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search..." 
                    className="pl-10 pr-4 py-3 bg-white rounded-2xl shadow-sm focus:ring-2 focus:ring-purple-600 outline-none w-full lg:w-64 font-medium" 
                    value={searchTerm} 
                    onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
                />
            </div>
            {isAdmin && (
                <button 
                    className="bg-purple-600 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 font-black shadow-xl hover:bg-purple-700 transition-all" 
                    onClick={() => setIsAddModalOpen(true)} 
                >
                    <UserPlus size={20} /> Add Visitor
                </button>
            )}
        </div>
      </div>

      {/* 2. Filters (Fixed) */}
      <div className="shrink-0 flex flex-wrap gap-6 mb-6 bg-white p-4 rounded-[1.5rem] border border-gray-100 shadow-sm items-center">
        <div className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-widest">
            <Filter size={14}/> Filters:
        </div>
        <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer select-none group">
                <input 
                    type="checkbox" 
                    checked={genderFilter.Male} 
                    onChange={() => { setGenderFilter(prev => ({...prev, Male: !prev.Male})); setCurrentPage(1); }} 
                    className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300" 
                />
                <span className="text-sm font-black text-gray-600 uppercase group-hover:text-blue-600 transition-colors">Male</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none group">
                <input 
                    type="checkbox" 
                    checked={genderFilter.Female} 
                    onChange={() => { setGenderFilter(prev => ({...prev, Female: !prev.Female})); setCurrentPage(1); }} 
                    className="w-5 h-5 rounded text-pink-600 focus:ring-pink-500 border-gray-300" 
                />
                <span className="text-sm font-black text-gray-600 uppercase group-hover:text-pink-600 transition-colors">Female</span>
            </label>
        </div>
      </div>

      {/* 3. Main Table Container (Flex Grow) */}
      <div className="flex-1 flex flex-col bg-white rounded-[2rem] border border-gray-100 shadow-2xl overflow-hidden min-h-0">
        
        {/* Scrollable Table Area */}
        <div className="flex-1 overflow-auto no-scrollbar">
          <table className="w-full text-left min-w-[1000px]">
            <thead className="bg-gray-50/50 border-b border-gray-100 sticky top-0 z-10 backdrop-blur-sm">
              <tr>
                <th className="px-6 py-5 font-black text-gray-400 uppercase text-[10px] tracking-widest text-center">Profile</th>
                <th className="px-6 py-5 font-black text-gray-400 uppercase text-[10px] tracking-widest">ID</th>
                <th className="px-6 py-5 font-black text-gray-400 uppercase text-[10px] tracking-widest">Name</th>
                <th className="px-6 py-5 font-black text-gray-400 uppercase text-[10px] tracking-widest">Dept</th>
                <th className="px-6 py-5 font-black text-gray-400 uppercase text-[10px] tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentVisitors.length > 0 ? currentVisitors.map(visitor => (
                <tr key={visitor._id} className="hover:bg-purple-50/20 transition-all group">
                  <td className="px-6 py-3 text-center">
                    <div 
                        className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center border-2 border-white shadow-md cursor-pointer overflow-hidden mx-auto hover:scale-110 hover:ring-4 hover:ring-purple-100 transition-all"
                        onClick={() => setViewingVisitor(visitor)}
                    >
                        {visitor.image ? <img src={visitor.image} className="w-full h-full object-cover" alt="v" /> : <Users className="text-gray-300" size={24} />}
                    </div>
                  </td>
                  <td className="px-6 py-3 font-bold text-gray-500 text-xs">{visitor.visitorId}</td>
                  <td className="px-6 py-3 font-bold text-gray-800 text-sm">{visitor.name}</td>
                  <td className="px-6 py-3 text-sm font-bold text-gray-600">{visitor.department}</td>
                  
                  {/* Actions Column */}
                  <td className="px-6 py-3">
                    {isAdmin ? (
                        <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => handlePrint(visitor)} className="p-2 text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"><Printer size={16}/></button>
                        <button onClick={() => handleEditClick(visitor)} className="p-2 text-purple-600 bg-purple-50 rounded-xl hover:bg-purple-600 hover:text-white transition-all shadow-sm"><Edit size={16}/></button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild><button className="p-2 text-red-500 bg-red-50 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={16}/></button></AlertDialogTrigger>
                            <AlertDialogContent className="rounded-3xl border-none shadow-2xl p-8">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-2xl font-black text-gray-800 tracking-tight">Delete Visitor?</AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-500 font-medium py-2">Action is permanent.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="gap-3 mt-4">
                                <AlertDialogCancel className="rounded-xl border-gray-100 font-bold px-6 py-5">Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(visitor._id)} className="rounded-xl bg-red-600 hover:bg-red-700 font-bold px-6 py-5 shadow-lg shadow-red-100">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        </div>
                    ) : (
                        <div className="flex justify-center items-center text-gray-300">
                             <Lock size={14} className="mr-1"/> <span className="text-[10px] font-bold uppercase">View Only</span>
                        </div>
                    )}
                    
                    <div id={`visitor-id-${visitor._id}`} className="hidden"><VisitorIDCard visitor={visitor} /></div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="px-6 py-20 text-center text-gray-400 font-bold italic">No visitors found matching your criteria.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* 4. Compact Pagination Footer (Fixed at Bottom) */}
        {filteredVisitors.length > 0 && (
            <div className="shrink-0 p-3 flex items-center justify-between border-t border-gray-100 bg-gray-50/50">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-2">
                    Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredVisitors.length)} of {filteredVisitors.length}
                </span>
                <div className="flex gap-1.5">
                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-purple-50 disabled:opacity-50 transition-all shadow-sm"><ChevronLeft size={14} /></button>
                    <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button key={i + 1} onClick={() => paginate(i + 1)} className={`w-8 h-8 rounded-lg font-bold text-[10px] transition-all shadow-sm flex items-center justify-center ${currentPage === i + 1 ? 'bg-purple-600 text-white shadow-purple-200' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{i + 1}</button>
                        ))}
                    </div>
                    <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-purple-50 disabled:opacity-50 transition-all shadow-sm"><ChevronRight size={14} /></button>
                </div>
            </div>
        )}
      </div>

      <AddVisitorModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} refreshData={fetchVisitors} />
      {selectedVisitor && <EditVisitorModal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedVisitor(null); }} refreshData={fetchVisitors} visitor={selectedVisitor} />}
      
      {/* CSS to hide scrollbar */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Visitors;