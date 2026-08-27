import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        toast.success('Reset email sent!');
      } else {
        setError(data.message || 'Failed to send reset email');
        toast.error(data.message || 'Failed to send reset email');
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
        .forgot-container {
          width: 100%;
          max-width: 420px;
          background: ${isDark ? '#161B22' : '#FAF9F6'};
          border: 1px solid ${isDark ? '#30363D' : '#E8E4DD'};
          border-radius: 8px;
          padding: 40px;
          box-shadow: 0 4px 12px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)'};
        }

        .back-btn {
          background: none;
          border: none;
          color: #C4422F;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 20px;
          transition: all 0.2s ease;
          text-decoration: none;
          padding: 0;
        }

        .back-btn:hover {
          color: #B23620;
        }

        .forgot-title {
          font-family: "Playfair Display", serif;
          font-size: 28px;
          font-weight: 700;
          color: ${isDark ? '#E8E4DD' : '#071A33'};
          margin: 0 0 8px;
        }

        .forgot-subtitle {
          font-size: 13px;
          color: ${isDark ? '#8B949E' : '#64748B'};
          margin: 0 0 24px;
          line-height: 1.6;
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

        .form-input {
          width: 100%;
          padding: 12px 14px;
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

        .success-box {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 4px;
          padding: 20px;
          text-align: center;
          margin-bottom: 20px;
        }

        .success-icon {
          font-size: 48px;
          margin-bottom: 12px;
          display: flex;
          justify-content: center;
          color: #22c55e;
        }

        .success-title {
          font-family: "Playfair Display", serif;
          font-size: 20px;
          font-weight: 700;
          color: #22c55e;
          margin: 0 0 8px;
        }

        .success-text {
          font-size: 13px;
          color: ${isDark ? '#8B949E' : '#64748B'};
          line-height: 1.6;
          margin: 0;
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
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
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

        .login-section {
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid ${isDark ? '#30363D' : '#E8E4DD'};
          font-size: 13px;
          color: ${isDark ? '#8B949E' : '#64748B'};
        }

        .login-link {
          color: #C4422F;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .login-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .forgot-container {
            padding: 30px 20px;
          }

          .forgot-title {
            font-size: 24px;
          }
        }
      `}</style>

      <div className="forgot-container">
        <Link to="/admin/login" className="back-btn">
          <ArrowLeft size={16} /> Back to Login
        </Link>

        {success ? (
          <div className="success-box">
            <div className="success-icon">
              <CheckCircle size={48} />
            </div>
            <h2 className="success-title">Check Your Email</h2>
            <p className="success-text">
              We've sent a password reset link to <strong>{email}</strong>. 
              Click the link to reset your password. The link expires in 1 hour.
            </p>
            <div style={{ marginTop: '20px' }}>
              <p style={{ fontSize: '12px', color: isDark ? '#8B949E' : '#64748B', margin: '0 0 12px' }}>
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <button 
                onClick={() => setSuccess(false)}
                style={{
                  background: '#C4422F',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                }}
              >
                Try Another Email
              </button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="forgot-title">Reset Password</h1>
            <p className="forgot-subtitle">
              Enter your email address and we'll send you a link to reset your password.
            </p>

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

              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                <Mail size={16} />
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        )}

        <div className="login-section">
          Remember your password?{' '}
          <Link to="/admin/login" className="login-link">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;