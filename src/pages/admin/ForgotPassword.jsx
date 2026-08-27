import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { authAPI } from '../../utils/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authAPI.forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
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
              Check your email
            </h1>
            <p style={{ fontSize: 13, color: 'var(--ink-ink-soft)', lineHeight: 1.6 }}>
              We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and click the link to reset your password.
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
            Back to Login
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
        <Link
          to="/admin/login"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 24,
            color: 'var(--ink-stamp)',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          <ArrowLeft size={16} />
          Back to Login
        </Link>

        <div style={{ marginBottom: 32 }}>
          <h1 className="ink-serif" style={{
            fontSize: 28,
            fontWeight: 600,
            marginBottom: 8,
            color: 'var(--ink-ink)',
          }}>
            Forgot Password
          </h1>
          <p style={{ fontSize: 13, color: 'var(--ink-ink-soft)' }}>
            Enter your email and we'll send you a link to reset your password
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
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  paddingLeft: 40,
                  border: '1px solid var(--ink-rule)',
                  borderRadius: 4,
                  background: 'var(--ink-paper)',
                  color: 'var(--ink-ink)',
                  fontSize: 14,
                  boxSizing: 'border-box',
                }}
                placeholder="your@email.com"
              />
              <Mail size={18} style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--ink-ink-soft)',
              }} />
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
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;