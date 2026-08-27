import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isDark ? '#0f1419' : '#ffffff',
        transition: 'background-color 0.3s ease',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '40px',
          backgroundColor: isDark ? '#1a1f2e' : '#f9f9f9',
          borderRadius: '8px',
          boxShadow: isDark ? '0 0 20px rgba(0,0,0,0.3)' : '0 0 20px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: isDark ? '#fff' : '#000',
              margin: '0 0 8px 0',
            }}
          >
            SYDLINES
            <span style={{ color: '#d32f2f' }}>.</span>
          </h1>
          <p
            style={{
              fontSize: '11px',
              letterSpacing: '2px',
              fontWeight: 600,
              color: isDark ? '#999' : '#666',
              margin: '0 0 12px 0',
            }}
          >
            SMART NEWS. REAL IMPACT.
          </p>
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: isDark ? '#fff' : '#000',
              margin: '0',
            }}
          >
            Admin Login
          </h2>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: '#fee',
              border: '1px solid #fcc',
              color: '#c33',
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '20px',
              fontSize: '13px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: isDark ? '#fff' : '#000',
                marginBottom: '6px',
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: isDark ? '1px solid #444' : '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: isDark ? '#2a2f3e' : '#fff',
                color: isDark ? '#fff' : '#000',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: isDark ? '#fff' : '#000',
                marginBottom: '6px',
              }}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Your password"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: isDark ? '1px solid #444' : '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: isDark ? '#2a2f3e' : '#fff',
                color: isDark ? '#fff' : '#000',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px',
              backgroundColor: '#d32f2f',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginTop: '8px',
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: isDark ? '1px solid #333' : '1px solid #ddd' }}>
          <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: isDark ? '#999' : '#666' }}>
            Don't have an account?{' '}
            <Link
              to="/admin/signup"
              style={{ color: '#d32f2f', textDecoration: 'none', fontWeight: 600 }}
            >
              Create one
            </Link>
          </p>
          <Link
            to="/admin/forgot-password"
            style={{
              fontSize: '13px',
              color: '#d32f2f',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;