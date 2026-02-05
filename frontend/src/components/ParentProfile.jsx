import React from 'react';
import { 
  ArrowLeft, Briefcase, CreditCard, Calendar, User, ShieldCheck, 
  Phone, MapPin, ExternalLink 
} from 'lucide-react';

// 1. Add 'onViewStudent' to props
const ParentProfile = ({ parent, onBack, onViewStudent }) => {
  if (!parent) return null;

  return (
    <div className="max-w-6xl mx-auto p-6 animate-in fade-in zoom-in duration-300">
      <button 
        onClick={onBack} 
        className="group mb-8 bg-white px-6 py-3 rounded-2xl text-slate-500 font-bold text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-slate-100"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Directory
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Parent Identity (Same as before) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[3rem] p-8 shadow-xl shadow-slate-200/60 border border-white relative overflow-hidden">
             {/* ... (Keep existing Parent Identity code) ... */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 z-0"></div>
             <div className="relative z-10 flex flex-col items-center">
                <div className="w-48 h-48 rounded-[3rem] border-[6px] border-blue-50 shadow-2xl overflow-hidden bg-slate-100 flex items-center justify-center mb-6">
                  {parent.image ? <img src={parent.image} className="w-full h-full object-cover" alt="Profile" /> : <User className="text-slate-300" size={80} />}
                </div>
                <div className="text-center">
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-2">{parent.name}</h2>
                  <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-black uppercase tracking-widest">{parent.type}</span>
                  <p className="text-slate-400 font-bold text-xs mt-4 tracking-widest uppercase">ID: {parent.parentId}</p>
                </div>
             </div>
             
             {/* Parent Details */}
             <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
               <div className="flex items-center gap-4">
                  <div className="bg-blue-50 p-3 rounded-xl text-blue-600"><Briefcase size={20}/></div>
                  <div><p className="text-[10px] font-black text-slate-400 uppercase">Occupation</p><p className="font-bold text-slate-700">{parent.job || 'Not Provided'}</p></div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="bg-purple-50 p-3 rounded-xl text-purple-600"><CreditCard size={20}/></div>
                  <div><p className="text-[10px] font-black text-slate-400 uppercase">National ID (NIC)</p><p className="font-bold text-slate-700">{parent.nic}</p></div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600"><Calendar size={20}/></div>
                  <div><p className="text-[10px] font-black text-slate-400 uppercase">Date of Birth</p><p className="font-bold text-slate-700">{parent.dob ? new Date(parent.dob).toLocaleDateString() : 'N/A'}</p></div>
               </div>
             </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 shadow-lg border border-slate-100">
             <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2"><Phone size={20} className="text-blue-600"/> Contact Details</h3>
             <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl">
                   <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Mobile Number</p>
                   <p className="text-lg font-bold text-slate-700">{parent.contact}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl">
                   <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Residential Address</p>
                   <p className="text-sm font-bold text-slate-700 leading-relaxed">{parent.address}</p>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Linked Students */}
        <div className="lg:col-span-8 space-y-6">
           <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200/50 border border-white min-h-[600px]">
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
                 <div className="bg-orange-500 p-4 rounded-3xl text-white shadow-lg shadow-orange-200"><ShieldCheck size={32} /></div>
                 <div>
                    <h3 className="text-3xl font-black text-slate-800">Linked Students</h3>
                    <p className="text-slate-400 font-bold mt-1">Children associated with this parent profile</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {parent.students && parent.students.length > 0 ? parent.students.map(student => (
                    <div 
                        key={student._id} 
                        onClick={() => onViewStudent(student)} // 2. Handle Click
                        className="flex items-center gap-6 p-6 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group relative"
                    >
                       <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500">
                          <ExternalLink size={16} />
                       </div>
                       
                       <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-sm">
                          <img src={student.image || ""} className="w-full h-full object-cover rounded-xl bg-slate-200" alt={student.name} />
                       </div>
                       <div>
                          <h4 className="text-lg font-black text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{student.name}</h4>
                          <span className="inline-block px-3 py-1 bg-white rounded-lg text-xs font-bold text-slate-500 border border-slate-100 shadow-sm mb-2">
                             {student.studentId}
                          </span>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                             Grade: {student.grade?.name || 'Unassigned'}
                          </p>
                       </div>
                    </div>
                 )) : (
                    <div className="col-span-2 py-20 text-center text-slate-300 font-black text-xl italic">No students linked to this parent.</div>
                 )}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default ParentProfile;