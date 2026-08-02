import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const getApiUrl = () => {
    const baseUrl = import.meta.env.VITE_API_URL;
    return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${getApiUrl()}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.message || 'Failed to send reset email');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Forgot password error:', err);
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

  if (success) {
    return (
      <Wrapper>
        <Header />
        <div style={{ background: 'var(--ink-paper)', border: '1px solid var(--ink-rule)', borderRadius: 4, padding: 32, textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, border: '1.5px solid var(--ink-wire-bright)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
            <CheckCircle color="var(--ink-wire-bright)" size={28} />
          </div>
          <h2 className="ink-serif" style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink-ink)', marginBottom: 14 }}>
            Check Your Email
          </h2>
          <p style={{ color: 'var(--ink-ink-soft)', marginBottom: 20, fontSize: 14, lineHeight: 1.6 }}>
            If an account exists with <strong>{email}</strong>, you will receive a password reset link shortly.
          </p>
          <div style={{ padding: 14, background: 'var(--ink-paper-dim)', border: '1px solid var(--ink-rule)', borderRadius: 2, marginBottom: 20 }}>
            <p className="ink-mono" style={{ fontSize: 12, color: 'var(--ink-ink-soft)' }}>
              Check your spam folder if you don't see the email within a few minutes.
            </p>
          </div>
          <Link to="/admin/login" className="ink-btn ink-btn-stamp" style={{ width: '100%', justifyContent: 'center', padding: 12 }}>
            <ArrowLeft size={16} />
            <span>Back to Login</span>
          </Link>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Header />
      <div style={{ textAlign: 'center', marginBottom: 22 }}>
        <h2 className="ink-serif" style={{ fontSize: 22, fontWeight: 600, color: '#eeeadf' }}>Forgot Password?</h2>
        <p style={{ color: 'rgba(238,234,223,.65)', marginTop: 8, fontSize: 14 }}>
          Enter your email to receive a password reset link
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
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-ink-soft)' }} />
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="admin@sydlines.com" className="ink-auth-input"
                style={{ width: '100%', padding: '12px 12px 12px 42px', border: '1px solid var(--ink-rule)', borderRadius: 2, fontSize: 14, outline: 'none', boxSizing: 'border-box', background: 'var(--ink-paper-dim)', color: 'var(--ink-ink)' }}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="ink-btn ink-btn-stamp" style={{ width: '100%', justifyContent: 'center', padding: 13, opacity: loading ? .7 : 1 }}>
            {loading ? (
              <>
                <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,.5)', borderTopColor: 'white', borderRadius: '50%', animation: 'ink-spin .8s linear infinite' }} />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Mail size={16} />
                <span>Send Reset Link</span>
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: 22, textAlign: 'center' }}>
          <Link to="/admin/login" className="ink-mono" style={{ fontSize: 12, color: 'var(--ink-ink-soft)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <ArrowLeft size={14} />
            <span>Back to Login</span>
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

export default ForgotPassword;