import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════
import { ThemeProvider } from './context/ThemeContext';

// ═══════════════════════════════════════════════════════════════
// LAYOUTS
// ═══════════════════════════════════════════════════════════════
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// ═══════════════════════════════════════════════════════════════
// PUBLIC PAGES
// ═══════════════════════════════════════════════════════════════
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import NewsDetail from './pages/NewsDetail';

// ═══════════════════════════════════════════════════════════════
// NEWSLETTER PAGES
// ═══════════════════════════════════════════════════════════════
import NewsletterConfirm from './pages/Newsletterconfirm';
import NewsletterUnsubscribe from './pages/Newsletterunsubscribe';

// ═══════════════════════════════════════════════════════════════
// ADMIN AUTH
// ═══════════════════════════════════════════════════════════════
import AdminLogin from './pages/admin/AdminLogin';
import AdminSignup from './pages/admin/AdminSignup';
import ForgotPassword from './pages/admin/ForgotPassword';
import ResetPassword from './pages/admin/ResetPassword';

// ═══════════════════════════════════════════════════════════════
// ADMIN DASHBOARD
// ═══════════════════════════════════════════════════════════════
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// ═══════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════
const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: 'var(--theme-bg-primary, #fafafa)',
          color: 'var(--theme-text, #1a1a1a)',
          transition: 'background-color 0.3s ease, color 0.3s ease',
        }}>
          <ScrollToTop />
          
          <Navbar />
          
          <main style={{ flex: 1, width: '100%' }}>
            <Routes>
              {/* ═══════════════════════════════════════════════════════════════ */}
              {/* PUBLIC ROUTES */}
              {/* ═══════════════════════════════════════════════════════════════ */}
              <Route path="/" element={<Home />} />
              <Route path="/category/:slug" element={<Home />} />
              <Route path="/news/:slug" element={<NewsDetail />} />
              <Route path="/article/:slug" element={<NewsDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />

              {/* ═══════════════════════════════════════════════════════════════ */}
              {/* NEWSLETTER ROUTES */}
              {/* ═══════════════════════════════════════════════════════════════ */}
              <Route path="/newsletter/confirm/:token" element={<NewsletterConfirm />} />
              <Route path="/newsletter/unsubscribe/:token" element={<NewsletterUnsubscribe />} />

              {/* ═══════════════════════════════════════════════════════════════ */}
              {/* ADMIN AUTH ROUTES (Public - no protection) */}
              {/* ═══════════════════════════════════════════════════════════════ */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/signup" element={<AdminSignup />} />
              <Route path="/admin/forgot-password" element={<ForgotPassword />} />
              <Route path="/admin/reset-password/:token" element={<ResetPassword />} />

              {/* ═══════════════════════════════════════════════════════════════ */}
              {/* ADMIN DASHBOARD ROUTE (Protected) */}
              {/* ═══════════════════════════════════════════════════════════════ */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;