import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ink-paper)' }}>
        <style>{`@keyframes ink-spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ width: 44, height: 44, border: '3px solid var(--ink-rule)', borderTopColor: 'var(--ink-stamp)', borderRadius: '50%', animation: 'ink-spin .8s linear infinite' }} />
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