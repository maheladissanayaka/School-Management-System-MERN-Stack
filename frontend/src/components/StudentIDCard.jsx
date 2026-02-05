import React from 'react';
import { User, ShieldCheck } from 'lucide-react';

const StudentIDCard = ({ student }) => {
  if (!student) return null;

  return (
    <div className="w-[350px] h-[220px] bg-white border-2 border-blue-600 rounded-xl overflow-hidden shadow-2xl flex flex-col font-sans p-0 m-2 print:shadow-none print:border-gray-300">
      <div className="bg-blue-600 p-2 flex items-center justify-between text-white">
        <div className="flex items-center gap-1">
          <ShieldCheck size={18} />
          <span className="text-[12px] font-black uppercase tracking-tighter">School Academy</span>
        </div>
        <span className="text-[10px] font-bold opacity-80 uppercase">Student ID</span>
      </div>

      <div className="flex-1 flex p-3 gap-4">
        <div className="flex flex-col items-center gap-2">
          <div className="w-24 h-28 bg-gray-100 border-2 border-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
            {student.image ? (
              <img src={student.image} alt="Student" className="w-full h-full object-cover" />
            ) : (
              <User size={48} className="text-gray-300" />
            )}
          </div>
          <div className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
            {student.studentId || "ID PENDING"}
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center border-l border-gray-100 pl-4 text-left">
          <div className="mb-2">
            <p className="text-[8px] font-bold text-gray-400 uppercase">Full Name</p>
            <p className="text-sm font-black text-gray-800 leading-tight uppercase truncate">{student.name}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-[8px] font-bold text-gray-400 uppercase">Grade</p>
              <p className="text-xs font-bold text-gray-700">{student.grade?.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-[8px] font-bold text-gray-400 uppercase">Gender</p>
              <p className="text-xs font-bold text-gray-700">{student.gender || "N/A"}</p>
            </div>
          </div>
          {/* Added contact to ID card footer if needed */}
          <div className="mt-2 border-t border-gray-50 pt-1">
             <p className="text-[7px] font-bold text-gray-300 uppercase">Emergency Contact</p>
             <p className="text-[9px] font-bold text-gray-600">{student.contact || '---'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentIDCard;