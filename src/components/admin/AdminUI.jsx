import React from 'react';
import toast from 'react-hot-toast';

export const inputStyle = {
  width: '100%', padding: '10px 14px', border: '1px solid var(--ink-rule)', borderRadius: 2,
  fontSize: 14, fontFamily: "'Source Sans 3', sans-serif", outline: 'none', transition: '.15s',
  background: 'var(--ink-paper-dim)', color: 'var(--ink-ink)', boxSizing: 'border-box',
};

export const labelStyle = {
  display: 'block', fontSize: 10, fontWeight: 600, color: 'var(--ink-ink-soft)', marginBottom: 8,
  fontFamily: "'IBM Plex Mono', monospace", textTransform: 'uppercase', letterSpacing: '.06em',
};

export const Badge = ({ children, tone = 'neutral' }) => {
  const tones = {
    neutral: { color: 'var(--ink-ink-soft)', border: 'var(--ink-rule)' },
    positive: { color: 'var(--ink-wire-bright)', border: 'var(--ink-wire-bright)' },
    warn: { color: '#b45309', border: '#b4530966' },
    danger: { color: 'var(--ink-stamp)', border: 'var(--ink-stamp)' },
    accent: { color: 'var(--ink-stamp)', border: 'var(--ink-stamp)' },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span className="ink-mono" style={{ padding: '3px 9px', border: `1px solid ${t.border}`, color: t.color, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', whiteSpace: 'nowrap' }}>
      {children}
    </span>
  );
};

export const ActionBtn = ({ icon, onClick, title, tone = 'neutral' }) => {
  const color = tone === 'danger' ? 'var(--ink-stamp)' : tone === 'positive' ? 'var(--ink-wire-bright)' : 'var(--ink-ink-soft)';
  return (
    <button onClick={onClick} title={title}
      style={{ width: 30, height: 30, border: '1px solid var(--ink-rule)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color, flexShrink: 0, transition: '.15s' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = color; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--ink-rule)'; }}>
      {icon}
    </button>
  );
};

export const StatCard = ({ label, value, icon: Icon, trend }) => (
  <div className="ink-card" style={{ padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div>
      <p className="ink-mono" style={{ fontSize: 10, color: 'var(--ink-ink-soft)', fontWeight: 600, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</p>
      <p className="ink-serif" style={{ fontSize: 26, fontWeight: 600, color: 'var(--ink-ink)', margin: 0 }}>{value ?? '—'}</p>
      {trend && <p className="ink-mono" style={{ fontSize: 10, color: 'var(--ink-wire-bright)', margin: '4px 0 0' }}>{trend}</p>}
    </div>
    <div style={{ width: 42, height: 42, border: '1.5px solid var(--ink-stamp)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon size={19} color="var(--ink-stamp)" />
    </div>
  </div>
);

export const Section = ({ title, children, action }) => (
  <div style={{ marginBottom: 32 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
      <h3 className="ink-serif" style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink-ink)', margin: 0 }}>{title}</h3>
      {action}
    </div>
    {children}
  </div>
);

export const PanelHeader = ({ title, description, action }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 14 }}>
    <div>
      <h2 className="ink-serif" style={{ fontSize: 24, fontWeight: 600, color: 'var(--ink-ink)', margin: '0 0 4px' }}>{title}</h2>
      {description && <p style={{ fontSize: 13, color: 'var(--ink-ink-soft)', margin: 0 }}>{description}</p>}
    </div>
    {action}
  </div>
);

export const confirmToast = (title, sub, onConfirm, confirmLabel = 'Delete', danger = true) => {
  toast.custom((t) => (
    <div style={{ background: 'var(--ink-paper)', border: '1px solid var(--ink-rule)', padding: '18px 20px', minWidth: 280, boxShadow: '0 8px 32px rgba(0,0,0,.18)', fontFamily: "'Source Sans 3', sans-serif" }}>
      <p className="ink-serif" style={{ fontWeight: 600, margin: '0 0 4px', fontSize: 16, color: 'var(--ink-ink)' }}>{title}</p>
      <p style={{ fontSize: 13, color: 'var(--ink-ink-soft)', margin: '0 0 14px' }}>{sub}</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={async () => { toast.dismiss(t.id); await onConfirm(); }} className="ink-btn"
          style={{ flex: 1, justifyContent: 'center', background: danger ? 'var(--ink-stamp)' : 'var(--ink-wire-bright)', color: '#fff', padding: '9px' }}>
          {confirmLabel}
        </button>
        <button onClick={() => toast.dismiss(t.id)} className="ink-btn" style={{ flex: 1, justifyContent: 'center', padding: '9px' }}>
          Cancel
        </button>
      </div>
    </div>
  ), { duration: Infinity, position: 'top-center' });
};

export const LoadingBlock = ({ label = 'Loading...' }) => (
  <div style={{ textAlign: 'center', padding: '64px 0' }}>
    <div style={{ width: 40, height: 40, border: '3px solid var(--ink-rule)', borderTopColor: 'var(--ink-stamp)', borderRadius: '50%', animation: 'ink-spin .8s linear infinite', margin: '0 auto 14px' }} />
    <style>{`@keyframes ink-spin { to { transform: rotate(360deg); } }`}</style>
    <p style={{ color: 'var(--ink-ink-soft)', fontSize: 14 }}>{label}</p>
  </div>
);

export const EmptyBlock = ({ label }) => (
  <div style={{ textAlign: 'center', padding: '64px 24px' }}>
    <p style={{ fontSize: 15, color: 'var(--ink-ink-soft)', fontWeight: 600 }}>{label}</p>
  </div>
);