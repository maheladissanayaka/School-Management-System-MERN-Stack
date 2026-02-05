import React from 'react';
import { ShieldCheck, Mail, Users } from 'lucide-react';

const TeacherIDCard = ({ teacher }) => {
  if (!teacher) return null;

  return (
    <div className="w-[350px] h-[220px] bg-slate-900 text-white rounded-2xl overflow-hidden shadow-2xl flex flex-col font-sans p-0 m-2 print:border print:border-gray-500 relative">
      {/* Abstract Design Elements */}
      <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-blue-600 rounded-full opacity-20 blur-2xl"></div>
      <div className="absolute bottom-[-10px] left-[-10px] w-20 h-20 bg-emerald-500 rounded-full opacity-10 blur-xl"></div>
      
      {/* Header Bar */}
      <div className="bg-blue-600 p-3 flex items-center justify-between relative z-10 shadow-md">
        <div className="flex items-center gap-2">
          <ShieldCheck size={20} className="text-white" />
          <div className="flex flex-col">
            <span className="text-[11px] font-black uppercase leading-none tracking-tight">Academic Staff</span>
            <span className="text-[7px] font-bold uppercase opacity-80">School Management System</span>
          </div>
        </div>
        <div className="bg-white/20 px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase border border-white/10">Official Faculty</div>
      </div>

      <div className="flex-1 flex p-4 gap-5 relative z-10">
        {/* Left Side: Avatar & ID */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-24 h-28 bg-white border-2 border-blue-500/30 rounded-xl overflow-hidden shadow-xl flex items-center justify-center">
            {teacher.image ? (
              <img src={teacher.image} alt="Staff" className="w-full h-full object-cover" />
            ) : (
              <Users size={40} className="text-gray-200" />
            )}
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-bold text-blue-400 uppercase tracking-wider">Employee ID</span>
            <span className="text-[10px] font-black tracking-widest">{teacher._id.slice(-6).toUpperCase()}</span>
          </div>
        </div>

        {/* Right Side: Details */}
        <div className="flex-1 flex flex-col justify-center border-l border-white/10 pl-5 text-left">
          <div className="mb-4">
            <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mb-1">Full Name</p>
            <p className="text-base font-black text-white leading-tight uppercase tracking-tight">{teacher.name}</p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div>
              <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Role / Designation</p>
              <p className="text-[10px] font-black text-blue-400 uppercase italic">Senior Faculty Member</p>
            </div>
            
            <div className="pt-2 border-t border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <Mail size={10} className="text-blue-500"/>
                <p className="text-[9px] font-bold text-gray-300 truncate w-32">{teacher.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Status: Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Stripe */}
      <div className="h-1.5 bg-gradient-to-r from-blue-600 to-emerald-500 w-full mt-auto"></div>
    </div>
  );
};

export default TeacherIDCard;