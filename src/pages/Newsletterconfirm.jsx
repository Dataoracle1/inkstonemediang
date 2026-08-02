import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { newsletterAPI } from '../utils/api';

const NewsletterConfirm = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => { confirmSubscription(); }, [token]);

  const confirmSubscription = async () => {
    try {
      const response = await newsletterAPI.confirmSubscription(token);
      setStatus('success');
      setMessage(response.data.message);
      setTimeout(() => navigate('/'), 5000);
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Failed to confirm subscription');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink-wire)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <style>{`@keyframes ink-spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ maxWidth: 420, width: '100%' }}>
        <div style={{ background: 'var(--ink-paper)', border: '1px solid var(--ink-rule)', borderRadius: 4, padding: 32, textAlign: 'center' }}>
          {status === 'loading' && (
            <>
              <Loader className="ink-mono" style={{ margin: '0 auto 18px', color: 'var(--ink-stamp)', animation: 'ink-spin 1s linear infinite' }} size={48} />
              <h2 className="ink-serif" style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink-ink)', marginBottom: 8 }}>Confirming...</h2>
              <p style={{ color: 'var(--ink-ink-soft)', fontSize: 14 }}>Please wait while we confirm your subscription</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div style={{ width: 56, height: 56, border: '1.5px solid var(--ink-wire-bright)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                <CheckCircle color="var(--ink-wire-bright)" size={26} />
              </div>
              <h2 className="ink-serif" style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink-ink)', marginBottom: 8 }}>Subscription Confirmed!</h2>
              <p style={{ color: 'var(--ink-ink-soft)', marginBottom: 20, fontSize: 14, lineHeight: 1.6 }}>{message}</p>
              <p className="ink-mono" style={{ fontSize: 12, color: 'var(--ink-ink-soft)', marginBottom: 18 }}>
                You'll be redirected to the homepage in 5 seconds...
              </p>
              <Link to="/" className="ink-btn ink-btn-stamp" style={{ display: 'inline-flex' }}>Go to Homepage</Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div style={{ width: 56, height: 56, border: '1.5px solid var(--ink-stamp)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                <XCircle color="var(--ink-stamp)" size={26} />
              </div>
              <h2 className="ink-serif" style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink-ink)', marginBottom: 8 }}>Confirmation Failed</h2>
              <p style={{ color: 'var(--ink-ink-soft)', marginBottom: 20, fontSize: 14, lineHeight: 1.6 }}>{message}</p>
              <Link to="/" className="ink-btn ink-btn-stamp" style={{ display: 'inline-flex' }}>Go to Homepage</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterConfirm;