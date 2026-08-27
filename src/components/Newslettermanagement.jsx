import React, { useState, useEffect } from 'react';
import { Mail, Trash2, Send } from 'lucide-react';

const Newslettermanagement = () => {
  const [subscribers, setSubscribers] = useState([
    { _id: '1', email: 'subscriber1@example.com', subscribed: true, date: '2024-08-20' },
    { _id: '2', email: 'subscriber2@example.com', subscribed: true, date: '2024-08-19' },
  ]);

  const handleUnsubscribe = (id) => {
    setSubscribers(subscribers.filter(s => s._id !== id));
  };

  const totalSubscribers = subscribers.filter(s => s.subscribed).length;

  return (
    <div>
      <style>{`
        .newsletter-header { font-family: "Playfair Display", serif; font-size: 24px; font-weight: 700; color: #071A33; margin: 0 0 32px; }
        .newsletter-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 32px; }
        .stat-box { background: white; border: 1px solid #e8e4dd; border-radius: 8px; padding: 20px; }
        .stat-label { font-family: "IBM Plex Mono", monospace; font-size: 11px; color: #64748B; letter-spacing: .08em; }
        .stat-number { font-family: "Playfair Display", serif; font-size: 32px; font-weight: 700; color: #071A33; margin: 8px 0 0; }
        .newsletter-table { width: 100%; border-collapse: collapse; background: white; border: 1px solid #e8e4dd; border-radius: 8px; overflow: hidden; }
        .newsletter-table th { background: #F1F3F5; padding: 14px; text-align: left; font-weight: 600; font-size: 12px; font-family: "IBM Plex Mono", monospace; color: #64748B; }
        .newsletter-table td { padding: 14px; border-bottom: 1px solid #e8e4dd; }
        .sub-email { font-weight: 600; color: #071A33; }
        .sub-status { background: rgba(34,197,94,.1); color: #22c55e; padding: 4px 8px; border-radius: 4px; font-weight: 600; font-size: 11px; width: fit-content; }
        .sub-actions { display: flex; gap: 8px; }
        .sub-btn { width: 32px; height: 32px; border: 1px solid #e8e4dd; background: white; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .sub-btn:hover { background: #C4422F; color: white; border-color: #C4422F; }
      `}</style>

      <h1 className="newsletter-header">Newsletter Management</h1>

      <div className="newsletter-stats">
        <div className="stat-box">
          <div className="stat-label">Total Subscribers</div>
          <div className="stat-number">{totalSubscribers}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Subscribed This Month</div>
          <div className="stat-number">12</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Unsubscribed This Month</div>
          <div className="stat-number">2</div>
        </div>
      </div>

      <table className="newsletter-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Status</th>
            <th>Subscribed Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscribers.map((sub) => (
            <tr key={sub._id}>
              <td className="sub-email">{sub.email}</td>
              <td>
                <span className="sub-status">
                  <Mail size={11} style={{ display: 'inline' }} /> Active
                </span>
              </td>
              <td style={{ fontSize: 12, color: '#64748B' }}>{sub.date}</td>
              <td>
                <div className="sub-actions">
                  <button className="sub-btn"><Send size={14} /></button>
                  <button className="sub-btn" onClick={() => handleUnsubscribe(sub._id)}>
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

export default Newslettermanagement;