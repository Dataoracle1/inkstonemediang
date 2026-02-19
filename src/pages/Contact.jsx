
import React, { useState, useEffect } from 'react';
import { Mail, MapPin, Phone, Send, Clock, MessageSquare, AlertCircle, CheckCircle, Facebook, Twitter, Instagram } from 'lucide-react';
import { contactsAPI } from '../utils/contactAPI';

// ── Dark mode hook (syncs with Navbar toggle) ──────────────────────
const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains('dark'))
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return isDark;
};

const Contact = () => {
  const isDark = useDarkMode();

  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState('');

  // ── colour tokens ──────────────────────────────────────────────
  const c = {
    pageBg:       isDark ? '#0f172a'  : '#f9fafb',
    cardBg:       isDark ? '#1e293b'  : '#ffffff',
    cardBorder:   isDark ? '#334155'  : '#f3f4f6',
    cardShadow:   isDark ? '0 4px 20px rgba(0,0,0,.25)' : '0 4px 20px rgba(0,0,0,.07)',
    heading:      isDark ? '#f1f5f9'  : '#0f1a12',
    body:         isDark ? '#cbd5e1'  : '#374151',
    muted:        isDark ? '#94a3b8'  : '#6b7280',
    faint:        isDark ? '#64748b'  : '#9ca3af',
    inputBg:      isDark ? '#0f172a'  : '#ffffff',
    inputBorder:  isDark ? '#334155'  : '#e5e7eb',
    inputColor:   isDark ? '#f1f5f9'  : '#111827',
    inputFocus:   '#16a34a',
    labelColor:   isDark ? '#cbd5e1'  : '#374151',
    iconBg:       isDark ? 'rgba(22,163,74,.15)' : '#f0fdf4',
    linkColor:    isDark ? '#94a3b8'  : '#6b7280',
    linkHover:    '#16a34a',
    socialBg:     isDark ? '#334155'  : '#f3f4f6',
    divider:      isDark ? '#334155'  : '#e5e7eb',
  };

  const inputStyle = (hasError) => ({
    width: '100%',
    padding: '12px 16px',
    background: c.inputBg,
    border: `1.5px solid ${hasError ? '#ef4444' : c.inputBorder}`,
    borderRadius: 12,
    fontSize: 14,
    color: c.inputColor,
    fontFamily: 'DM Sans, sans-serif',
    outline: 'none',
    transition: 'border-color .2s, box-shadow .2s',
    boxSizing: 'border-box',
  });

  // ── Validation ─────────────────────────────────────────────────
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    else if (formData.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
    else if (formData.name.trim().length > 100) newErrors.name = 'Name cannot exceed 100 characters';
    else if (!/^[a-zA-Z\s'-]+$/.test(formData.name)) newErrors.name = 'Name can only contain letters, spaces, hyphens and apostrophes';

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address';

    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    else if (formData.subject.trim().length < 3) newErrors.subject = 'Subject must be at least 3 characters';
    else if (formData.subject.trim().length > 200) newErrors.subject = 'Subject cannot exceed 200 characters';

    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (formData.message.trim().length < 10) newErrors.message = 'Message must be at least 10 characters';
    else if (formData.message.trim().length > 5000) newErrors.message = 'Message cannot exceed 5000 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
    if (submitStatus) { setSubmitStatus(null); setServerMessage(''); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    setServerMessage('');
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const response = await contactsAPI.submit({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });
      setSubmitStatus('success');
      setServerMessage(response.data.message || 'Thank you! Your message has been sent successfully.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setSubmitStatus('error');
      if (error.response) {
        if (error.response.status === 429) {
          setServerMessage('Too many submissions. Please try again in a few minutes.');
        } else if (error.response.status === 400 && error.response.data.errors) {
          const serverErrors = {};
          error.response.data.errors.forEach(err => { serverErrors[err.field] = err.message; });
          setErrors(serverErrors);
          setServerMessage('Please fix the errors below.');
        } else {
          setServerMessage(error.response.data.message || 'Something went wrong. Please try again.');
        }
      } else if (error.request) {
        setServerMessage('Network error. Please check your connection and try again.');
      } else {
        setServerMessage('An unexpected error occurred. Please try again.');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Reusable sub-components ────────────────────────────────────
  const ErrorMsg = ({ msg }) => msg ? (
    <p style={{ marginTop: 6, fontSize: 13, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 4 }}>
      <AlertCircle size={13} /> {msg}
    </p>
  ) : null;

  const Label = ({ htmlFor, children }) => (
    <label htmlFor={htmlFor} style={{ display: 'block', fontSize: 13, fontWeight: 700, color: c.labelColor, marginBottom: 8 }}>
      {children}
    </label>
  );

  const InfoRow = ({ icon: Icon, title, children }) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
      <div style={{ width: 42, height: 42, background: c.iconBg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={20} color="#16a34a" />
      </div>
      <div>
        <p style={{ fontSize: 14, fontWeight: 700, color: c.heading, marginBottom: 4 }}>{title}</p>
        <div style={{ fontSize: 14, color: c.muted, lineHeight: 1.6 }}>{children}</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: c.pageBg, padding: '64px 0 80px', transition: 'background .3s' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        .contact-input:focus { border-color: #16a34a !important; box-shadow: 0 0 0 3px rgba(22,163,74,.12) !important; }
        .contact-input-error:focus { border-color: #ef4444 !important; box-shadow: 0 0 0 3px rgba(239,68,68,.12) !important; }
        .contact-link:hover { color: #16a34a !important; }
        .social-btn:hover { background: #16a34a !important; color: white !important; }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', fontFamily: 'DM Sans, sans-serif' }}>

        {/* ── Page header ── */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: c.iconBg, padding: '8px 20px', borderRadius: 100, marginBottom: 20 }}>
            <MessageSquare size={16} color="#16a34a" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#16a34a', letterSpacing: '.04em', textTransform: 'uppercase' }}>Contact Us</span>
          </div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 800, color: c.heading, margin: '0 0 16px', lineHeight: 1.15 }}>
            Get In Touch
          </h1>
          <p style={{ fontSize: 17, color: c.muted, maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
            Have a question, suggestion, or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        {/* ── Main grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28, alignItems: 'start' }}>

          {/* ══ LEFT — Form ══ */}
          <div style={{ gridColumn: 'span 2', minWidth: 0 }}>
            <div style={{ background: c.cardBg, borderRadius: 24, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow, padding: '36px 40px', transition: 'background .3s, border-color .3s' }}>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                <div style={{ width: 44, height: 44, background: c.iconBg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageSquare size={22} color="#16a34a" />
                </div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, fontWeight: 800, color: c.heading, margin: 0 }}>
                  Send Us a Message
                </h2>
              </div>

              {/* Status banners */}
              {submitStatus === 'success' && (
                <div style={{ marginBottom: 28, padding: '16px 20px', background: isDark ? 'rgba(22,163,74,.12)' : '#f0fdf4', borderLeft: '4px solid #16a34a', borderRadius: '0 12px 12px 0', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <CheckCircle size={22} color="#16a34a" style={{ flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#16a34a', marginBottom: 4 }}>Message Sent!</p>
                    <p style={{ fontSize: 14, color: isDark ? '#4ade80' : '#15803d' }}>{serverMessage}</p>
                  </div>
                </div>
              )}
              {submitStatus === 'error' && (
                <div style={{ marginBottom: 28, padding: '16px 20px', background: isDark ? 'rgba(239,68,68,.1)' : '#fef2f2', borderLeft: '4px solid #ef4444', borderRadius: '0 12px 12px 0', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <AlertCircle size={22} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#ef4444', marginBottom: 4 }}>Something went wrong</p>
                    <p style={{ fontSize: 14, color: isDark ? '#fca5a5' : '#dc2626' }}>{serverMessage}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

                {/* Name + Email row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <input id="name" name="name" type="text" value={formData.name} onChange={handleChange}
                      disabled={isSubmitting} placeholder=""
                      className={`contact-input ${errors.name ? 'contact-input-error' : ''}`}
                      style={{ ...inputStyle(!!errors.name) }} />
                    <ErrorMsg msg={errors.name} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <input id="email" name="email" type="email" value={formData.email} onChange={handleChange}
                      disabled={isSubmitting} placeholder="you@example.com"
                      className={`contact-input ${errors.email ? 'contact-input-error' : ''}`}
                      style={{ ...inputStyle(!!errors.email) }} />
                    <ErrorMsg msg={errors.email} />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <input id="subject" name="subject" type="text" value={formData.subject} onChange={handleChange}
                    disabled={isSubmitting} placeholder="What is this regarding?"
                    className={`contact-input ${errors.subject ? 'contact-input-error' : ''}`}
                    style={{ ...inputStyle(!!errors.subject) }} />
                  <ErrorMsg msg={errors.subject} />
                </div>

                {/* Message */}
                <div>
                  <Label htmlFor="message">
                    Message *&nbsp;
                    <span style={{ fontWeight: 400, color: c.faint, fontSize: 12 }}>({formData.message.length}/5000)</span>
                  </Label>
                  <textarea id="message" name="message" value={formData.message} onChange={handleChange}
                    disabled={isSubmitting} rows={6} placeholder="Tell us more about your inquiry..."
                    className={`contact-input ${errors.message ? 'contact-input-error' : ''}`}
                    style={{ ...inputStyle(!!errors.message), resize: 'vertical', minHeight: 140 }} />
                  <ErrorMsg msg={errors.message} />
                </div>

                {/* Submit */}
                <div>
                  <button type="submit" disabled={isSubmitting}
                    style={{ width: '100%', padding: '14px 28px', background: isSubmitting ? '#4ade80' : 'linear-gradient(to right,#16a34a,#15803d)', color: 'white', border: 'none', borderRadius: 14, fontWeight: 800, fontSize: 15, cursor: isSubmitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 4px 16px rgba(22,163,74,.35)', transition: 'transform .2s, box-shadow .2s', opacity: isSubmitting ? .75 : 1, fontFamily: 'DM Sans, sans-serif' }}
                    onMouseEnter={e => !isSubmitting && (e.currentTarget.style.transform = 'translateY(-1px)', e.currentTarget.style.boxShadow = '0 8px 24px rgba(22,163,74,.4)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = '0 4px 16px rgba(22,163,74,.35)')}>
                    {isSubmitting ? (
                      <>
                        <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send Message
                      </>
                    )}
                  </button>
                  <p style={{ textAlign: 'center', fontSize: 12, color: c.faint, marginTop: 12 }}>
                    We typically respond within 24–48 hours during business days.
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* ══ RIGHT — Sidebar ══ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Contact details */}
            <div style={{ background: c.cardBg, borderRadius: 24, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow, padding: '28px 28px', transition: 'background .3s, border-color .3s' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 800, color: c.heading, marginBottom: 24, margin: '0 0 24px' }}>
                Contact Information
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <InfoRow icon={Mail} title="Email">
                  <a href="mailto:contact@inkstone.media" className="contact-link" style={{ color: c.muted, textDecoration: 'none', transition: 'color .2s' }}>
                    contact@inkstone.media
                  </a>
                </InfoRow>
                <div style={{ height: 1, background: c.divider }} />
                <InfoRow icon={Phone} title="Phone">
                  <a href="tel:+2347046678039" className="contact-link" style={{ color: c.muted, textDecoration: 'none', transition: 'color .2s' }}>
                    +234 704 667 8039
                  </a>
                </InfoRow>
                <div style={{ height: 1, background: c.divider }} />
                <InfoRow icon={MapPin} title="Address">
                  <span>123 Media Street<br />Lagos, Nigeria</span>
                </InfoRow>
                <div style={{ height: 1, background: c.divider }} />
                <InfoRow icon={Clock} title="Business Hours">
                  <span>Monday – Friday<br />9:00 AM – 6:00 PM WAT</span>
                </InfoRow>
              </div>
            </div>

            {/* Quick Links */}
            <div style={{ background: c.cardBg, borderRadius: 24, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow, padding: '28px', transition: 'background .3s, border-color .3s' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 800, color: c.heading, margin: '0 0 20px' }}>
                Quick Links
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { href: '/about',   label: 'About Us' },
                  { href: '/privacy', label: 'Privacy Policy' },
                  { href: '/terms',   label: 'Terms of Service' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="contact-link"
                    style={{ fontSize: 14, color: c.muted, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, transition: 'color .2s' }}>
                    <span style={{ color: '#16a34a', fontWeight: 800 }}>→</span>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Social */}
            <div style={{ background: c.cardBg, borderRadius: 24, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow, padding: '28px', transition: 'background .3s, border-color .3s' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 800, color: c.heading, margin: '0 0 20px' }}>
                Follow Us
              </h3>
              <div style={{ display: 'flex', gap: 12 }}>
                {[
                  { label: 'Facebook', href: '#', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                  { label: 'Twitter', href: '#', path: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' },
                  { label: 'Instagram', href: '#', path: 'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z' },
                ].map(s => (
                  <a key={s.label} href={s.href} aria-label={s.label} className="social-btn"
                    style={{ width: 42, height: 42, background: c.socialBg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.muted, transition: 'background .2s, color .2s', textDecoration: 'none' }}>
                    <svg style={{ width: 18, height: 18 }} fill="currentColor" viewBox="0 0 24 24">
                      <path d={s.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;