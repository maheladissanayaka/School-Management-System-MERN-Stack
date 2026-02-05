import React, { useEffect, useState } from 'react';
import { 
  Mail, Phone, MapPin, ArrowLeft, Users, Award, 
  Briefcase, BookOpen, Calendar, BadgeCheck, Clock, Shield, Cake, Loader2
} from 'lucide-react';
import { getSubjectsByTeacher } from '../services/subjectService';
import { getUserById } from '../services/userService'; 

const TeacherProfile = ({ teacher: initialTeacher, onBack }) => {
  const [teacher, setTeacher] = useState(initialTeacher); 
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullProfile = async () => {
      if (initialTeacher?._id) {
        try {
          setLoading(true);
          const [userData, subjectData] = await Promise.all([
            getUserById(initialTeacher._id),
            getSubjectsByTeacher(initialTeacher._id)
          ]);
          
          setTeacher(userData); 
          setSubjects(subjectData);
        } catch (err) {
          console.error("Failed to load profile", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFullProfile();
  }, [initialTeacher]);

  if (!teacher) return null;

  if (loading) {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
            <p className="text-slate-400 font-bold tracking-widest uppercase">Loading Profile...</p>
        </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 bg-slate-50/50 min-h-screen animate-in fade-in duration-700">
      {/* Top Navigation */}
      <button 
        onClick={onBack} 
        className="group mb-8 bg-white px-6 py-3 rounded-2xl text-slate-500 font-bold text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-slate-100"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Directory
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: ID Card & Key Stats */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[3rem] p-8 shadow-xl shadow-slate-200/60 border border-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative">
                <div className="w-48 h-48 rounded-[3rem] border-[6px] border-blue-50 shadow-2xl overflow-hidden bg-slate-100 flex items-center justify-center">
                  {teacher.image ? (
                    <img src={teacher.image} className="w-full h-full object-cover" alt="Profile" />
                  ) : (
                    <Users className="text-slate-300" size={80} />
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-3 rounded-2xl border-4 border-white shadow-lg">
                  <BadgeCheck size={20} />
                </div>
              </div>

              <div className="mt-8 text-center">
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">{teacher.name}</h2>
                <p className="text-blue-600 font-black text-sm tracking-[0.2em] mt-1 uppercase">
                  {teacher.teacherId || `ID: ${teacher._id?.slice(-6).toUpperCase()}`}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 bg-slate-100 px-4 py-1.5 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-wide">
                  <Shield size={12} className="text-blue-500" /> Authorized Faculty
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-4 pt-8 border-t border-slate-50">
              <div className="flex items-center gap-4 text-slate-600">
                <div className="bg-blue-50 p-3 rounded-xl text-blue-600"><Mail size={18} /></div>
                <div className="overflow-hidden">
                  <p className="text-[9px] uppercase font-black text-slate-400">Official Email</p>
                  <p className="text-sm font-bold truncate">{teacher.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-slate-600">
                <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600"><Phone size={18} /></div>
                <div>
                  <p className="text-[9px] uppercase font-black text-slate-400">Mobile Number</p>
                  <p className="text-sm font-bold">{teacher.contact || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-slate-600">
                <div className="bg-orange-50 p-3 rounded-xl text-orange-600"><Cake size={18} /></div>
                <div>
                  <p className="text-[9px] uppercase font-black text-slate-400">Date of Birth</p>
                  <p className="text-sm font-bold">
                    {teacher.dob ? new Date(teacher.dob).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-slate-600">
                <div className="bg-purple-50 p-3 rounded-xl text-purple-600"><Calendar size={18} /></div>
                <div>
                  <p className="text-[9px] uppercase font-black text-slate-400">School Register Date</p>
                  <p className="text-sm font-bold">
                    {teacher.registerDate ? new Date(teacher.registerDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
             <div className="absolute bottom-0 right-0 opacity-10"><BookOpen size={120} /></div>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-2">Subject Specialization</p>
             
             {/* 👇👇👇 UPDATED: Handle Object vs String for Subject 👇👇👇 */}
             <h3 className="text-3xl font-black">
                {teacher.subject && typeof teacher.subject === 'object' 
                    ? teacher.subject.name 
                    : (teacher.subject || 'General Studies')}
             </h3>
             {/* 👆👆👆 END UPDATE 👆👆👆 */}

             <p className="text-slate-400 text-xs mt-4 leading-relaxed font-medium">Core faculty member responsible for curriculum development and academic excellence.</p>
          </div>
        </div>

        {/* Right Column: Qualifications, Experience & SUBJECTS */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Assigned Subjects Section */}
          <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200/50 border border-white">
             <div className="flex items-center gap-4 mb-8">
                <div className="bg-orange-500 p-4 rounded-3xl text-white shadow-lg shadow-orange-200">
                   <BookOpen size={28} />
                </div>
                <div>
                   <h3 className="text-2xl font-black text-slate-800 tracking-tight">Assigned Subjects</h3>
                   <p className="text-slate-400 text-sm font-medium">Courses currently taught by this teacher</p>
                </div>
             </div>

             {subjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {subjects.map(subject => (
                      <div key={subject._id} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-lg transition-all duration-300 group">
                         <div className="flex justify-between items-start mb-2">
                            <span className="bg-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide text-orange-500 border border-slate-100 shadow-sm">
                                {subject.code}
                            </span>
                         </div>
                         <h4 className="text-lg font-black text-slate-800 group-hover:text-orange-600 transition-colors">{subject.name}</h4>
                         <p className="text-xs text-slate-400 mt-2 font-medium">Core Curriculum Subject</p>
                      </div>
                   ))}
                </div>
             ) : (
                <div className="p-8 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                   <p className="text-slate-400 font-bold text-sm italic">No subjects currently assigned.</p>
                </div>
             )}
          </div>

          {/* Qualifications Section */}
          <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200/50 border border-white">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-blue-600 p-4 rounded-3xl text-white shadow-lg shadow-blue-200">
                <Award size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Academic Qualifications</h3>
                <p className="text-slate-400 text-sm font-medium">Educational background and certified milestones</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teacher.qualifications && teacher.qualifications.length > 0 ? (
                teacher.qualifications.map((qual, index) => (
                  <div key={index} className="flex items-center gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-100 transition-hover hover:border-blue-200">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                    <p className="font-bold text-slate-700 text-sm uppercase tracking-tight">{qual}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-2 py-10 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium italic">No qualification data provided.</p>
                </div>
              )}
            </div>
          </div>

          {/* Professional Experience */}
          <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200/50 border border-white relative">
            <div className="flex items-center gap-4 mb-10">
              <div className="bg-slate-800 p-4 rounded-3xl text-white shadow-lg shadow-slate-200">
                <Briefcase size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Professional Experience</h3>
                <p className="text-slate-400 text-sm font-medium">History of teaching and prior career expertise</p>
              </div>
            </div>

            <div className="space-y-8 relative before:absolute before:inset-0 before:left-[19px] before:w-[2px] before:bg-slate-100">
              {teacher.experience && teacher.experience.length > 0 ? (
                teacher.experience.map((exp, index) => (
                  <div key={index} className="relative pl-12">
                    <div className="absolute left-0 top-1 w-10 h-10 bg-white border-4 border-blue-600 rounded-2xl z-10 flex items-center justify-center">
                       <Clock size={14} className="text-blue-600" />
                    </div>
                    <div className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 group hover:bg-white hover:shadow-lg transition-all duration-300">
                       <p className="text-slate-700 font-bold text-base leading-relaxed">{exp}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium italic">No professional history recorded.</p>
                </div>
              )}
            </div>
          </div>

          {/* Residential Address Section */}
          <div className="bg-slate-100/50 rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-8 border border-slate-200/50">
            <div className="bg-white p-5 rounded-[2rem] shadow-sm text-slate-400">
              <MapPin size={32} />
            </div>
            <div className="text-center md:text-left">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Residential Address</p>
              <p className="text-slate-600 font-bold text-lg leading-snug">{teacher.address || 'Address details currently being verified.'}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;