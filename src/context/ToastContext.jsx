import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  if (!toasts.length) return null;
  return (
    <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 300, display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 380, width: 'calc(100% - 32px)' }}>
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const TONES = {
  success: { icon: CheckCircle, color: 'var(--ink-wire-bright)' },
  error: { icon: XCircle, color: 'var(--ink-stamp)' },
  warning: { icon: AlertCircle, color: '#b45309' },
  info: { icon: Info, color: 'var(--ink-ink-soft)' },
};

const Toast = ({ toast, onClose }) => {
  const tone = TONES[toast.type] || TONES.success;
  const Icon = tone.icon;

  return (
    <div
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px',
        background: 'var(--ink-paper)', border: '1px solid var(--ink-rule)', borderLeft: `3px solid ${tone.color}`,
        boxShadow: '0 8px 28px rgba(0,0,0,.14)', fontFamily: "'Source Sans 3', sans-serif",
        animation: 'ink-toast-in .25s ease',
      }}
    >
      <style>{`@keyframes ink-toast-in { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: translateX(0); } }`}</style>
      <Icon size={18} color={tone.color} style={{ flexShrink: 0, marginTop: 1 }} />
      <p style={{ flex: 1, fontSize: 13, fontWeight: 600, color: 'var(--ink-ink)', margin: 0, lineHeight: 1.5 }}>
        {toast.message}
      </p>
      <button
        onClick={onClose}
        style={{ flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-ink-soft)', padding: 2, display: 'flex' }}
      >
        <X size={15} />
      </button>
    </div>
  );
};