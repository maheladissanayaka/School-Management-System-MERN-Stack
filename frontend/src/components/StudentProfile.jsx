import React, { useEffect, useState } from 'react';
import { 
  Mail, Phone, MapPin, ArrowLeft, User, 
  GraduationCap, BadgeCheck, Shield, School, Hash, Cake, 
  Users, Loader2, ExternalLink, Briefcase
} from 'lucide-react';
import { getParentsByStudentId } from '../services/parentService';

const StudentProfile = ({ student, onBack, onViewParent }) => {
  const [parents, setParents] = useState([]);
  const [loadingParents, setLoadingParents] = useState(true);

  // Fetch Linked Parents on Mount
  useEffect(() => {
    if (student?._id) {
      getParentsByStudentId(student._id)
        .then(data => setParents(data))
        .catch(err => console.error("Failed to load parents", err))
        .finally(() => setLoadingParents(false));
    }
  }, [student]);

  if (!student) return null;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 bg-slate-50/50 min-h-screen animate-in fade-in duration-700">
      {/* Top Navigation */}
      <button 
        onClick={onBack} 
        className="group mb-8 bg-white px-6 py-3 rounded-2xl text-slate-500 font-bold text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-slate-100"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Student Hub
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* === Left Column: Identity & Parents === */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 1. Identity Card */}
          <div className="bg-white rounded-[3rem] p-8 shadow-xl shadow-slate-200/60 border border-white relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 z-0 ${student.gender === 'Female' ? 'bg-pink-50' : 'bg-blue-50'}`}></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative">
                <div className={`w-48 h-48 rounded-[3rem] border-[6px] shadow-2xl overflow-hidden bg-slate-100 flex items-center justify-center ${student.gender === 'Female' ? 'border-pink-50' : 'border-blue-50'}`}>
                  {student.image ? (
                    <img src={student.image} className="w-full h-full object-cover" alt="Profile" />
                  ) : (
                    <User className="text-slate-300" size={80} />
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-3 rounded-2xl border-4 border-white shadow-lg">
                  <BadgeCheck size={20} />
                </div>
              </div>

              <div className="mt-8 text-center">
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter leading-none">{student.name}</h2>
                <p className="text-blue-600 font-black text-sm tracking-[0.2em] mt-2 uppercase">
                  {student.studentId || "ID PENDING"}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 bg-slate-100 px-4 py-1.5 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-wide">
                  <Shield size={12} className="text-blue-500" /> Enrolled Student
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-4 pt-8 border-t border-slate-50">
              <div className="flex items-center gap-4 text-slate-600">
                <div className="bg-blue-50 p-3 rounded-xl text-blue-600"><Mail size={18} /></div>
                <div className="overflow-hidden">
                  <p className="text-[9px] uppercase font-black text-slate-400">Email Address</p>
                  <p className="text-sm font-bold truncate">{student.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-slate-600">
                <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600"><Phone size={18} /></div>
                <div>
                  <p className="text-[9px] uppercase font-black text-slate-400">Emergency Contact</p>
                  <p className="text-sm font-bold">{student.contact || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Grade Badge Card */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute bottom-0 right-0 opacity-10 group-hover:scale-110 transition-transform duration-500"><School size={120} /></div>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-2">Current Academic Level</p>
             <h3 className="text-3xl font-black">{student.grade?.name || 'Unassigned'}</h3>
             <p className="text-slate-400 text-xs mt-4 leading-relaxed font-medium">Standard curriculum student. Tracking active for current academic year.</p>
          </div>
        </div>

        {/* === Right Column: Details & Parents === */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* 3. Personal Info Grid */}
          <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200/50 border border-white">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-blue-600 p-4 rounded-3xl text-white shadow-lg shadow-blue-200">
                <User size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Personal Details</h3>
                <p className="text-slate-400 text-sm font-medium">Basic student information and demographics</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center gap-4">
                  <div className="bg-white p-3 rounded-2xl text-blue-500 shadow-sm"><Cake size={20}/></div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400">Date of Birth</p>
                    <p className="text-lg font-bold text-slate-700">{student.dob ? new Date(student.dob).toLocaleDateString() : 'N/A'}</p>
                  </div>
               </div>

               <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center gap-4">
                  <div className="bg-white p-3 rounded-2xl text-pink-500 shadow-sm"><User size={20}/></div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400">Gender</p>
                    <p className="text-lg font-bold text-slate-700">{student.gender || 'Not Specified'}</p>
                  </div>
               </div>

               <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center gap-4">
                  <div className="bg-white p-3 rounded-2xl text-purple-500 shadow-sm"><Hash size={20}/></div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400">System ID</p>
                    <p className="text-lg font-bold text-slate-700">{student._id.slice(-6).toUpperCase()}</p>
                  </div>
               </div>

               <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center gap-4">
                  <div className="bg-white p-3 rounded-2xl text-orange-500 shadow-sm"><GraduationCap size={20}/></div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400">Enrollment Status</p>
                    <p className="text-lg font-bold text-slate-700">Active Student</p>
                  </div>
               </div>
            </div>
          </div>

          {/* 4. Address Section */}
          <div className="bg-slate-100/50 rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-8 border border-slate-200/50">
            <div className="bg-white p-5 rounded-[2rem] shadow-sm text-slate-400 shrink-0">
              <MapPin size={32} />
            </div>
            <div className="text-center md:text-left w-full">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Residential Address</p>
              <p className="text-slate-600 font-bold text-lg leading-snug break-words">
                {student.address || 'Address details have not been updated yet.'}
              </p>
            </div>
          </div>

          {/* 5. LINKED PARENTS SECTION (This was the missing part you wanted "same") */}
          <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200/50 border border-white min-h-[400px]">
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
                 <div className="bg-orange-500 p-4 rounded-3xl text-white shadow-lg shadow-orange-200">
                    <Users size={32} />
                 </div>
                 <div>
                    <h3 className="text-3xl font-black text-slate-800">Linked Guardians</h3>
                    <p className="text-slate-400 font-bold mt-1">Parents/Guardians associated with this profile</p>
                 </div>
              </div>

              {loadingParents ? (
                 <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-500"/></div>
              ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {parents.length > 0 ? parents.map(parent => (
                       <div 
                          key={parent._id}
                          onClick={() => onViewParent && onViewParent(parent)} // CLICK EVENT HERE
                          className="flex items-center gap-6 p-6 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group relative overflow-hidden"
                       >
                          {/* Hover Effect Blob */}
                          <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          
                          {/* External Link Icon */}
                          <div className="absolute top-4 right-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                              <ExternalLink size={16} />
                          </div>

                          <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-sm shrink-0 border border-slate-100 relative z-10">
                             {parent.image ? 
                                <img src={parent.image} className="w-full h-full object-cover rounded-xl" alt={parent.name} /> 
                                : <User className="w-full h-full p-4 text-slate-300"/>
                             }
                          </div>
                          
                          <div className="relative z-10">
                             <h4 className="text-lg font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors mb-1">{parent.name}</h4>
                             
                             <div className="flex flex-wrap gap-2 mb-2">
                                <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border border-slate-100 shadow-sm
                                    ${parent.type === 'Mother' ? 'bg-pink-50 text-pink-600' : 'bg-blue-50 text-blue-600'}`}>
                                    {parent.type}
                                </span>
                             </div>

                             <div className="flex items-center gap-1.5 text-slate-400">
                                <Briefcase size={12} strokeWidth={3} />
                                <span className="text-[10px] font-bold uppercase tracking-wider">
                                    {parent.job || 'Job N/A'}
                                </span>
                             </div>
                          </div>
                       </div>
                    )) : (
                       <div className="col-span-2 py-20 text-center text-slate-300 font-black text-xl italic">
                          No guardian profiles linked.
                       </div>
                    )}
                 </div>
              )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentProfile;