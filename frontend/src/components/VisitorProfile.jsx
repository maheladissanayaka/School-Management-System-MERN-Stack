import React from 'react';
import { 
  Mail, Phone, MapPin, ArrowLeft, Users, BadgeCheck, Shield, Cake, Building, Briefcase, CreditCard
} from 'lucide-react';

const VisitorProfile = ({ visitor, onBack }) => {
  if (!visitor) return null;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 bg-slate-50/50 min-h-screen animate-in fade-in duration-700">
      <button 
        onClick={onBack} 
        className="group mb-8 bg-white px-6 py-3 rounded-2xl text-slate-500 font-bold text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-purple-600 hover:text-white transition-all shadow-sm border border-slate-100"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Directory
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[3rem] p-8 shadow-xl shadow-slate-200/60 border border-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -mr-16 -mt-16 z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative">
                <div className="w-48 h-48 rounded-[3rem] border-[6px] border-purple-50 shadow-2xl overflow-hidden bg-slate-100 flex items-center justify-center">
                  {visitor.image ? (
                    <img src={visitor.image} className="w-full h-full object-cover" alt="Profile" />
                  ) : (
                    <Users className="text-slate-300" size={80} />
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-3 rounded-2xl border-4 border-white shadow-lg">
                  <BadgeCheck size={20} />
                </div>
              </div>

              <div className="mt-8 text-center">
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">{visitor.name}</h2>
                <p className="text-purple-600 font-black text-sm tracking-[0.2em] mt-1 uppercase">
                  {visitor.visitorId || `ID: ${visitor._id?.slice(-6).toUpperCase()}`}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 bg-slate-100 px-4 py-1.5 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-wide">
                  <Shield size={12} className="text-purple-500" /> Authorized Visitor
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-4 pt-8 border-t border-slate-50">
              <div className="flex items-center gap-4 text-slate-600">
                <div className="bg-blue-50 p-3 rounded-xl text-blue-600"><Mail size={18} /></div>
                <div className="overflow-hidden">
                  <p className="text-[9px] uppercase font-black text-slate-400">Email</p>
                  <p className="text-sm font-bold truncate">{visitor.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-slate-600">
                <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600"><Phone size={18} /></div>
                <div>
                  <p className="text-[9px] uppercase font-black text-slate-400">Contact</p>
                  <p className="text-sm font-bold">{visitor.contact || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-slate-600">
                <div className="bg-orange-50 p-3 rounded-xl text-orange-600"><Cake size={18} /></div>
                <div>
                  <p className="text-[9px] uppercase font-black text-slate-400">Date of Birth</p>
                  <p className="text-sm font-bold">
                    {visitor.dob ? new Date(visitor.dob).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Official Details */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200/50 border border-white">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-purple-600 p-4 rounded-3xl text-white shadow-lg shadow-purple-200">
                <Briefcase size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Official Designation</h3>
                <p className="text-slate-400 text-sm font-medium">Department and Position Details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100">
                    <div className="flex items-center gap-3 mb-2 text-purple-600">
                        <Building size={20}/>
                        <span className="text-xs font-black uppercase tracking-widest">Department</span>
                    </div>
                    <p className="text-lg font-bold text-slate-700">{visitor.department || 'General'}</p>
                </div>
                <div className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100">
                    <div className="flex items-center gap-3 mb-2 text-purple-600">
                        <Users size={20}/>
                        <span className="text-xs font-black uppercase tracking-widest">Position</span>
                    </div>
                    <p className="text-lg font-bold text-slate-700">{visitor.position || 'Official'}</p>
                </div>
                <div className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 md:col-span-2">
                    <div className="flex items-center gap-3 mb-2 text-purple-600">
                        <CreditCard size={20}/>
                        <span className="text-xs font-black uppercase tracking-widest">National ID (NIC)</span>
                    </div>
                    <p className="text-lg font-bold text-slate-700 tracking-wider">{visitor.nic || 'N/A'}</p>
                </div>
            </div>
          </div>

          <div className="bg-slate-100/50 rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-8 border border-slate-200/50">
            <div className="bg-white p-5 rounded-[2rem] shadow-sm text-slate-400">
              <MapPin size={32} />
            </div>
            <div className="text-center md:text-left">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Residential Address</p>
              <p className="text-slate-600 font-bold text-lg leading-snug">{visitor.address || 'Address Verified.'}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VisitorProfile;