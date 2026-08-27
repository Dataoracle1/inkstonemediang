import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('authToken');
      const savedAdmin = localStorage.getItem('adminUser');

      if (savedToken && savedAdmin) {
        try {
          setToken(savedToken);
          setAdmin(JSON.parse(savedAdmin));
        } catch (err) {
          console.error('Auth init error:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await api.post('/auth/login', { email, password });

      if (response.data.success) {
        const { token, admin } = response.data.data;
        localStorage.setItem('authToken', token);
        localStorage.setItem('adminUser', JSON.stringify(admin));
        setToken(token);
        setAdmin(admin);
        return { success: true, data: response.data.data };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    }
  };

  const signup = async (name, email, password, inviteCode) => {
    try {
      setError(null);
      const payload = { name, email, password };
      if (inviteCode) payload.inviteCode = inviteCode;

      const response = await api.post('/auth/signup', payload);

      if (response.data.success) {
        const { token, admin } = response.data.data;
        localStorage.setItem('authToken', token);
        localStorage.setItem('adminUser', JSON.stringify(admin));
        setToken(token);
        setAdmin(admin);
        return { success: true, data: response.data.data };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Signup failed';
      setError(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminUser');
    setToken(null);
    setAdmin(null);
    setError(null);
  };

  const forgotPassword = async (email) => {
    try {
      setError(null);
      const response = await api.post('/auth/forgot-password', { email });
      return { success: response.data.success, message: response.data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to send reset email';
      setError(message);
      return { success: false, message };
    }
  };

  const resetPassword = async (token, password, confirmPassword) => {
    try {
      setError(null);
      const response = await api.put('/auth/reset-password/' + token, {
        password,
        confirmPassword,
      });
      return { success: response.data.success, message: response.data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to reset password';
      setError(message);
      return { success: false, message };
    }
  };

  const verifyResetToken = async (token) => {
    try {
      const response = await api.get('/auth/verify-reset-token/' + token);
      return { success: response.data.success, email: response.data.data?.email };
    } catch (err) {
      return { success: false };
    }
  };

  const checkFirstAdmin = async () => {
    try {
      const response = await api.get('/auth/check-first-admin');
      return response.data.data;
    } catch (err) {
      console.error('Check first admin error:', err);
      return { isFirstAdmin: false, requiresInviteCode: true };
    }
  };

  const value = {
    admin,
    token,
    loading,
    error,
    isAuthenticated: !!token && !!admin,
    login,
    signup,
    logout,
    forgotPassword,
    resetPassword,
    verifyResetToken,
    checkFirstAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};