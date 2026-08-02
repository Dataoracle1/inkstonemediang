import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const getApiUrl = () => {
    const baseUrl = import.meta.env.VITE_API_URL;
    return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
  };

  useEffect(() => { verifyToken(); }, [token]);

  const verifyToken = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/auth/verify-reset-token/${token}`);
      const data = await response.json();
      if (data.success) {
        setTokenValid(true);
        setUserEmail(data.data.email);
      } else {
        setTokenValid(false);
        setError(data.message || 'Invalid or expired reset token');
      }
    } catch (err) {
      setTokenValid(false);
      setError('Failed to verify reset token');
      console.error('Token verification error:', err);
    } finally {
      setVerifying(false);
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

    setLoading(true);
    try {
      const response = await fetch(`${getApiUrl()}/auth/reset-password/${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, confirmPassword }),
      });
      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => navigate('/admin/login'), 3000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Reset password error:', err);
    } finally {
      setLoading(false);
    }
  };

  const Wrapper = ({ children }) => (
    <div style={{ minHeight: '100vh', background: 'var(--ink-wire)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <style>{`@keyframes ink-spin { to { transform: rotate(360deg); } } .ink-auth-input:focus { border-color: var(--ink-stamp) !important; }`}</style>
      <div style={{ maxWidth: 420, width: '100%' }}>{children}</div>
    </div>
  );

  const Header = () => (
    <div style={{ textAlign: 'center', marginBottom: 28 }}>
      <h1 className="ink-serif" style={{ fontSize: 30, fontWeight: 600, margin: 0, lineHeight: .9, color: '#eeeadf' }}>
        SYD<em style={{ fontStyle: 'italic', color: 'var(--ink-stamp)' }}>LINES</em>
      </h1>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 }}>
        <span style={{ width: 20, height: 1, background: 'rgba(238,234,223,.25)' }} />
        <span className="ink-mono" style={{ fontSize: 10, letterSpacing: '.3em', color: 'rgba(238,234,223,.55)', fontWeight: 600 }}>MEDIA</span>
        <span style={{ width: 20, height: 1, background: 'rgba(238,234,223,.25)' }} />
      </div>
    </div>
  );

  if (verifying) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--ink-wire)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 44, height: 44, border: '3px solid rgba(238,234,223,.25)', borderTopColor: 'var(--ink-stamp)', borderRadius: '50%', animation: 'ink-spin .8s linear infinite', margin: '0 auto 16px' }} />
          <style>{`@keyframes ink-spin{to{transform:rotate(360deg);}}`}</style>
          <p style={{ color: 'rgba(238,234,223,.7)', fontSize: 14 }}>Verifying reset token...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <Wrapper>
        <Header />
        <div style={{ background: 'var(--ink-paper)', border: '1px solid var(--ink-rule)', borderRadius: 4, padding: 32, textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, border: '1.5px solid var(--ink-stamp)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
            <AlertCircle color="var(--ink-stamp)" size={28} />
          </div>
          <h2 className="ink-serif" style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink-ink)', marginBottom: 14 }}>Invalid or Expired Link</h2>
          <p style={{ color: 'var(--ink-ink-soft)', marginBottom: 20, fontSize: 14, lineHeight: 1.6 }}>
            {error || 'This password reset link is invalid or has expired.'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link to="/admin/forgot-password" className="ink-btn ink-btn-stamp" style={{ width: '100%', justifyContent: 'center', padding: 12 }}>
              <span>Request New Reset Link</span>
            </Link>
            <Link to="/admin/login" className="ink-btn" style={{ width: '100%', justifyContent: 'center', padding: 12 }}>
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </Wrapper>
    );
  }

  if (success) {
    return (
      <Wrapper>
        <Header />
        <div style={{ background: 'var(--ink-paper)', border: '1px solid var(--ink-rule)', borderRadius: 4, padding: 32, textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, border: '1.5px solid var(--ink-wire-bright)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
            <CheckCircle color="var(--ink-wire-bright)" size={28} />
          </div>
          <h2 className="ink-serif" style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink-ink)', marginBottom: 14 }}>Password Reset Successful!</h2>
          <p style={{ color: 'var(--ink-ink-soft)', marginBottom: 20, fontSize: 14, lineHeight: 1.6 }}>
            Your password has been reset successfully. You can now login with your new password.
          </p>
          <p className="ink-mono" style={{ fontSize: 12, color: 'var(--ink-ink-soft)' }}>
            Redirecting to login page in 3 seconds...
          </p>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Header />
      <div style={{ textAlign: 'center', marginBottom: 22 }}>
        <h2 className="ink-serif" style={{ fontSize: 22, fontWeight: 600, color: '#eeeadf' }}>Reset Your Password</h2>
        <p style={{ color: 'rgba(238,234,223,.65)', marginTop: 8, fontSize: 14 }}>
          Enter your new password for <strong>{userEmail}</strong>
        </p>
      </div>

      <div style={{ background: 'var(--ink-paper)', border: '1px solid var(--ink-rule)', borderRadius: 4, padding: 32 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {error && (
            <div style={{ padding: 14, background: 'var(--ink-stamp-dim)', border: '1px solid var(--ink-stamp)', borderRadius: 2, color: 'var(--ink-stamp)', fontSize: 13, fontWeight: 600 }}>
              {error}
            </div>
          )}

          <div>
            <label className="ink-mono" style={{ display: 'block', fontSize: 10, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--ink-ink-soft)' }}>
              New Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-ink-soft)' }} />
              <input
                type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="••••••••" className="ink-auth-input"
                style={{ width: '100%', padding: '12px 42px 12px 42px', border: '1px solid var(--ink-rule)', borderRadius: 2, fontSize: 14, outline: 'none', boxSizing: 'border-box', background: 'var(--ink-paper-dim)', color: 'var(--ink-ink)' }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-ink-soft)' }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p style={{ fontSize: 11, color: 'var(--ink-ink-soft)', marginTop: 4 }}>Minimum 6 characters</p>
          </div>

          <div>
            <label className="ink-mono" style={{ display: 'block', fontSize: 10, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--ink-ink-soft)' }}>
              Confirm New Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-ink-soft)' }} />
              <input
                type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
                placeholder="••••••••" className="ink-auth-input"
                style={{ width: '100%', padding: '12px 42px 12px 42px', border: '1px solid var(--ink-rule)', borderRadius: 2, fontSize: 14, outline: 'none', boxSizing: 'border-box', background: 'var(--ink-paper-dim)', color: 'var(--ink-ink)' }}
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-ink-soft)' }}>
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="ink-btn ink-btn-stamp" style={{ width: '100%', justifyContent: 'center', padding: 13, opacity: loading ? .7 : 1 }}>
            {loading ? (
              <>
                <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,.5)', borderTopColor: 'white', borderRadius: '50%', animation: 'ink-spin .8s linear infinite' }} />
                <span>Resetting password...</span>
              </>
            ) : (
              <>
                <Lock size={16} />
                <span>Reset Password</span>
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: 22, textAlign: 'center' }}>
          <Link to="/admin/login" className="ink-mono" style={{ fontSize: 12, color: 'var(--ink-ink-soft)', textDecoration: 'none' }}>
            Back to Login
          </Link>
        </div>
      </div>

      <p style={{ textAlign: 'center', fontSize: 13, marginTop: 20 }}>
        <Link to="/" className="ink-mono" style={{ color: 'rgba(238,234,223,.6)', textDecoration: 'none' }}>
          &larr; Back to Home
        </Link>
      </p>
    </Wrapper>
  );
};

export default ResetPassword;