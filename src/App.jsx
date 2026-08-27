import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import NewsDetail from './pages/NewsDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import AdminDashboard from './pages/AdminDashboard';  // ← CORRECTED PATH
import AdminLogin from './pages/admin/AdminLogin';    // ← CORRECT
import AdminSignup from './pages/admin/AdminSignup';  // ← CORRECT
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: 'var(--theme-bg-primary)',
          color: 'var(--theme-text)',
          transition: 'background-color 0.3s ease, color 0.3s ease',
        }}>
          <Navbar />
          <main style={{ flex: 1, width: '100%' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/article/:slug" element={<NewsDetail />} />
              <Route path="/news/:slug" element={<NewsDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/signup" element={<AdminSignup />} />
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