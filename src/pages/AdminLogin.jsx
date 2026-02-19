

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ── Sync dark mode with Navbar toggle ──
  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains('dark')
  );
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

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

  // ── Color tokens ──
  const pageBg       = isDark ? 'linear-gradient(135deg,#0f1a12 0%,#14532d 100%)' : 'linear-gradient(135deg,#f0fdf4 0%,#dcfce7 100%)';
  const cardBg       = isDark ? '#1e293b' : 'white';
  const cardBorder   = isDark ? '#334155' : 'transparent';
  const headingColor = isDark ? '#f1f5f9' : '#111827';
  const subText      = isDark ? '#94a3b8' : '#4b5563';
  const labelColor   = isDark ? '#cbd5e1' : '#374151';
  const inputBg      = isDark ? '#0f172a' : 'white';
  const inputBorderColor = isDark ? '#475569' : '#d1d5db';
  const iconColor    = isDark ? '#64748b' : '#9ca3af';
  const inputColor   = isDark ? '#f1f5f9' : '#111827';

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", minHeight: '100vh', background: pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, transition: 'background .3s' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ maxWidth: 440, width: '100%' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(22,163,74,.3)' }}>
              <span style={{ color: 'white', fontSize: 24, fontWeight: 800 }}>I</span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 800, margin: 0, color: headingColor, transition: 'color .3s' }}>
              INKSTONE <span style={{ color: '#16a34a' }}>MEDIA</span>
            </h1>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 800, marginBottom: 8, color: headingColor, transition: 'color .3s' }}>
            Admin Login
          </h2>
          <p style={{ fontSize: 15, color: subText, transition: 'color .3s' }}>
            Enter your credentials to access the dashboard
          </p>
        </div>

        {/* Login Card */}
        <div style={{ background: cardBg, borderRadius: 24, padding: 32, boxShadow: '0 8px 32px rgba(0,0,0,.12)', border: `1px solid ${cardBorder}`, transition: 'background .3s, border-color .3s' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Error */}
            {error && (
              <div style={{ padding: 16, background: isDark ? '#450a0a' : '#fee2e2', border: `1px solid ${isDark ? '#b91c1c' : '#fca5a5'}`, borderRadius: 12, color: isDark ? '#fca5a5' : '#dc2626', fontSize: 14, fontWeight: 600 }}>
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: .3, color: labelColor }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={20} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: iconColor }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="admin@inkstone.com"
                  style={{ width: '100%', padding: '12px 12px 12px 44px', border: `1.5px solid ${inputBorderColor}`, borderRadius: 12, fontSize: 14, outline: 'none', fontFamily: 'DM Sans,sans-serif', transition: '.2s', boxSizing: 'border-box', background: inputBg, color: inputColor }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#16a34a', e.currentTarget.style.boxShadow = '0 0 0 3px rgba(22,163,74,.1)')}
                  onBlur={e => (e.currentTarget.style.borderColor = inputBorderColor, e.currentTarget.style.boxShadow = '')} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: .3, color: labelColor }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={20} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: iconColor }} />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '12px 44px 12px 44px', border: `1.5px solid ${inputBorderColor}`, borderRadius: 12, fontSize: 14, outline: 'none', fontFamily: 'DM Sans,sans-serif', transition: '.2s', boxSizing: 'border-box', background: inputBg, color: inputColor }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#16a34a', e.currentTarget.style.boxShadow = '0 0 0 3px rgba(22,163,74,.1)')}
                  onBlur={e => (e.currentTarget.style.borderColor = inputBorderColor, e.currentTarget.style.boxShadow = '')} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: iconColor, transition: '.2s' }}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Link to="/admin/forgot-password"
                style={{ fontSize: 14, color: '#16a34a', fontWeight: 600, textDecoration: 'none', transition: '.2s' }}>
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '14px', background: loading ? '#9ca3af' : 'linear-gradient(to right,#16a34a,#15803d)', color: 'white', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: loading ? 'none' : '0 4px 16px rgba(22,163,74,.35)', transition: '.2s', fontFamily: 'DM Sans,sans-serif' }}
              onMouseEnter={e => !loading && (e.currentTarget.style.transform = 'translateY(-1px)', e.currentTarget.style.boxShadow = '0 6px 20px rgba(22,163,74,.4)')}
              onMouseLeave={e => !loading && (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = '0 4px 16px rgba(22,163,74,.35)')}>
              {loading ? (
                <>
                  <div style={{ width: 20, height: 20, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Login</span>
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <p style={{ textAlign: 'center', fontSize: 14, marginTop: 24, color: subText }}>
            Don't have an account?{' '}
            <Link to="/admin/signup"
              style={{ color: '#16a34a', fontWeight: 700, textDecoration: 'none', transition: '.2s' }}>
              Sign up here
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <p style={{ textAlign: 'center', fontSize: 14, marginTop: 24 }}>
          <Link to="/"
            style={{ color: subText, textDecoration: 'none', transition: '.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#16a34a'}
            onMouseLeave={e => e.currentTarget.style.color = subText}>
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;