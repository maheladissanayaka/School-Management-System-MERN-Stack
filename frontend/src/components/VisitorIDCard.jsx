import React from 'react';
import { ShieldCheck, Mail, Users, CreditCard } from 'lucide-react';

const VisitorIDCard = ({ visitor }) => {
  if (!visitor) return null;

  return (
    <div className="w-[350px] h-[220px] bg-indigo-950 text-white rounded-2xl overflow-hidden shadow-2xl flex flex-col font-sans p-0 m-2 print:border print:border-gray-500 relative">
      {/* Design Elements */}
      <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-purple-600 rounded-full opacity-20 blur-2xl"></div>
      <div className="absolute bottom-[-10px] left-[-10px] w-20 h-20 bg-pink-500 rounded-full opacity-10 blur-xl"></div>
      
      {/* Header Bar */}
      <div className="bg-purple-600 p-3 flex items-center justify-between relative z-10 shadow-md">
        <div className="flex items-center gap-2">
          <ShieldCheck size={20} className="text-white" />
          <div className="flex flex-col">
            <span className="text-[11px] font-black uppercase leading-none tracking-tight">External Official</span>
            <span className="text-[7px] font-bold uppercase opacity-80">School Management System</span>
          </div>
        </div>
        <div className="bg-white/20 px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase border border-white/10">Visitor Pass</div>
      </div>

      <div className="flex-1 flex p-4 gap-5 relative z-10">
        {/* Left Side: Avatar & ID */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-24 h-28 bg-white border-2 border-purple-500/30 rounded-xl overflow-hidden shadow-xl flex items-center justify-center">
            {visitor.image ? (
              <img src={visitor.image} alt="Staff" className="w-full h-full object-cover" />
            ) : (
              <Users size={40} className="text-gray-200" />
            )}
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-bold text-purple-400 uppercase tracking-wider">Visitor ID</span>
            <span className="text-[10px] font-black tracking-widest">{visitor.visitorId || '---'}</span>
          </div>
        </div>

        {/* Right Side: Details */}
        <div className="flex-1 flex flex-col justify-center border-l border-white/10 pl-5 text-left">
          <div className="mb-3">
            <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mb-1">Full Name</p>
            <p className="text-sm font-black text-white leading-tight uppercase tracking-tight">{visitor.name}</p>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <div>
              <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Designation</p>
              <p className="text-[9px] font-bold text-purple-300 uppercase">{visitor.position}</p>
              <p className="text-[8px] font-medium text-gray-400 uppercase">{visitor.department}</p>
            </div>
            
            <div className="pt-2 border-t border-white/10">
                <div className="flex items-center gap-2 mb-1">
                    <CreditCard size={10} className="text-purple-500"/>
                    <p className="text-[9px] font-bold text-gray-300 uppercase tracking-wider">NIC: {visitor.nic}</p>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Stripe */}
      <div className="h-1.5 bg-gradient-to-r from-purple-600 to-pink-500 w-full mt-auto"></div>
    </div>
  );
};

export default VisitorIDCard;