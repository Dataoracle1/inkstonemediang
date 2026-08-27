import React, { useState } from 'react';
import { Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Store token
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.data.admin));
        
        toast.success('Login successful!');
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Login failed');
        toast.error(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Connection error. Check your backend is running.');
      toast.error('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: isDark ? '#0F1117' : '#FFFFFF',
      minHeight: 'calc(100vh - 200px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      transition: 'all 0.3s ease',
    }}>
      <style>{`
        .login-container {
          width: 100%;
          max-width: 420px;
          background: ${isDark ? '#161B22' : '#FAF9F6'};
          border: 1px solid ${isDark ? '#30363D' : '#E8E4DD'};
          border-radius: 8px;
          padding: 40px;
          box-shadow: 0 4px 12px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)'};
        }

        .login-logo {
          text-align: center;
          margin-bottom: 32px;
        }

        .logo-text {
          font-family: "Playfair Display", serif;
          font-size: 28px;
          font-weight: 700;
          color: ${isDark ? '#E8E4DD' : '#071A33'};
          margin: 0;
        }

        .logo-text .syd {
          color: ${isDark ? '#E8E4DD' : '#071A33'};
        }

        .logo-text .lines {
          color: #C4422F;
          font-style: italic;
        }

        .login-title {
          font-size: 20px;
          font-weight: 600;
          color: ${isDark ? '#E8E4DD' : '#071A33'};
          margin: 24px 0 8px;
          text-align: center;
        }

        .login-subtitle {
          font-size: 13px;
          color: ${isDark ? '#8B949E' : '#64748B'};
          text-align: center;
          margin: 0 0 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: ${isDark ? '#8B949E' : '#64748B'};
          font-family: "IBM Plex Mono", monospace;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .form-input-wrapper {
          position: relative;
        }

        .form-input {
          width: 100%;
          padding: 12px 14px;
          padding-right: 40px;
          background: ${isDark ? '#0D1117' : '#FFFFFF'};
          border: 1px solid ${isDark ? '#30363D' : '#E8E4DD'};
          border-radius: 4px;
          font-size: 14px;
          color: ${isDark ? '#E8E4DD' : '#071A33'};
          font-family: inherit;
          box-sizing: border-box;
          transition: all 0.2s ease;
        }

        .form-input::placeholder {
          color: ${isDark ? '#8B949E' : '#64748B'};
        }

        .form-input:focus {
          outline: none;
          border-color: #C4422F;
          background: ${isDark ? '#161B22' : '#FAF9F6'};
          box-shadow: 0 0 0 3px rgba(196, 66, 47, 0.1);
        }

        .toggle-password {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: ${isDark ? '#8B949E' : '#64748B'};
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 4px;
          transition: color 0.2s ease;
        }

        .toggle-password:hover {
          color: #C4422F;
        }

        .error-box {
          background: rgba(255, 107, 107, 0.1);
          border: 1px solid rgba(255, 107, 107, 0.3);
          border-radius: 4px;
          padding: 12px;
          margin-bottom: 20px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          color: #FF6B6B;
        }

        .error-icon {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .error-text {
          font-size: 13px;
          line-height: 1.5;
        }

        .forgot-link {
          text-align: right;
          margin-bottom: 20px;
        }

        .forgot-link a {
          font-size: 12px;
          color: #C4422F;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .forgot-link a:hover {
          text-decoration: underline;
        }

        .submit-btn {
          width: 100%;
          padding: 12px;
          background: #C4422F;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 16px;
        }

        .submit-btn:hover:not(:disabled) {
          background: #B23620;
          transform: translateY(-2px);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .signup-section {
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid ${isDark ? '#30363D' : '#E8E4DD'};
          font-size: 13px;
          color: ${isDark ? '#8B949E' : '#64748B'};
        }

        .signup-link {
          color: #C4422F;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .signup-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .login-container {
            padding: 30px 20px;
          }

          .login-title {
            font-size: 18px;
          }
        }
      `}</style>

      <div className="login-container">
        <div className="login-logo">
          <p className="logo-text">
            <span className="syd">SYD</span>
            <span className="lines"> LINES.</span>
          </p>
        </div>

        <h1 className="login-title">Admin Login</h1>
        <p className="login-subtitle">Enter your credentials to access the dashboard</p>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="error-box">
              <div className="error-icon">
                <AlertCircle size={18} />
              </div>
              <div className="error-text">{error}</div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="admin@sydlines.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="form-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="forgot-link">
            <Link to="/admin/forgot-password">Forgot password?</Link>
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="signup-section">
          New admin?{' '}
          <Link to="/admin/signup" className="signup-link">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;