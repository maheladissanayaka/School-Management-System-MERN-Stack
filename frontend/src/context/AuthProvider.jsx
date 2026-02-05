import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import API from '../api/axiosInstance';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Move Logout to the top
  // Using useCallback prevents unnecessary re-renders of components using logout
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  }, []);

  // 2. useEffect now "sees" logout because it is defined above it
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Optional: Verify token with backend
          // await API.get('/auth/verify'); 
        } catch (err) {
          console.error("Session invalid:", err);
          logout(); // This now works!
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [logout]); // Add logout as a dependency

  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user)); 
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, message: "Invalid response" };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || "Login failed" 
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};