import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Eye, EyeOff, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';

const AdminSignup = () => {
  const [searchParams] = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [inviteCode, setInviteCode] = useState(searchParams.get('code') || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [requiresInviteCode, setRequiresInviteCode] = useState(null);
  const [checkingFirstAdmin, setCheckingFirstAdmin] = useState(true);

  const { signup } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { checkFirstAdmin(); }, []);

  const checkFirstAdmin = async () => {
    try {
      const response = await authAPI.checkFirstAdmin();
      setRequiresInviteCode(response.data.data.requiresInviteCode);
    } catch (error) {
      setRequiresInviteCode(false);
    } finally {
      setCheckingFirstAdmin(false);
    }
  };

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
    if (requiresInviteCode && !inviteCode.trim()) {
      setError('Invite code is required');
      return;
    }
    setLoading(true);
    const result = await signup(name, email, password, inviteCode || undefined);
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

  if (checkingFirstAdmin) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--ink-wire)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 44, height: 44, border: '3px solid rgba(238,234,223,.25)', borderTopColor: 'var(--ink-stamp)', borderRadius: '50%', animation: 'ink-spin .8s linear infinite' }} />
        <style>{`@keyframes ink-spin{to{transform:rotate(360deg);}}`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink-wire)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <style>{`@keyframes ink-spin { to { transform: rotate(360deg); } }
        .ink-auth-input:focus { border-color: var(--ink-stamp) !important; }`}</style>

      <div style={{ maxWidth: 440, width: '100%' }}>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 className="ink-serif" style={{ fontSize: 32, fontWeight: 600, margin: 0, lineHeight: .9, color: '#eeeadf' }}>
            SYD<em style={{ fontStyle: 'italic', color: 'var(--ink-stamp)' }}>LINES</em>
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '8px 0 20px' }}>
            <span style={{ width: 20, height: 1, background: 'rgba(238,234,223,.25)' }} />
            <span className="ink-mono" style={{ fontSize: 10, letterSpacing: '.3em', color: 'rgba(238,234,223,.55)', fontWeight: 600 }}>MEDIA</span>
            <span style={{ width: 20, height: 1, background: 'rgba(238,234,223,.25)' }} />
          </div>
          <h2 className="ink-serif" style={{ fontSize: 22, fontWeight: 600, marginBottom: 8, color: '#eeeadf' }}>
            {requiresInviteCode ? 'Join Admin Team' : 'Create Super Admin Account'}
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(238,234,223,.65)' }}>
            {requiresInviteCode ? 'Enter your invite code to create an account' : 'You will be the first admin with full control'}
          </p>
        </div>

        <div style={{ background: 'var(--ink-paper)', border: '1px solid var(--ink-rule)', borderRadius: 4, padding: 32 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {error && (
              <div style={{ padding: 14, background: 'var(--ink-stamp-dim)', border: '1px solid var(--ink-stamp)', borderRadius: 2, color: 'var(--ink-stamp)', fontSize: 13, fontWeight: 600 }}>
                {error}
              </div>
            )}

            {requiresInviteCode && (
              <div>
                <label className="ink-mono" style={{ display: 'block', fontSize: 10, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--ink-ink-soft)' }}>
                  Invite Code <span style={{ color: 'var(--ink-stamp)' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Key size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-ink-soft)' }} />
                  <input type="text" value={inviteCode} onChange={e => setInviteCode(e.target.value.toUpperCase())} required
                    placeholder="INK-XXXX-XXXX" className="ink-auth-input" style={{ ...inputStyle, textTransform: 'uppercase' }} />
                </div>
                <p style={{ fontSize: 11, marginTop: 4, color: 'var(--ink-ink-soft)' }}>Get this from your administrator</p>
              </div>
            )}

            <div>
              <label className="ink-mono" style={{ display: 'block', fontSize: 10, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--ink-ink-soft)' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-ink-soft)' }} />
                <input type="text" value={name} onChange={e => setName(e.target.value)} required
                  placeholder="John Doe" className="ink-auth-input" style={inputStyle} />
              </div>
            </div>

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
              <p style={{ fontSize: 11, marginTop: 4, color: 'var(--ink-ink-soft)' }}>Minimum 6 characters</p>
            </div>

            <div>
              <label className="ink-mono" style={{ display: 'block', fontSize: 10, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--ink-ink-soft)' }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-ink-soft)' }} />
                <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
                  placeholder="••••••••" className="ink-auth-input" style={{ ...inputStyle, paddingRight: 42 }} />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--ink-ink-soft)' }}>
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="ink-btn ink-btn-stamp" style={{ width: '100%', justifyContent: 'center', padding: 13, marginTop: 6, opacity: loading ? .7 : 1 }}>
              {loading ? (
                <>
                  <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,.5)', borderTopColor: 'white', borderRadius: '50%', animation: 'ink-spin .8s linear infinite' }} />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <UserPlus size={17} />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, marginTop: 22, color: 'var(--ink-ink-soft)' }}>
            Already have an account?{' '}
            <Link to="/admin/login" style={{ color: 'var(--ink-stamp)', fontWeight: 700, textDecoration: 'none' }}>
              Login here
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

export default AdminSignup;