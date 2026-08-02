import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 12px 12px 42px', border: '1px solid var(--ink-rule)',
    borderRadius: 2, fontSize: 14, outline: 'none', transition: '.2s', boxSizing: 'border-box',
    background: 'var(--ink-paper-dim)', color: 'var(--ink-ink)', fontFamily: "'Source Sans 3', sans-serif",
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink-wire)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <style>{`@keyframes ink-spin { to { transform: rotate(360deg); } }
        .ink-auth-input:focus { border-color: var(--ink-stamp) !important; }`}</style>

      <div style={{ maxWidth: 420, width: '100%' }}>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 className="ink-serif" style={{ fontSize: 34, fontWeight: 600, margin: 0, lineHeight: .9, color: '#eeeadf' }}>
            SYD<em style={{ fontStyle: 'italic', color: 'var(--ink-stamp)' }}>LINES</em>
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '8px 0 22px' }}>
            <span style={{ width: 20, height: 1, background: 'rgba(238,234,223,.25)' }} />
            <span className="ink-mono" style={{ fontSize: 10, letterSpacing: '.3em', color: 'rgba(238,234,223,.55)', fontWeight: 600 }}>MEDIA</span>
            <span style={{ width: 20, height: 1, background: 'rgba(238,234,223,.25)' }} />
          </div>
          <h2 className="ink-serif" style={{ fontSize: 22, fontWeight: 600, marginBottom: 8, color: '#eeeadf' }}>Admin Login</h2>
          <p style={{ fontSize: 14, color: 'rgba(238,234,223,.65)' }}>Enter your credentials to access the dashboard</p>
        </div>

        <div style={{ background: 'var(--ink-paper)', border: '1px solid var(--ink-rule)', borderRadius: 4, padding: 32 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {error && (
              <div style={{ padding: 14, background: 'var(--ink-stamp-dim)', border: '1px solid var(--ink-stamp)', borderRadius: 2, color: 'var(--ink-stamp)', fontSize: 13, fontWeight: 600 }}>
                {error}
              </div>
            )}

            <div>
              <label className="ink-mono" style={{ display: 'block', fontSize: 10, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--ink-ink-soft)' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-ink-soft)' }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="admin@sydlines.com" className="ink-auth-input" style={inputStyle} />
              </div>
            </div>

            <div>
              <label className="ink-mono" style={{ display: 'block', fontSize: 10, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--ink-ink-soft)' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-ink-soft)' }} />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="••••••••" className="ink-auth-input" style={{ ...inputStyle, paddingRight: 42 }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--ink-ink-soft)' }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Link to="/admin/forgot-password" className="ink-mono" style={{ fontSize: 12, color: 'var(--ink-stamp)', fontWeight: 600, textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={loading} className="ink-btn ink-btn-stamp" style={{ width: '100%', justifyContent: 'center', padding: 13, opacity: loading ? .7 : 1 }}>
              {loading ? (
                <>
                  <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,.5)', borderTopColor: 'white', borderRadius: '50%', animation: 'ink-spin .8s linear infinite' }} />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <LogIn size={17} />
                  <span>Login</span>
                </>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, marginTop: 22, color: 'var(--ink-ink-soft)' }}>
            Don't have an account?{' '}
            <Link to="/admin/signup" style={{ color: 'var(--ink-stamp)', fontWeight: 700, textDecoration: 'none' }}>
              Sign up here
            </Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, marginTop: 20 }}>
          <Link to="/" className="ink-mono" style={{ color: 'rgba(238,234,223,.6)', textDecoration: 'none' }}>
            &larr; Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;