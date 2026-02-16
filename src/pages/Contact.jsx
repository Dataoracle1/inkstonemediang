

import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, Clock, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
import { contactsAPI } from '../utils/contactAPI';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); 
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState('');

  
  const validateForm = () => {
    const newErrors = {};

    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Name cannot exceed 100 characters';
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.name)) {
      newErrors.name = 'Name can only contain letters, spaces, hyphens and apostrophes';
    }

    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = 'Subject must be at least 3 characters';
    } else if (formData.subject.trim().length > 200) {
      newErrors.subject = 'Subject cannot exceed 200 characters';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    } else if (formData.message.trim().length > 5000) {
      newErrors.message = 'Message cannot exceed 5000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
    
   
    if (submitStatus) {
      setSubmitStatus(null);
      setServerMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
   
    setSubmitStatus(null);
    setServerMessage('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await contactsAPI.submit({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        subject: formData.subject.trim(),
        message: formData.message.trim()
      });

      setSubmitStatus('success');
      setServerMessage(response.data.message || 'Thank you! Your message has been sent successfully.');
      
     
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setErrors({});

      
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
      setSubmitStatus('error');
      
    
      if (error.response) {
      
        if (error.response.status === 429) {
          setServerMessage('Too many submissions. Please try again in a few minutes.');
        } else if (error.response.status === 400 && error.response.data.errors) {
         
          const serverErrors = {};
          error.response.data.errors.forEach(err => {
            serverErrors[err.field] = err.message;
          });
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-4">
            Get In Touch
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Have a question, suggestion, or feedback? We'd love to hear from you. 
            Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
         
          <div className="lg:col-span-2">
            <div className="card p-8">
              <h2 className="text-2xl font-heading font-bold mb-6 flex items-center">
                <MessageSquare className="mr-2 text-primary-500" size={28} />
                Send Us a Message
              </h2>

             
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border-l-4 border-green-500 rounded-r-lg">
                  <div className="flex items-start">
                    <CheckCircle className="text-green-500 mr-3 flex-shrink-0" size={24} />
                    <div>
                      <p className="font-semibold text-green-700 dark:text-green-400">Success!</p>
                      <p className="text-green-700 dark:text-green-400 text-sm mt-1">{serverMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 rounded-r-lg">
                  <div className="flex items-start">
                    <AlertCircle className="text-red-500 mr-3 flex-shrink-0" size={24} />
                    <div>
                      <p className="font-semibold text-red-700 dark:text-red-400">Error</p>
                      <p className="text-red-700 dark:text-red-400 text-sm mt-1">{serverMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
              
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`input ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder=""
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`input ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder=""
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`input ${errors.subject ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="What is this regarding?"
                    disabled={isSubmitting}
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.subject}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message * 
                    <span className="text-gray-500 text-xs ml-2">
                      ({formData.message.length}/5000 characters)
                    </span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    className={`textarea ${errors.message ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Tell us more about your inquiry..."
                    disabled={isSubmitting}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  We typically respond within 24-48 hours during business days.
                </p>
              </form>
            </div>
          </div>

          {/* Contact Info Sidebar - Same as before */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Details */}
            <div className="card p-6">
              <h3 className="text-xl font-heading font-bold mb-6">Contact Information</h3>

              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="text-primary-500" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Email</h4>
                    <a 
                      href="mailto:contact@inkstone.media" 
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 transition"
                    >
                      contact@inkstone.media
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="text-primary-500" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Phone</h4>
                    <a 
                      href="tel:+1234567890" 
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 transition"
                    >
                      +234 704 667 8039
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-primary-500" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Address</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      123 Media Street<br />
                      Lagos, Nigeria
                    </p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="text-primary-500" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Business Hours</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Monday - Friday<br />
                      9:00 AM - 6:00 PM WAT
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="card p-6">
              <h3 className="text-xl font-heading font-bold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="/about" className="block text-gray-600 dark:text-gray-400 hover:text-primary-500 transition">
                  → About Us
                </a>
                <a href="/privacy" className="block text-gray-600 dark:text-gray-400 hover:text-primary-500 transition">
                  → Privacy Policy
                </a>
                <a href="/terms" className="block text-gray-600 dark:text-gray-400 hover:text-primary-500 transition">
                  → Terms of Service
                </a>
                <a href="/careers" className="block text-gray-600 dark:text-gray-400 hover:text-primary-500 transition">
                  → Careers
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div className="card p-6">
              <h3 className="text-xl font-heading font-bold mb-4">Follow Us</h3>
              <div className="flex space-x-3">
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-100 dark:bg-dark-700 hover:bg-primary-500 dark:hover:bg-primary-500 rounded-full flex items-center justify-center transition group"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-100 dark:bg-dark-700 hover:bg-primary-500 dark:hover:bg-primary-500 rounded-full flex items-center justify-center transition group"
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-100 dark:bg-dark-700 hover:bg-primary-500 dark:hover:bg-primary-500 rounded-full flex items-center justify-center transition group"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;