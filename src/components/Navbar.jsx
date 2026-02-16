
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Sun, Moon, User, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { newsletterAPI } from '../utils/api';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  
  const { isAuthenticated, admin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDark(prev => {
      const newValue = !prev;
      
      localStorage.setItem('darkMode', newValue.toString());
     
      if (newValue) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newValue;
    });
  }, []);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearch(false);
      setIsMenuOpen(false);
    }
  }, [searchQuery, navigate]);

  const handleSubscribe = useCallback(async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsSubscribing(true);
    try {
      const response = await newsletterAPI.subscribe(email.trim());
      
      showToast(response.data.message || 'Please check your email to confirm subscription!', 'success');
      setEmail('');
      setShowSubscribeModal(false);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to subscribe. Please try again.';
      showToast(errorMessage, 'error');
    } finally {
      setIsSubscribing(false);
    }
  }, [email, showToast]);

  const categories = useMemo(() => [
    'Breaking News',
    'Finance',
    'Sports',
    'Entertainment',
    'Technology',
    'World'
  ], []);

  const currentDate = useMemo(() => {
    const date = new Date();
    return {
      long: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      short: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      })
    };
  }, []);

  return (
    <>
      <nav className="bg-white dark:bg-dark-800 shadow-md sticky top-0 z-50">
      
        <div className="bg-dark-900 text-white py-2">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center space-x-4">
                <span className="hidden sm:block">{currentDate.long}</span>
                <span className="sm:hidden">{currentDate.short}</span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleDarkMode}
                  className="p-1 hover:bg-dark-700 rounded transition"
                  aria-label="Toggle dark mode"
                >
                  {isDark ? <Sun size={16} /> : <Moon size={16} />}
                </button>
                {isAuthenticated && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center space-x-1 hover:text-primary-400 transition"
                  >
                    <User size={16} />
                    <span className="hidden sm:inline">{admin?.name}</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
         
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="https://i.postimg.cc/44v0z18m/Chat-GPT-Image-Feb-12-2026-07-24-26-PM.png"
                alt="Inkstone Media logo"
                className="h-8 w-8 object-contain"
                loading="lazy"
              />

              <div>
                <h1 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                  INKSTONE <span className="text-primary-500">MEDIA</span>
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                  Breaking News • Sports • Entertainment
                </p>
              </div>
            </Link>

           
            <div className="hidden lg:flex items-center space-x-6">
              <Link
                to="/"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 font-medium transition"
              >
                Home
              </Link>
              {categories.slice(0, 4).map((category) => (
                <Link
                  key={category}
                  to={`/?category=${encodeURIComponent(category)}`}
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 font-medium transition"
                >
                  {category}
                </Link>
              ))}
              <Link
                to="/contact"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 font-medium transition"
              >
                Contact
              </Link>
            </div>

           
            <div className="hidden lg:flex items-center space-x-4">
            
              <button 
                onClick={() => setShowSubscribeModal(true)}
                className="btn-primary"
              >
                Subscribe
              </button>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded transition"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {showSearch && (
            <div className="hidden lg:block pb-4 border-t dark:border-dark-700 pt-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="input flex-1"
                  autoFocus
                />
                <button type="submit" className="btn-primary">
                  Search
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowSearch(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </form>
            </div>
          )}

         
          {isMenuOpen && (
            <div className="lg:hidden pb-4 border-t dark:border-dark-700">
              <div className="flex flex-col space-y-3 pt-4">
                <Link
                  to="/"
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-500 font-medium transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category}
                    to={`/?category=${encodeURIComponent(category)}`}
                    className="text-gray-700 dark:text-gray-300 hover:text-primary-500 font-medium transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category}
                  </Link>
                ))}
                <Link
                  to="/contact"
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-500 font-medium transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
                
          
                <button 
                  onClick={() => {
                    setShowSubscribeModal(true);
                    setIsMenuOpen(false);
                  }}
                  className="btn-primary w-full"
                >
                  Subscribe
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

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
                aria-label="Close modal"
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
                  disabled={isSubscribing}
                />
              </div>
              
              <div className="flex gap-3">
                <button 
                  type="submit" 
                  className="btn-primary flex-1"
                  disabled={isSubscribing}
                >
                  {isSubscribing ? 'Subscribing...' : 'Subscribe Now'}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowSubscribeModal(false)}
                  className="btn-secondary px-6"
                  disabled={isSubscribing}
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

export default React.memo(Navbar);