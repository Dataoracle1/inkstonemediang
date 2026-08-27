import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, BarChart3, FileText, Tag, Users, Image, MessageSquare, Settings, Eye, Bell, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import DashboardOverview from '../components/DashboardOverview';
import StoriesManagement from '../components/StoriesManagement';
import CategoriesManagement from '../components/CategoriesManagement';
import DesksManagement from '../components/DesksManagement';
import MediaLibrary from '../components/MediaLibrary';
import AdminCommentsManagement from '../components/Admincommentsmanagement';
import SettingsPanel from '../components/SettingsPanel';
import ActivityLogsPanel from '../components/ActivityLogsPanel';
import AnalyticsPanel from '../components/AnalyticsPanel';
import UsersManagement from '../components/UsersManagement';
import Newslettermanagement from '../components/Newslettermanagement';
import Contactsmanagement from '../components/Contactsmanagement';

const AdminDashboard = () => {
  const { isAuthenticated, admin, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    } else {
      setIsAdmin(admin?.role === 'super-admin' || admin?.role === 'admin');
    }
  }, [isAuthenticated, navigate, admin]);

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'success');
    navigate('/admin/login');
  };

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: BarChart3, public: true },
    { id: 'stories', label: 'Stories', icon: FileText, public: true },
    { id: 'categories', label: 'Categories', icon: Tag, public: true },
    { id: 'desks', label: 'Desks', icon: Home, public: true },
    { id: 'media', label: 'Media Library', icon: Image, public: true },
    { id: 'comments', label: 'Comments', icon: MessageCircle, public: true },
    { id: 'analytics', label: 'Analytics', icon: Eye, public: true },
    { id: 'subscribers', label: 'Newsletter', icon: Bell, public: true },
    { id: 'contacts', label: 'Contacts', icon: Users, public: true },
    { id: 'users', label: 'Users', icon: Users, public: false },
    { id: 'activity', label: 'Activity', icon: Bell, public: false },
    { id: 'settings', label: 'Settings', icon: Settings, public: false },
  ];

  const filteredMenuItems = menuItems.filter(item => !item.public || isAdmin);

  const renderSection = () => {
    switch (activeSection) {
      case 'overview': return <DashboardOverview />;
      case 'stories': return <StoriesManagement />;
      case 'categories': return <CategoriesManagement />;
      case 'desks': return <DesksManagement />;
      case 'media': return <MediaLibrary />;
      case 'comments': return <AdminCommentsManagement />;
      case 'analytics': return <AnalyticsPanel />;
      case 'subscribers': return <Newslettermanagement />;
      case 'contacts': return <Contactsmanagement />;
      case 'users': return isAdmin ? <UsersManagement /> : null;
      case 'activity': return isAdmin ? <ActivityLogsPanel /> : null;
      case 'settings': return isAdmin ? <SettingsPanel /> : null;
      default: return <DashboardOverview />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#FAF9F6' }}>
      <style>{`
        .admin-sidebar {
          width: 240px;
          background: #071A33;
          color: #eeeadf;
          border-right: 1px solid rgba(238, 234, 223, 0.1);
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          transition: transform .3s ease;
        }
        .admin-sidebar.mobile-open {
          position: fixed;
          left: 0;
          top: 0;
          height: 100vh;
          z-index: 100;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        .admin-logo {
          padding: 24px 20px;
          border-bottom: 1px solid rgba(238, 234, 223, 0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .admin-logo-text {
          font-family: "Playfair Display", serif;
          font-size: 24px;
          font-weight: 700;
          color: #eeeadf;
        }
        .admin-logo-dot {
          color: #C4422F;
          font-style: italic;
        }
        .admin-close-btn {
          display: none;
          background: none;
          border: none;
          color: #eeeadf;
          cursor: pointer;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .admin-menu {
          flex: 1;
          padding: 16px 0;
          overflow-y: auto;
        }
        .admin-menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          color: rgba(238, 234, 223, 0.7);
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          border-left: 3px solid transparent;
          cursor: pointer;
          transition: all .15s;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          font-family: inherit;
        }
        .admin-menu-item:hover {
          background: rgba(238, 234, 223, 0.08);
          color: #eeeadf;
        }
        .admin-menu-item.active {
          background: rgba(238, 234, 223, 0.08);
          color: #eeeadf;
          border-left-color: #C4422F;
        }
        .admin-footer {
          padding: 20px;
          border-top: 1px solid rgba(238, 234, 223, 0.1);
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 12px;
        }
        .admin-user-avatar {
          width: 36px;
          height: 36px;
          background: #C4422F;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: white;
        }
        .admin-logout-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: rgba(238, 234, 223, 0.1);
          border: none;
          color: #eeeadf;
          border-radius: 4px;
          cursor: pointer;
          font-size: 11px;
          font-weight: 600;
          transition: all .15s;
          margin-left: auto;
        }
        .admin-logout-btn:hover {
          background: #C4422F;
          color: white;
        }
        .admin-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .admin-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 32px;
          background: white;
          border-bottom: 1px solid #e8e4dd;
        }
        .admin-topbar-title {
          font-family: "Playfair Display", serif;
          font-size: 24px;
          font-weight: 700;
          color: #071A33;
          margin: 0;
        }
        .admin-menu-toggle {
          display: none;
          background: none;
          border: none;
          width: 40px;
          height: 40px;
          cursor: pointer;
          color: #071A33;
          align-items: center;
          justify-content: center;
        }
        .admin-content {
          flex: 1;
          overflow-y: auto;
          padding: 32px;
          background: #FAF9F6;
        }
        @media (max-width: 1024px) {
          .admin-sidebar {
            position: fixed;
            left: 0;
            top: 0;
            height: 100vh;
            transform: translateX(-100%);
            z-index: 100;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          }
          .admin-sidebar.mobile-open {
            transform: translateX(0);
          }
          .admin-close-btn { display: flex; }
          .admin-menu-toggle { display: flex; }
          .admin-main {
            width: 100%;
          }
          .admin-topbar { padding: 16px 20px; }
          .admin-content { padding: 20px; }
        }
      `}</style>

      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="admin-logo">
          <div>
            <div className="admin-logo-text">
              SYDLINES<span className="admin-logo-dot">.</span>
            </div>
            <div style={{ fontSize: 9, letterSpacing: '.08em', color: 'rgba(238,234,223,.6)', marginTop: 4 }}>ADMIN</div>
          </div>
          {isMobileMenuOpen && (
            <button className="admin-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="admin-menu">
          {filteredMenuItems.map((item) => (
            <button
              key={item.id}
              className={`admin-menu-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveSection(item.id);
                setIsMobileMenuOpen(false);
              }}
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="admin-footer">
          <div className="admin-user-avatar">{admin?.name?.charAt(0).toUpperCase()}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {admin?.name || 'Admin'}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(238,234,223,.6)' }}>{admin?.role}</div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="admin-main">
        {/* TOPBAR */}
        <div className="admin-topbar">
          <button className="admin-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="admin-topbar-title">
            {filteredMenuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
          </h1>
          <div style={{ fontSize: 12, color: '#64748B', fontFamily: '"IBM Plex Mono", monospace' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        {/* CONTENT */}
        <div className="admin-content">
          {renderSection()}
        </div>
      </main>

      {/* MOBILE BACKDROP */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 99,
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;