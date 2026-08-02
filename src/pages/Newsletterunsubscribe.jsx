import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader, Mail } from 'lucide-react';
import { newsletterAPI } from '../utils/api';

const NewsletterUnsubscribe = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => { handleUnsubscribe(); }, [token]);

  const handleUnsubscribe = async () => {
    try {
      const response = await newsletterAPI.unsubscribe(token);
      setStatus('success');
      setMessage(response.data.message);
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Failed to unsubscribe');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink-wire)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <style>{`@keyframes ink-spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ maxWidth: 420, width: '100%' }}>
        <div style={{ background: 'var(--ink-paper)', border: '1px solid var(--ink-rule)', borderRadius: 4, padding: 32, textAlign: 'center' }}>
          {status === 'loading' && (
            <>
              <Loader style={{ margin: '0 auto 18px', color: 'var(--ink-stamp)', animation: 'ink-spin 1s linear infinite' }} size={48} />
              <h2 className="ink-serif" style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink-ink)', marginBottom: 8 }}>Processing...</h2>
              <p style={{ color: 'var(--ink-ink-soft)', fontSize: 14 }}>Please wait while we process your request</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div style={{ width: 56, height: 56, border: '1.5px solid var(--ink-wire-bright)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                <Mail color="var(--ink-wire-bright)" size={26} />
              </div>
              <h2 className="ink-serif" style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink-ink)', marginBottom: 8 }}>Unsubscribed Successfully</h2>
              <p style={{ color: 'var(--ink-ink-soft)', marginBottom: 18, fontSize: 14, lineHeight: 1.6 }}>{message}</p>

              <div style={{ background: 'var(--ink-paper-dim)', border: '1px solid var(--ink-rule)', borderRadius: 2, padding: 14, marginBottom: 18 }}>
                <p className="ink-mono" style={{ fontSize: 12, color: 'var(--ink-ink-soft)' }}>
                  We're sorry to see you go! You'll no longer receive our newsletters.
                </p>
              </div>

              <p style={{ fontSize: 13, color: 'var(--ink-ink-soft)', marginBottom: 16 }}>
                Changed your mind? You can always resubscribe from our homepage.
              </p>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <Link to="/" className="ink-btn ink-btn-stamp">Go to Homepage</Link>
                <Link to="/" className="ink-btn">Resubscribe</Link>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div style={{ width: 56, height: 56, border: '1.5px solid var(--ink-stamp)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                <XCircle color="var(--ink-stamp)" size={26} />
              </div>
              <h2 className="ink-serif" style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink-ink)', marginBottom: 8 }}>Unsubscribe Failed</h2>
              <p style={{ color: 'var(--ink-ink-soft)', marginBottom: 18, fontSize: 14, lineHeight: 1.6 }}>{message}</p>
              <Link to="/" className="ink-btn ink-btn-stamp" style={{ display: 'inline-flex' }}>Go to Homepage</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterUnsubscribe;