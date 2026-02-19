


// import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
// import { useEffect } from 'react';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import Home from './pages/Home';
// import About from './pages/About';
// import NewsDetail from './pages/NewsDetail';
// import AdminLogin from './pages/AdminLogin';
// import AdminSignup from './pages/AdminSignup';
// import AdminDashboard from './pages/AdminDashboard';
// import ProtectedRoute from './components/ProtectedRoute';
// import { AuthProvider } from './context/AuthContext';
// import { ToastProvider } from './context/ToastContext';
// import Contact from './pages/Contact';
// import NewsletterConfirm from './pages/Newsletterconfirm';
// import NewsletterUnsubscribe from './pages/Newsletterunsubscribe';
// import Privacy from './pages/Privacy';
// import Terms from './pages/Terms';
// import ForgotPassword from './pages/ForgotPassword_fixed';
// import ResetPassword from './pages/ResetPassword_fixed';



// function ScrollToTop() {
//   const { pathname } = useLocation();

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [pathname]);

//   return null;
// }

// function App() {
//   return (
//     <AuthProvider>
//       <ToastProvider>
//         <Router>
//           <ScrollToTop />
//           <div className="flex flex-col min-h-screen">
//             <Navbar />
//             <main className="flex-grow">
//               <Routes>
//                 <Route path="/contact" element={<Contact />} />
//                 <Route path="/" element={<Home />} />
//                 <Route path="/about" element={<About />} />
//                 <Route path="/news/:id" element={<NewsDetail />} />
//                 <Route path="/admin/login" element={<AdminLogin />} />
//                 <Route path="/admin/signup" element={<AdminSignup />} />
//                 <Route path="/newsletter/confirm/:token" element={<NewsletterConfirm />} />
//                 <Route path="/newsletter/unsubscribe/:token" element={<NewsletterUnsubscribe />} />
//                 <Route path="/privacy" element={<Privacy />} />
//                 <Route path="/terms" element={<Terms />} />
//                 <Route path="/admin/forgot-password" element={<ForgotPassword />} />
//                  <Route path="/admin/reset-password/:token" element={<ResetPassword />} />
//                 <Route
//                   path="/admin/dashboard"
//                   element={
//                     <ProtectedRoute>
//                       <AdminDashboard />
//                     </ProtectedRoute>
//                   }
//                 />
//               </Routes>
//             </main>
//             <Footer />
//           </div>
//         </Router>
//       </ToastProvider>
//     </AuthProvider>
//   );
// }

// export default App;



// import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
// import { useEffect } from 'react';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import Home from './pages/Home';
// import About from './pages/About';
// import NewsDetail from './pages/NewsDetail';
// import AdminLogin from './pages/AdminLogin';
// import AdminSignup from './pages/AdminSignup';
// import AdminDashboard from './pages/AdminDashboard';
// import ProtectedRoute from './components/ProtectedRoute';
// import { AuthProvider } from './context/AuthContext';
// import { ToastProvider } from './context/ToastContext';
// import Contact from './pages/Contact';
// import NewsletterConfirm from './pages/Newsletterconfirm';
// import NewsletterUnsubscribe from './pages/Newsletterunsubscribe';
// import Privacy from './pages/Privacy';
// import Terms from './pages/Terms';
// import ForgotPassword from './pages/ForgotPassword_fixed';
// import ResetPassword from './pages/ResetPassword_fixed';

// function ScrollToTop() {
//   const { pathname } = useLocation();
//   useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
//   return null;
// }

// function App() {
//   return (
//     <AuthProvider>
//       <ToastProvider>
//         <Router>
//           <ScrollToTop />
//           <div className="flex flex-col min-h-screen">
//             <Navbar />
//             <main className="flex-grow">
//               <Routes>
//                 <Route path="/" element={<Home />} />
//                 <Route path="/about" element={<About />} />
//                 <Route path="/contact" element={<Contact />} />

//                 {/* ── Slug-based article route ── */}
//                 <Route path="/news/:slug" element={<NewsDetail />} />

//                 <Route path="/admin/login" element={<AdminLogin />} />
//                 <Route path="/admin/signup" element={<AdminSignup />} />
//                 <Route path="/admin/forgot-password" element={<ForgotPassword />} />
//                 <Route path="/admin/reset-password/:token" element={<ResetPassword />} />
//                 <Route path="/newsletter/confirm/:token" element={<NewsletterConfirm />} />
//                 <Route path="/newsletter/unsubscribe/:token" element={<NewsletterUnsubscribe />} />
//                 <Route path="/privacy" element={<Privacy />} />
//                 <Route path="/terms" element={<Terms />} />

//                 <Route
//                   path="/admin/dashboard"
//                   element={
//                     <ProtectedRoute>
//                       <AdminDashboard />
//                     </ProtectedRoute>
//                   }
//                 />
//               </Routes>
//             </main>
//             <Footer />
//           </div>
//         </Router>
//       </ToastProvider>
//     </AuthProvider>
//   );
// }

// export default App;



import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import NewsDetail from './pages/NewsDetail';
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Contact from './pages/Contact';
import NewsletterConfirm from './pages/Newsletterconfirm';
import NewsletterUnsubscribe from './pages/Newsletterunsubscribe';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import ForgotPassword from './pages/ForgotPassword_fixed';
import ResetPassword from './pages/ResetPassword_fixed';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />

                {/* ── Category slug route — same Home component, reads useParams().slug ── */}
                <Route path="/category/:slug" element={<Home />} />

                {/* ── Article slug route ── */}
                <Route path="/news/:slug" element={<NewsDetail />} />

                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/signup" element={<AdminSignup />} />
                <Route path="/admin/forgot-password" element={<ForgotPassword />} />
                <Route path="/admin/reset-password/:token" element={<ResetPassword />} />
                <Route path="/newsletter/confirm/:token" element={<NewsletterConfirm />} />
                <Route path="/newsletter/unsubscribe/:token" element={<NewsletterUnsubscribe />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />

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
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;