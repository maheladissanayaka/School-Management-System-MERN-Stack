import React, { useEffect, useState } from 'react';
import { getParents, deleteParent } from '../services/parentService';
import { getUserById } from '../services/userService'; 
import { useAuth } from '../context/AuthContext';
import { 
  Users, Search, UserPlus, Edit, Trash2, Loader2, Phone, MapPin, 
  ExternalLink, Filter, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { toast } from 'react-toastify';
import AddParentModal from '../components/AddParentModal';
import EditParentModal from '../components/EditParentModal';
import ParentProfile from '../components/ParentProfile';
import StudentProfile from '../components/StudentProfile';

const Parents = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  const [typeFilter, setTypeFilter] = useState({ Father: true, Mother: true, Guardian: true });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; 

  const [editingParent, setEditingParent] = useState(null);
  const [viewingParent, setViewingParent] = useState(null); 
  const [viewingStudent, setViewingStudent] = useState(null);
  const [loadingStudent, setLoadingStudent] = useState(false); 

  const fetchParents = async () => {
    try {
      setLoading(true);
      const data = await getParents();
      setParents(data);
    } catch (err) {
      toast.error("Failed to load parents");
      console.log("Failed to load parents"+err)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchParents(); }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter]);

  const handleViewStudent = async (partialStudent) => {
    try {
      setLoadingStudent(true);
      const fullStudentData = await getUserById(partialStudent._id);
      setViewingStudent(fullStudentData);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load student details");
    } finally {
      setLoadingStudent(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Delete this parent record?")) {
      await deleteParent(id);
      fetchParents();
      toast.success("Deleted");
    }
  };

  const handleEdit = (parent, e) => {
    e.stopPropagation();
    setEditingParent(parent);
  };

  const filteredParents = parents.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.parentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nic.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter[p.type] !== false; 

    return matchesSearch && matchesType;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentParents = filteredParents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredParents.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loadingStudent) {
    return (
        <div className="h-full flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-blue-600" size={48} />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Loading Student Profile...</p>
        </div>
    );
  }

  if (viewingStudent) return <StudentProfile student={viewingStudent} onBack={() => setViewingStudent(null)} />;
  if (viewingParent) return <ParentProfile parent={viewingParent} onBack={() => setViewingParent(null)} onViewStudent={handleViewStudent} />;
  if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;

  return (
    <div className="h-full flex flex-col p-6 max-w-7xl mx-auto overflow-hidden">
      
      {/* 1. Header (Fixed) */}
      <div className="shrink-0 flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-800 flex items-center gap-2"><Users className="text-blue-600"/> Parents Directory</h1>
          <p className="text-gray-400 font-bold uppercase text-xs tracking-widest mt-1">Total Records: {parents.length}</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
           <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
              <input type="text" placeholder="Search parents..." className="pl-10 pr-4 py-3 rounded-xl border-none w-full md:w-64 font-bold outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
           </div>
           {isAdmin && (
             <button onClick={() => setIsAddOpen(true)} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-200 hover:-translate-y-1 transition-all">
                <UserPlus size={20}/> Add Parent
             </button>
           )}
        </div>
      </div>

      {/* 2. Checkbox Filters (Fixed) */}
      <div className="shrink-0 flex flex-wrap gap-6 mb-6 bg-white p-4 rounded-[1.5rem] border border-gray-100 shadow-sm items-center">
        <div className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-widest">
            <Filter size={14}/> Type Filters:
        </div>
        <div className="flex items-center gap-4">
            {['Father', 'Mother', 'Guardian'].map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer select-none group">
                    <input 
                        type="checkbox" 
                        checked={typeFilter[type]} 
                        onChange={() => setTypeFilter(prev => ({ ...prev, [type]: !prev[type] }))} 
                        className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300 transition-all" 
                    />
                    <span className={`text-sm font-bold uppercase transition-colors ${typeFilter[type] ? 'text-gray-700' : 'text-gray-400'}`}>
                        {type}
                    </span>
                </label>
            ))}
        </div>
      </div>

      {/* 3. Main Grid (Scrollable Area) */}
      <div className="flex-1 overflow-y-auto no-scrollbar min-h-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-4">
            {currentParents.length > 0 ? currentParents.map(parent => (
            <div 
                key={parent._id} 
                onClick={() => setViewingParent(parent)}
                className="bg-white rounded-[2.5rem] p-6 shadow-sm hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-gray-100 cursor-pointer group relative overflow-hidden"
            >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500 z-0"></div>

                <div className="relative z-10 flex items-start justify-between mb-6">
                    <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-2xl p-1 bg-white shadow-md">
                        <img src={parent.image || "https://via.placeholder.com/100"} className="w-full h-full rounded-xl object-cover bg-gray-100" alt="" />
                    </div>
                    <div>
                        <h3 className="font-black text-gray-800 text-lg leading-tight group-hover:text-blue-600 transition-colors">{parent.name}</h3>
                        <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 inline-block px-2 py-0.5 rounded-lg 
                            ${parent.type === 'Mother' ? 'bg-pink-50 text-pink-600' : 
                                parent.type === 'Father' ? 'bg-blue-50 text-blue-600' : 
                                'bg-orange-50 text-orange-600'}`}>
                            {parent.type}
                        </p>
                        <p className="text-xs text-gray-400 font-medium mt-1">{parent.parentId}</p>
                    </div>
                    </div>
                    {isAdmin && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                        <button onClick={(e) => handleEdit(parent, e)} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-colors"><Edit size={16}/></button>
                        <button onClick={(e) => handleDelete(parent._id, e)} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-colors"><Trash2 size={16}/></button>
                    </div>
                    )}
                </div>

                <div className="relative z-10 space-y-2 mb-6">
                    <div className="flex items-center gap-3 text-xs font-bold text-gray-600 bg-gray-50/80 p-3 rounded-2xl backdrop-blur-sm">
                    <Phone size={14} className="text-blue-500"/> <span>{parent.contact}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-gray-600 bg-gray-50/80 p-3 rounded-2xl backdrop-blur-sm">
                    <MapPin size={14} className="text-blue-500"/> <span className="truncate">{parent.address}</span>
                    </div>
                </div>

                <div className="relative z-10 border-t border-gray-100 pt-4">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Linked Children</p>
                    <div className="space-y-2">
                    {parent.students && parent.students.length > 0 ? parent.students.map(s => (
                        <div 
                            key={s._id} 
                            onClick={(e) => { e.stopPropagation(); handleViewStudent(s); }}
                            className="flex items-center gap-3 group/child p-2 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                            <div className="w-8 h-8 rounded-full p-0.5 border border-gray-200 bg-white shadow-sm">
                                <img className="w-full h-full rounded-full object-cover" src={s.image || ""} alt=""/>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="text-xs font-bold text-gray-700 group-hover/child:text-blue-600 transition-colors">{s.name}</p>
                                    <ExternalLink size={10} className="text-blue-400 opacity-0 group-hover/child:opacity-100 transition-opacity"/>
                                </div>
                                <p className="text-[10px] text-gray-400 font-medium">{s.studentId}</p>
                            </div>
                        </div>
                    )) : (
                        <span className="text-xs text-gray-300 italic font-medium pl-1">No students linked</span>
                    )}
                    </div>
                </div>
            </div>
            )) : (
                <div className="col-span-full py-20 text-center">
                    <p className="text-gray-400 font-bold text-lg">No parents found matching filters.</p>
                </div>
            )}
        </div>
      </div>

      {/* 4. Compact Pagination Footer (Fixed) */}
      {filteredParents.length > 0 && (
        <div className="shrink-0 p-3 mt-4 flex items-center justify-between border-t border-gray-100 bg-white/50 backdrop-blur-sm rounded-xl">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-2">
                {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredParents.length)} of {filteredParents.length}
            </span>
            <div className="flex gap-1.5">
                <button 
                    onClick={() => paginate(currentPage - 1)} 
                    disabled={currentPage === 1} 
                    className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                    <ChevronLeft size={14} />
                </button>
                
                <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button 
                            key={i + 1} 
                            onClick={() => paginate(i + 1)}
                            className={`w-8 h-8 rounded-lg font-bold text-[10px] transition-all shadow-sm flex items-center justify-center ${
                                currentPage === i + 1 
                                ? 'bg-blue-600 text-white shadow-blue-200' 
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>

                <button 
                    onClick={() => paginate(currentPage + 1)} 
                    disabled={currentPage === totalPages} 
                    className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                    <ChevronRight size={14} />
                </button>
            </div>
        </div>
      )}

      <AddParentModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} refreshData={fetchParents} />
      {editingParent && <EditParentModal isOpen={!!editingParent} onClose={() => setEditingParent(null)} refreshData={fetchParents} parent={editingParent} />}
      
      {/* CSS for Hidden Scrollbar */}
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

export default Parents;