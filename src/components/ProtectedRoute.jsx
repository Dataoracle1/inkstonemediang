
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAuth();

  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

 
  if (!admin) {
    console.log('❌ No admin, redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }

  console.log('✅ Admin authenticated:', admin.email);
  return children;
};

export default ProtectedRoute;