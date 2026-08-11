import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import {
  LayoutDashboard, FileText, FolderKanban, Newspaper, Image as ImageIcon,
  Users, MessageSquare, BarChart3, Mail, Settings as SettingsIcon,
  ScrollText, LogOut, Menu, X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { confirmToast } from '../components/admin/AdminUI';
import toast from 'react-hot-toast';

import DashboardOverview from './admin/DashboardOverview';
import StoriesManagement from './admin/StoriesManagement';
import StoryEditor from './admin/StoryEditor';
import CategoriesManagement from './admin/CategoriesManagement';
import DesksManagement from './admin/DesksManagement';
import MediaLibrary from './admin/MediaLibrary';
import UsersManagement from './admin/UsersManagement';
import AnalyticsPanel from './admin/AnalyticsPanel';
import SettingsPanel from './admin/SettingsPanel';
import ActivityLogsPanel from './admin/ActivityLogsPanel';
import AdminCommentsManagement from '../components/Admincommentsmanagement';
import NewsletterManagement from '../components/Newslettermanagement';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'stories', label: 'Stories', icon: FileText },
  { id: 'categories', label: 'Categories', icon: FolderKanban },
  { id: 'desks', label: 'Desks', icon: Newspaper },
  { id: 'media', label: 'Media Library', icon: ImageIcon },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'comments', label: 'Comments', icon: MessageSquare },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'subscribers', label: 'Subscribers', icon: Mail },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
  { id: 'activity', label: 'Activity Logs', icon: ScrollText },
];

const SUPER_ADMIN_ONLY = new Set(['users', 'settings', 'activity']);

const AdminDashboard = () => {
  const { admin, logout, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('dashboard');
  const [editingPostId, setEditingPostId] = useState(undefined); // undefined = not editing, null = new post, string = editing that post
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const visibleNavItems = NAV_ITEMS.filter(item => !SUPER_ADMIN_ONLY.has(item.id) || isSuperAdmin);

  const handleLogout = () => confirmToast('Logout?', "You'll need to login again to access the dashboard.", async () => {
    logout();
    toast.success('Logged out!');
    setTimeout(() => navigate('/admin/login'), 500);
  }, 'Logout', false);

  const openNewStory = () => { setEditingPostId(null); setActiveSection('stories'); };
  const openEditStory = (postId) => { setEditingPostId(postId); setActiveSection('stories'); };
  const closeEditor = () => setEditingPostId(undefined);

  const goTo = (id) => {
    setActiveSection(id);
    setSidebarOpen(false);
    if (id !== 'stories') setEditingPostId(undefined);
  };

  const renderPanel = () => {
    if (activeSection === 'stories') {
      if (editingPostId !== undefined) {
        return <StoryEditor postId={editingPostId} onClose={closeEditor} onSaved={closeEditor} />;
      }
      return <StoriesManagement onEdit={openEditStory} onNew={openNewStory} />;
    }
    switch (activeSection) {
      case 'dashboard': return <DashboardOverview onNewStory={openNewStory} onGoTo={goTo} />;
      case 'categories': return <CategoriesManagement />;
      case 'desks': return <DesksManagement />;
      case 'media': return <MediaLibrary />;
      case 'users': return isSuperAdmin ? <UsersManagement /> : null;
      case 'comments': return <AdminCommentsManagement />;
      case 'analytics': return <AnalyticsPanel />;
      case 'subscribers': return <NewsletterManagement />;
      case 'settings': return isSuperAdmin ? <SettingsPanel /> : null;
      case 'activity': return isSuperAdmin ? <ActivityLogsPanel /> : null;
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink-paper)', display: 'flex' }}>
      <style>{`
        @keyframes ink-spin { to { transform: rotate(360deg); } }
        .admin-sidebar { transition: transform .25s ease; }
        @media (max-width: 900px) {
          .admin-sidebar {
            position: fixed; top: 0; left: 0; bottom: 0; z-index: 200;
            transform: translateX(-100%);
          }
          .admin-sidebar.open { transform: translateX(0); }
          .admin-sidebar-backdrop { display: none; position: fixed; inset: 0; background: rgba(0,0,0,.5); z-index: 190; }
          .admin-sidebar-backdrop.open { display: block; }
          .admin-mobile-toggle { display: flex !important; }
        }
        .admin-mobile-toggle { display: none; }
        .admin-nav-item { display: flex; align-items: center; gap: 12px; padding: 11px 16px; cursor: pointer; border: none; background: transparent; width: 100%; text-align: left; font-family: 'Source Sans 3', sans-serif; font-size: 13.5px; font-weight: 600; color: rgba(238,234,223,.7); transition: .15s; border-left: 3px solid transparent; }
        .admin-nav-item:hover { background: rgba(238,234,223,.06); color: #eeeadf; }
        .admin-nav-item.active { background: rgba(168,50,31,.15); color: #eeeadf; border-left-color: var(--ink-stamp); }
      `}</style>

      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {sidebarOpen && <div className="admin-sidebar-backdrop open" onClick={() => setSidebarOpen(false)} />}

      {/* -- Sidebar -- */}
      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`} style={{ width: 240, flexShrink: 0, background: '#161410', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '22px 18px 18px', borderBottom: '1px solid rgba(238,234,223,.1)' }}>
          <h1 className="ink-serif" style={{ fontSize: 20, fontWeight: 600, color: '#eeeadf', margin: 0, lineHeight: 1 }}>
            SYD<em style={{ fontStyle: 'italic', color: 'var(--ink-stamp)' }}>LINES</em>
          </h1>
          <p className="ink-mono" style={{ fontSize: 9, letterSpacing: '.25em', color: 'rgba(238,234,223,.4)', margin: '5px 0 0' }}>MEDIA</p>
        </div>

        <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(238,234,223,.1)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', border: '1.5px solid var(--ink-stamp)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: 'var(--ink-stamp)', flexShrink: 0 }}>
            {admin?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 12.5, fontWeight: 700, color: '#eeeadf', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{admin?.name}</p>
            <p className="ink-mono" style={{ fontSize: 9.5, color: isSuperAdmin ? 'var(--ink-stamp)' : 'rgba(238,234,223,.5)', margin: '2px 0 0', fontWeight: 700, letterSpacing: '.04em' }}>
              {isSuperAdmin ? 'SUPER ADMIN' : (admin?.role || 'ADMIN').toUpperCase()}
            </p>
          </div>
        </div>

        <nav style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>
          {visibleNavItems.map(item => {
            const Icon = item.icon;
            const active = activeSection === item.id;
            return (
              <button key={item.id} className={`admin-nav-item${active ? ' active' : ''}`} onClick={() => goTo(item.id)}>
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: 14, borderTop: '1px solid rgba(238,234,223,.1)' }}>
          <button onClick={handleLogout} className="admin-nav-item" style={{ color: 'rgba(238,234,223,.6)' }}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* -- Main content -- */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div className="admin-mobile-toggle" style={{ alignItems: 'center', gap: 10, padding: '14px 18px', borderBottom: '1px solid var(--ink-rule)', background: 'var(--ink-paper)' }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: '1px solid var(--ink-rule)', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--ink-ink)' }}>
            <Menu size={18} />
          </button>
          <span className="ink-serif" style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink-ink)' }}>
            SYD<em style={{ fontStyle: 'italic', color: 'var(--ink-stamp)' }}>LINES</em>
          </span>
        </div>

        <div style={{ flex: 1, padding: '28px 24px 60px', maxWidth: 1400, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
          {renderPanel()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;