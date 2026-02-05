import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Loader2, LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Get the login function from Context (It only updates state, doesn't return anything)
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Call the Backend directly here
      // Adjust the URL if your backend port is different
      const res = await axios.post('http://localhost:5000/api/auth/login', { 
        email, 
        password 
      });

      // 2. Check if we got the token and user data
      if (res.data.token && res.data.user) {
        // 3. Update the Context state
        login(res.data.user, res.data.token);
        
        toast.success("Welcome back!");
        
        // 4. Redirect based on role
        navigate('/home'); 
      }
    } catch (err) {
      console.error(err);
      // specific error message from backend or generic one
      toast.error(err.response?.data?.msg || "Login failed. Check credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-800">School LMS</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">Sign In to Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full p-4 bg-gray-50 rounded-xl font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Password</label>
            <input 
              type="password" 
              required
              className="w-full p-4 bg-gray-50 rounded-xl font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <LogIn size={20} />} 
            {isLoading ? "Signing In..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;