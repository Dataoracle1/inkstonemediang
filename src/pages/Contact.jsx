import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, Clock, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
import { contactsAPI } from '../utils/contactAPI';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    else if (formData.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
    else if (!/^[a-zA-Z\s'-]+$/.test(formData.name)) newErrors.name = 'Name can only contain letters, spaces, hyphens and apostrophes';

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address';

    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    else if (formData.subject.trim().length < 3) newErrors.subject = 'Subject must be at least 3 characters';

    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (formData.message.trim().length < 10) newErrors.message = 'Message must be at least 10 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await contactsAPI.submit({
        ...formData,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      });
      setSubmitStatus({ success: true, message: response.data?.message || 'Message sent successfully!' });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      setSubmitStatus({ success: false, message: error.response?.data?.message || 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ background: '#FAF9F6', minHeight: '100vh' }}>
      <style>{`
        .contact-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 18px;
          box-sizing: border-box;
        }
        .contact-hero {
          padding: 60px 0;
          text-align: center;
          border-bottom: 1px solid #e8e4dd;
        }
        .contact-hero h1 {
          font-family: "Playfair Display", serif;
          font-size: clamp(36px, 5vw, 48px);
          font-weight: 700;
          color: #071A33;
          margin: 0 0 16px;
        }
        .contact-hero p {
          font-size: 16px;
          color: #64748B;
          margin: 0;
          max-width: 600px;
          line-height: 1.6;
          margin-left: auto;
          margin-right: auto;
        }
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 60px;
          padding: 60px 0;
        }
        .contact-info-card {
          background: white;
          border: 1px solid #e8e4dd;
          border-radius: 8px;
          padding: 24px;
          display: flex;
          gap: 16px;
          margin-bottom: 20px;
        }
        .contact-icon {
          width: 48px;
          height: 48px;
          background: rgba(196, 66, 47, 0.1);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #C4422F;
          flex-shrink: 0;
        }
        .contact-info-content h3 {
          font-family: "Playfair Display", serif;
          font-size: 16px;
          font-weight: 700;
          color: #071A33;
          margin: 0 0 4px;
        }
        .contact-info-content p {
          font-size: 13px;
          color: #64748B;
          margin: 0;
          line-height: 1.6;
        }
        .contact-form {
          background: white;
          border: 1px solid #e8e4dd;
          border-radius: 8px;
          padding: 40px;
        }
        .form-group {
          margin-bottom: 24px;
        }
        .form-label {
          display: block;
          font-family: "IBM Plex Mono", monospace;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: #64748B;
          margin-bottom: 8px;
        }
        .form-input,
        .form-textarea {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #e8e4dd;
          border-radius: 4px;
          font-family: "Inter", sans-serif;
          font-size: 14px;
          color: #071A33;
          box-sizing: border-box;
          transition: border-color .15s;
        }
        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #C4422F;
          box-shadow: 0 0 0 3px rgba(196, 66, 47, 0.1);
        }
        .form-textarea {
          resize: vertical;
          min-height: 150px;
          font-family: "Inter", sans-serif;
        }
        .form-error {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 8px 12px;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 4px;
          color: #dc2626;
          font-size: 12px;
          margin-top: 6px;
        }
        .submit-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 14px 20px;
          background: #C4422F;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          font-size: 13px;
          font-family: "IBM Plex Mono", monospace;
          letter-spacing: .05em;
          text-transform: uppercase;
          transition: opacity .15s;
          justify-content: center;
        }
        .submit-btn:hover:not(:disabled) {
          opacity: 0.9;
        }
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .status-message {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          border-radius: 4px;
          margin-bottom: 24px;
          border-left: 4px solid;
        }
        .status-success {
          background: rgba(34, 197, 94, 0.08);
          border-left-color: #22c55e;
          color: #15803d;
        }
        .status-error {
          background: rgba(239, 68, 68, 0.08);
          border-left-color: #ef4444;
          color: #dc2626;
        }
        @media (max-width: 1024px) {
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 40px;
            padding: 40px 0;
          }
        }
        @media (max-width: 640px) {
          .contact-hero { padding: 40px 0; }
          .contact-hero h1 { font-size: 28px; }
          .contact-form { padding: 24px; }
          .contact-info-card { gap: 12px; margin-bottom: 16px; }
        }
      `}</style>

      {/* HERO */}
      <div className="contact-container">
        <div className="contact-hero">
          <h1>Get In Touch</h1>
          <p>Have a story tip, question, or advertising inquiry? We're here to listen and respond.</p>
        </div>

        {/* CONTACT GRID */}
        <div className="contact-grid">
          {/* INFO */}
          <div>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 24, fontWeight: 700, color: '#071A33', margin: '0 0 24px' }}>
              Contact Information
            </h2>

            <div className="contact-info-card">
              <div className="contact-icon"><Mail size={20} /></div>
              <div className="contact-info-content">
                <h3>Email</h3>
                <p><a href="mailto:hello@sydlines.com" style={{ color: '#C4422F', textDecoration: 'none' }}>hello@sydlines.com</a></p>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon"><MapPin size={20} /></div>
              <div className="contact-info-content">
                <h3>Location</h3>
                <p>Lagos, Nigeria</p>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon"><Phone size={20} /></div>
              <div className="contact-info-content">
                <h3>Phone</h3>
                <p><a href="tel:+234123456789" style={{ color: '#C4422F', textDecoration: 'none' }}>+234 (123) 456-789</a></p>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon"><Clock size={20} /></div>
              <div className="contact-info-content">
                <h3>Business Hours</h3>
                <p>Monday - Friday: 9:00 AM - 6:00 PM WAT<br />Saturday - Sunday: Closed</p>
              </div>
            </div>
          </div>

          {/* FORM */}
          <div className="contact-form">
            {submitStatus && (
              <div className={`status-message ${submitStatus.success ? 'status-success' : 'status-error'}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {submitStatus.success ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                  <span>{submitStatus.message}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="form-input"
                />
                {errors.name && <div className="form-error"><AlertCircle size={14} /> {errors.name}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="form-input"
                />
                {errors.email && <div className="form-error"><AlertCircle size={14} /> {errors.email}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  className="form-input"
                />
                {errors.subject && <div className="form-error"><AlertCircle size={14} /> {errors.subject}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more..."
                  className="form-textarea"
                />
                {errors.message && <div className="form-error"><AlertCircle size={14} /> {errors.message}</div>}
              </div>

              <button type="submit" disabled={isSubmitting} className="submit-btn">
                <Send size={16} /> {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;