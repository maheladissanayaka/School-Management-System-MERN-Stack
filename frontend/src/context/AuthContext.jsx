import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Create the Context
// The comment below suppresses the warning because exporting Context is necessary
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

// 2. AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Auth hydration error:", error);
        localStorage.clear();
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 3. Custom Hook
// The comment below suppresses the warning because exporting a Hook is standard practice
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};