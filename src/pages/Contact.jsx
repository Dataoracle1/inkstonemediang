import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, Clock, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
import { contactsAPI } from '../utils/contactAPI';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState('');

  const inputStyle = (hasError) => ({
    width: '100%',
    padding: '11px 15px',
    background: 'var(--ink-paper-dim)',
    border: `1px solid ${hasError ? 'var(--ink-stamp)' : 'var(--ink-rule)'}`,
    borderRadius: 2,
    fontSize: 14,
    color: 'var(--ink-ink)',
    outline: 'none',
    transition: 'border-color .2s',
    boxSizing: 'border-box',
    fontFamily: "'Source Sans 3', sans-serif",
  });

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

  const ErrorMsg = ({ msg }) => msg ? (
    <p className="ink-mono" style={{ marginTop: 6, fontSize: 12, color: 'var(--ink-stamp)', display: 'flex', alignItems: 'center', gap: 4 }}>
      <AlertCircle size={12} /> {msg}
    </p>
  ) : null;

  const Label = ({ htmlFor, children }) => (
    <label htmlFor={htmlFor} className="ink-mono" style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--ink-ink-soft)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.06em' }}>
      {children}
    </label>
  );

  const InfoRow = ({ icon: Icon, title, children }) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
      <div style={{ width: 38, height: 38, border: '1.5px solid var(--ink-stamp)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={17} color="var(--ink-stamp)" />
      </div>
      <div>
        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-ink)', marginBottom: 4 }}>{title}</p>
        <div style={{ fontSize: 13, color: 'var(--ink-ink-soft)', lineHeight: 1.6 }}>{children}</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', padding: '56px 18px 80px' }}>
      <style>{`
        @keyframes ink-spin { to { transform: rotate(360deg); } }
        .ink-contact-input:focus { border-color: var(--ink-stamp) !important; }
        .ink-contact-link { color: var(--ink-ink-soft); text-decoration: none; transition: color .15s; }
        .ink-contact-link:hover { color: var(--ink-stamp) !important; }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="ink-stamp-badge" style={{ marginBottom: 20 }}>
            <MessageSquare size={12} /> Contact Us
          </div>
          <h1 className="ink-serif" style={{ fontSize: 'clamp(32px,5vw,48px)', fontWeight: 600, color: 'var(--ink-ink)', margin: '0 0 16px', lineHeight: 1.15 }}>
            Get In Touch
          </h1>
          <p style={{ fontSize: 15, color: 'var(--ink-ink-soft)', maxWidth: 540, margin: '0 auto', lineHeight: 1.7 }}>
            Have a question, suggestion, or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, alignItems: 'start' }}>

          {/* Form */}
          <div style={{ gridColumn: 'span 2', minWidth: 0 }}>
            <div className="ink-card" style={{ padding: '32px 28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                <div style={{ width: 40, height: 40, border: '1.5px solid var(--ink-stamp)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageSquare size={19} color="var(--ink-stamp)" />
                </div>
                <h2 className="ink-serif" style={{ fontSize: 24, fontWeight: 600, color: 'var(--ink-ink)', margin: 0 }}>Send Us a Message</h2>
              </div>

              {submitStatus === 'success' && (
                <div style={{ marginBottom: 24, padding: '14px 18px', borderLeft: '3px solid var(--ink-wire-bright)', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <CheckCircle size={20} color="var(--ink-wire-bright)" style={{ flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-wire-bright)', marginBottom: 4 }}>Message Sent!</p>
                    <p style={{ fontSize: 13, color: 'var(--ink-ink-soft)' }}>{serverMessage}</p>
                  </div>
                </div>
              )}
              {submitStatus === 'error' && (
                <div style={{ marginBottom: 24, padding: '14px 18px', borderLeft: '3px solid var(--ink-stamp)', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <AlertCircle size={20} color="var(--ink-stamp)" style={{ flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-stamp)', marginBottom: 4 }}>Something went wrong</p>
                    <p style={{ fontSize: 13, color: 'var(--ink-ink-soft)' }}>{serverMessage}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 18 }}>
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <input id="name" name="name" type="text" value={formData.name} onChange={handleChange}
                      disabled={isSubmitting} className="ink-contact-input"
                      style={inputStyle(!!errors.name)} />
                    <ErrorMsg msg={errors.name} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <input id="email" name="email" type="email" value={formData.email} onChange={handleChange}
                      disabled={isSubmitting} placeholder="you@example.com" className="ink-contact-input"
                      style={inputStyle(!!errors.email)} />
                    <ErrorMsg msg={errors.email} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <input id="subject" name="subject" type="text" value={formData.subject} onChange={handleChange}
                    disabled={isSubmitting} placeholder="What is this regarding?" className="ink-contact-input"
                    style={inputStyle(!!errors.subject)} />
                  <ErrorMsg msg={errors.subject} />
                </div>

                <div>
                  <Label htmlFor="message">
                    Message * <span style={{ fontWeight: 400, color: 'var(--ink-ink-soft)', textTransform: 'none' }}>({formData.message.length}/5000)</span>
                  </Label>
                  <textarea id="message" name="message" value={formData.message} onChange={handleChange}
                    disabled={isSubmitting} rows={6} placeholder="Tell us more about your inquiry..." className="ink-contact-input"
                    style={{ ...inputStyle(!!errors.message), resize: 'vertical', minHeight: 140 }} />
                  <ErrorMsg msg={errors.message} />
                </div>

                <div>
                  <button type="submit" disabled={isSubmitting} className="ink-btn ink-btn-stamp" style={{ width: '100%', justifyContent: 'center', padding: '13px', opacity: isSubmitting ? .75 : 1 }}>
                    {isSubmitting ? (
                      <>
                        <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'ink-spin .8s linear infinite' }} />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        Send Message
                      </>
                    )}
                  </button>
                  <p className="ink-mono" style={{ textAlign: 'center', fontSize: 11, color: 'var(--ink-ink-soft)', marginTop: 12 }}>
                    We typically respond within 24&ndash;48 hours during business days.
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            <div className="ink-card" style={{ padding: '24px' }}>
              <h3 className="ink-serif" style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink-ink)', marginBottom: 20 }}>Contact Information</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <InfoRow icon={Mail} title="Email">
                  <a href="mailto:contact@sydlines.media" className="ink-contact-link">contact@sydlines.media</a>
                </InfoRow>
                <div style={{ height: 1, background: 'var(--ink-rule)' }} />
                <InfoRow icon={Phone} title="Phone">
                  <a href="tel:+2347046678039" className="ink-contact-link">+234 704 667 8039</a>
                </InfoRow>
                <div style={{ height: 1, background: 'var(--ink-rule)' }} />
                <InfoRow icon={MapPin} title="Address">
                  <span>123 Media Street<br />Lagos, Nigeria</span>
                </InfoRow>
                <div style={{ height: 1, background: 'var(--ink-rule)' }} />
                <InfoRow icon={Clock} title="Business Hours">
                  <span>Monday &ndash; Friday<br />9:00 AM &ndash; 6:00 PM WAT</span>
                </InfoRow>
              </div>
            </div>

            <div className="ink-card" style={{ padding: '24px' }}>
              <h3 className="ink-serif" style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink-ink)', marginBottom: 16 }}>Quick Links</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { href: '/about', label: 'About Us' },
                  { href: '/privacy', label: 'Privacy Policy' },
                  { href: '/terms', label: 'Terms of Service' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="ink-contact-link" style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                    <span style={{ color: 'var(--ink-stamp)' }}>&rarr;</span>
                    {link.label}
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