import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Key } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { authAPI } from '../../utils/api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await authAPI.resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: isDark ? '#1a1a1a' : 'var(--ink-paper)',
      }}>
        <div style={{
          width: '100%',
          maxWidth: 400,
          padding: 32,
          border: '1px solid var(--ink-rule)',
          background: 'var(--ink-card)',
          textAlign: 'center',
        }}>
          <div style={{ marginBottom: 32 }}>
            <h1 className="ink-serif" style={{
              fontSize: 28,
              fontWeight: 600,
              marginBottom: 16,
              color: 'var(--ink-ink)',
            }}>
              Password Reset
            </h1>
            <p style={{ fontSize: 13, color: 'var(--ink-ink-soft)', lineHeight: 1.6 }}>
              Your password has been successfully reset. You can now login with your new password.
            </p>
          </div>

          <button
            onClick={() => navigate('/admin/login')}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'var(--ink-stamp)',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: isDark ? '#1a1a1a' : 'var(--ink-paper)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 400,
        padding: 32,
        border: '1px solid var(--ink-rule)',
        background: 'var(--ink-card)',
      }}>
        <div style={{ marginBottom: 32 }}>
          <h1 className="ink-serif" style={{
            fontSize: 28,
            fontWeight: 600,
            marginBottom: 8,
            color: 'var(--ink-ink)',
          }}>
            Reset Password
          </h1>
          <p style={{ fontSize: 13, color: 'var(--ink-ink-soft)' }}>
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              padding: '12px 14px',
              marginBottom: 16,
              background: 'rgba(200,50,50,0.1)',
              border: '1px solid var(--ink-stamp)',
              borderRadius: 4,
              color: 'var(--ink-stamp)',
              fontSize: 12,
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 8,
              color: 'var(--ink-ink-soft)',
              textTransform: 'uppercase',
              letterSpacing: '.05em',
            }}>
              New Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  paddingLeft: 40,
                  paddingRight: 40,
                  border: '1px solid var(--ink-rule)',
                  borderRadius: 4,
                  background: 'var(--ink-paper)',
                  color: 'var(--ink-ink)',
                  fontSize: 14,
                  boxSizing: 'border-box',
                }}
                placeholder="••••••••"
              />
              <Key size={18} style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--ink-ink-soft)',
              }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--ink-ink-soft)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 8,
              color: 'var(--ink-ink-soft)',
              textTransform: 'uppercase',
              letterSpacing: '.05em',
            }}>
              Confirm Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  paddingLeft: 40,
                  paddingRight: 40,
                  border: '1px solid var(--ink-rule)',
                  borderRadius: 4,
                  background: 'var(--ink-paper)',
                  color: 'var(--ink-ink)',
                  fontSize: 14,
                  boxSizing: 'border-box',
                }}
                placeholder="••••••••"
              />
              <Key size={18} style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--ink-ink-soft)',
              }} />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--ink-ink-soft)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'var(--ink-stamp)',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              fontWeight: 600,
              fontSize: 14,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div style={{
          marginTop: 24,
          paddingTop: 24,
          borderTop: '1px solid var(--ink-rule)',
          textAlign: 'center',
        }}>
          <Link
            to="/admin/login"
            style={{
              color: 'var(--ink-stamp)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;