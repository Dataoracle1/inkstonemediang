
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { newsletterAPI } from '../utils/api';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    
    try {
      const response = await newsletterAPI.subscribe(email.trim());
      showToast(response.data.message || 'Please check your email to confirm subscription! 🎉', 'success');
      setEmail('');
      setShowSubscribeModal(false);
    } catch (error) {
      console.error('Newsletter subscription error:', error.response?.data);
      const errorMsg = error.response?.data?.message || 
                       error.response?.data?.error ||
                       'Subscription failed. Please try again.';
      showToast(errorMsg, 'error');
    }
  };

  const footerLinks = {
    'Quick Links': [
      { name: 'Home', path: '/' },
      { name: 'About Us', path: '/about' },
      { name: 'Contact', path: '/contact' },
      { name: 'Privacy Policy', path: '/privacy' },
    ],
    'Categories': [
      { name: 'Breaking News', path: '/?category=Breaking%20News' },
      { name: 'Sports', path: '/?category=Sports' },
      { name: 'Entertainment', path: '/?category=Entertainment' },
      { name: 'Technology', path: '/?category=Technology' },
    ],
    'Follow Us': [
      { name: 'Facebook', icon: Facebook },
      { name: 'Twitter', icon: Twitter },
      { name: 'Instagram', icon: Instagram },
      { name: 'YouTube', icon: Youtube },
    ]
  };

  return (
    <>
      <footer className="bg-dark-900 text-gray-300 mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img
                  src="https://i.postimg.cc/44v0z18m/Chat-GPT-Image-Feb-12-2026-07-24-26-PM.png"
                  alt="Inkstone Media logo"
                  className="h-8 w-8 object-contain"
                />
                <h3 className="text-xl font-heading font-bold text-white">
                  INKSTONE <span className="text-primary-500">MEDIA</span>
                </h3>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Your trusted source for breaking news, sports updates, and entertainment stories from around the world.
              </p>
              <div className="flex space-x-3">
                {footerLinks['Follow Us'].map(({ name, icon: Icon }) => (
                  <a
                    key={name}
                    href="#"
                    className="w-10 h-10 bg-dark-800 hover:bg-primary-500 rounded-full flex items-center justify-center transition"
                    aria-label={name}
                    onClick={(e) => e.preventDefault()}
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-heading font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {footerLinks['Quick Links'].map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-sm hover:text-primary-400 transition"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-heading font-semibold mb-4">Categories</h4>
              <ul className="space-y-2">
                {footerLinks['Categories'].map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-sm hover:text-primary-400 transition"
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-heading font-semibold mb-4">Newsletter</h4>
              <p className="text-sm text-gray-400 mb-4">
                Subscribe to get the latest news delivered to your inbox.
              </p>
              <button
                onClick={() => setShowSubscribeModal(true)}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <Mail size={16} />
                <span>Subscribe</span>
              </button>
            </div>
          </div>

          <div className="border-t border-dark-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm text-gray-400">
                © {currentYear} <span className="text-primary-500">INKSTONE MEDIA</span>. All rights reserved.
              </p>
              <div className="flex space-x-6 text-sm">
                <Link to="/terms" className="hover:text-primary-400 transition">
                  Terms of Service
                </Link>
                <Link to="/privacy" className="hover:text-primary-400 transition">
                  Privacy Policy
                </Link>
                <Link to="/admin/login" className="hover:text-primary-400 transition">
                  Admin Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {showSubscribeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-2xl max-w-md w-full p-6 animate-slide-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Mail className="text-primary-500" size={24} />
                <h3 className="text-2xl font-heading font-bold">Subscribe to Newsletter</h3>
              </div>
              <button
                onClick={() => setShowSubscribeModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-dark-700 rounded transition"
              >
                <X size={24} />
              </button>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get the latest news and updates delivered to your inbox. Stay informed with INKSTONE MEDIA.
            </p>
            
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="input w-full"
                  required
                />
              </div>
              
              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1">
                  Subscribe Now
                </button>
                <button 
                  type="button"
                  onClick={() => setShowSubscribeModal(false)}
                  className="btn-secondary px-6"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;