import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDark } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

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
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <h1 className="ink-serif" style={{
            fontSize: 28,
            fontWeight: 600,
            marginBottom: 8,
            color: 'var(--ink-ink)',
          }}>
            Admin Login
          </h1>
          <p style={{ fontSize: 13, color: 'var(--ink-ink-soft)' }}>
            Enter your credentials to access the dashboard
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
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '1px solid var(--ink-rule)',
                borderRadius: 4,
                background: 'var(--ink-paper)',
                color: 'var(--ink-ink)',
                fontSize: 14,
                boxSizing: 'border-box',
              }}
              placeholder="your@email.com"
            />
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
              Password
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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'opacity 0.2s',
            }}
          >
            <LogIn size={18} />
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{
          marginTop: 24,
          paddingTop: 24,
          borderTop: '1px solid var(--ink-rule)',
          textAlign: 'center',
          fontSize: 13,
        }}>
          <p style={{ color: 'var(--ink-ink-soft)', marginBottom: 8 }}>Don't have an account?</p>
          <Link
            to="/admin/signup"
            style={{
              color: 'var(--ink-stamp)',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Create one here
          </Link>
        </div>

        <div style={{
          marginTop: 16,
          textAlign: 'center',
        }}>
          <Link
            to="/admin/forgot-password"
            style={{
              color: 'var(--ink-ink-soft)',
              textDecoration: 'none',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;