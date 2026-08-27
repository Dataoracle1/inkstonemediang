import React, { useState, useEffect } from 'react';
import { Lock, ArrowLeft, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTheme } from "../../context/ThemeContext";
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const { isDark } = useTheme();
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [email, setEmail] = useState('');

  // Verify token on mount
  useEffect(() => {
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await fetch(`/api/auth/verify-reset-token/${token}`);
      const data = await response.json();

      if (data.success) {
        setEmail(data.data.email);
        setVerifying(false);
      } else {
        setError(data.message || 'Invalid or expired reset link');
        setVerifying(false);
      }
    } catch (err) {
      setError('Connection error. Check your backend is running.');
      setVerifying(false);
    }
  };

  const passwordsMatch = password === confirmPassword && password.length > 0;
  const passwordStrong = password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!passwordsMatch) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!passwordStrong) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/auth/reset-password/${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, confirmPassword }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        toast.success('Password reset successful!');
        setTimeout(() => navigate('/admin/login'), 2000);
      } else {
        setError(data.message || 'Password reset failed');
        toast.error(data.message || 'Password reset failed');
      }
    } catch (err) {
      setError('Connection error. Try again.');
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
        .reset-container {
          width: 100%;
          max-width: 420px;
          background: ${isDark ? '#161B22' : '#FAF9F6'};
          border: 1px solid ${isDark ? '#30363D' : '#E8E4DD'};
          border-radius: 8px;
          padding: 40px;
          box-shadow: 0 4px 12px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)'};
        }

        .reset-title {
          font-family: "Playfair Display", serif;
          font-size: 28px;
          font-weight: 700;
          color: ${isDark ? '#E8E4DD' : '#071A33'};
          margin: 0 0 8px;
        }

        .reset-subtitle {
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

        .form-input-wrapper {
          position: relative;
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

        .password-strength {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
          font-size: 12px;
        }

        .strength-indicator {
          color: ${passwordStrong ? '#22c55e' : isDark ? '#8B949E' : '#64748B'};
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .match-indicator {
          color: ${passwordsMatch ? '#22c55e' : password.length > 0 ? '#FF6B6B' : isDark ? '#8B949E' : '#64748B'};
          display: flex;
          align-items: center;
          gap: 4px;
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
          margin-top: 24px;
        }

        .submit-btn:hover:not(:disabled) {
          background: #B23620;
          transform: translateY(-2px);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .loading-text {
          text-align: center;
          color: ${isDark ? '#8B949E' : '#64748B'};
          font-size: 14px;
        }

        @media (max-width: 480px) {
          .reset-container {
            padding: 30px 20px;
          }

          .reset-title {
            font-size: 24px;
          }
        }
      `}</style>

      <div className="reset-container">
        {verifying ? (
          <div className="loading-text">Verifying reset link...</div>
        ) : error && error.includes('Invalid') ? (
          <>
            <h1 className="reset-title">Reset Link Invalid</h1>
            <div className="error-box">
              <div className="error-icon">
                <AlertCircle size={18} />
              </div>
              <div className="error-text">{error}</div>
            </div>
            <p style={{ fontSize: '13px', color: isDark ? '#8B949E' : '#64748B', marginTop: '20px' }}>
              <Link to="/admin/forgot-password" style={{ color: '#C4422F', textDecoration: 'none', fontWeight: '600' }}>
                Request a new password reset link
              </Link>
            </p>
          </>
        ) : success ? (
          <div className="success-box">
            <div className="success-icon">
              <CheckCircle size={48} />
            </div>
            <h2 className="success-title">Password Reset Successful</h2>
            <p className="success-text">
              Your password has been updated. You will be redirected to login shortly...
            </p>
          </div>
        ) : (
          <>
            <h1 className="reset-title">Set New Password</h1>
            <p className="reset-subtitle">
              Create a strong new password for {email}
            </p>

            <form onSubmit={handleSubmit}>
              {error && !error.includes('Invalid') && (
                <div className="error-box">
                  <div className="error-icon">
                    <AlertCircle size={18} />
                  </div>
                  <div className="error-text">{error}</div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">New Password</label>
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
                <div className="password-strength">
                  <div className="strength-indicator">
                    {passwordStrong ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                    {passwordStrong ? 'Strong' : '6+ characters'}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="form-input-wrapper">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    className="form-input"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {password.length > 0 && (
                  <div className="password-strength">
                    <div className="match-indicator">
                      {passwordsMatch ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                      {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={loading || !passwordsMatch || !passwordStrong}
              >
                <Lock size={16} />
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;