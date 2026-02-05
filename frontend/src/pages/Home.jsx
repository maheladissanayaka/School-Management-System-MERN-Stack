import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getStudents } from '../services/userService';
import { getAllClasses } from '../services/classService';
import { Users, GraduationCap, Layers, Bell, Calendar, TrendingUp } from 'lucide-react';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ students: 0, classes: 0, teachers: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [studentData, classData] = await Promise.all([getStudents(), getAllClasses()]);
        setStats({
          students: studentData.length,
          classes: classData.length,
          teachers: 0 // Replace with getTeachers() if you have it
        });
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { name: 'Total Students', count: stats.students, icon: <GraduationCap size={28}/>, color: 'bg-blue-600' },
    { name: 'Active Classes', count: stats.classes, icon: <Layers size={28}/>, color: 'bg-emerald-500' },
    { name: 'Announcements', count: 5, icon: <Bell size={28}/>, color: 'bg-orange-500' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-gray-800">Hello, {user?.name}! 👋</h1>
          <p className="text-gray-500 font-medium mt-2 uppercase tracking-widest text-xs">Role: {user?.role}</p>
        </div>
        <div className="hidden md:block bg-blue-50 px-6 py-3 rounded-2xl border border-blue-100">
          <p className="text-blue-600 font-bold flex items-center gap-2 text-sm">
            <Calendar size={18}/> {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card.name} className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-50 flex items-center justify-between group hover:scale-[1.02] transition-all">
            <div>
              <p className="text-gray-400 font-black text-[10px] uppercase tracking-tighter mb-1">{card.name}</p>
              <h2 className="text-4xl font-black text-gray-800">{card.count}</h2>
            </div>
            <div className={`${card.color} p-4 rounded-2xl text-white shadow-lg`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions / Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl">
          <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
            <TrendingUp className="text-blue-600" size={24}/> Community Growth
          </h3>
          <div className="h-48 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-400 font-bold italic">
            Chart content will appear here...
          </div>
        </div>
        
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl">
          <h3 className="text-xl font-black text-gray-800 mb-6">Recent Enrolled</h3>
          <div className="space-y-4">
            {/* You can map a slice of students here */}
            <p className="text-sm text-gray-400 font-medium">No recent activity found today.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;