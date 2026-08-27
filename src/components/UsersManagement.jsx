import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Shield } from 'lucide-react';

const UsersManagement = () => {
  const [users, setUsers] = useState([
    { _id: '1', name: 'Admin User', email: 'admin@sydlines.com', role: 'super-admin', joined: '2024-01-15' },
    { _id: '2', name: 'Editor', email: 'editor@sydlines.com', role: 'admin', joined: '2024-02-20' },
  ]);

  const handleDelete = (id) => {
    if (!window.confirm('Delete this user?')) return;
    setUsers(users.filter(u => u._id !== id));
  };

  return (
    <div>
      <style>{`
        .users-header { font-family: "Playfair Display", serif; font-size: 24px; font-weight: 700; color: #071A33; margin: 0 0 32px; }
        .users-table { width: 100%; border-collapse: collapse; background: white; border: 1px solid #e8e4dd; border-radius: 8px; overflow: hidden; }
        .users-table th { background: #F1F3F5; padding: 14px; text-align: left; font-weight: 600; font-size: 12px; font-family: "IBM Plex Mono", monospace; color: #64748B; }
        .users-table td { padding: 14px; border-bottom: 1px solid #e8e4dd; }
        .user-name { font-weight: 600; color: #071A33; }
        .user-email { font-size: 12px; color: #64748B; }
        .role-badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; background: rgba(196,66,47,.1); color: #C4422F; border-radius: 4px; font-weight: 600; font-size: 11px; }
        .user-actions { display: flex; gap: 8px; }
        .user-btn { width: 32px; height: 32px; border: 1px solid #e8e4dd; background: white; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .user-btn:hover { background: #C4422F; color: white; border-color: #C4422F; }
      `}</style>

      <h1 className="users-header">Users Management</h1>

      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="user-name">{user.name}</td>
              <td className="user-email">{user.email}</td>
              <td>
                <span className="role-badge">
                  <Shield size={12} /> {user.role}
                </span>
              </td>
              <td style={{ fontSize: 12, color: '#64748B' }}>{user.joined}</td>
              <td>
                <div className="user-actions">
                  <button className="user-btn"><Edit2 size={14} /></button>
                  <button className="user-btn" onClick={() => handleDelete(user._id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersManagement;