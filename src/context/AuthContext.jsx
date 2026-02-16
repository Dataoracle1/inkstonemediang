

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const token = localStorage.getItem('token');
    const savedAdmin = localStorage.getItem('admin');

    if (token && savedAdmin) {
      try {
        setAdmin(JSON.parse(savedAdmin));
      } catch (error) {
        console.error('Error parsing saved admin:', error);
        localStorage.removeItem('admin');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { admin: adminData, token } = response.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('admin', JSON.stringify(adminData));
      setAdmin(adminData);

      return { success: true, admin: adminData };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, error: message };
    }
  };

  
  const signup = async (name, email, password, inviteCode) => {
    try {
      
      const payload = { name, email, password };
      
     
      if (inviteCode) {
        payload.inviteCode = inviteCode;
      }

      const response = await authAPI.signup(payload);
      const { admin: adminData, token } = response.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('admin', JSON.stringify(adminData));
      setAdmin(adminData);

      return { success: true, admin: adminData };
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed';
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    setAdmin(null);
  };

  const value = {
    admin,
    loading,
    isAuthenticated: !!admin,
    isSuperAdmin: admin?.role === 'super-admin',
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};