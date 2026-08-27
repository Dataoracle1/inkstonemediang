import React, { useState, useEffect } from 'react';
import { Clock, User, FileText, MessageCircle, Trash2 } from 'lucide-react';

const ActivityLogsPanel = () => {
  const [logs, setLogs] = useState([
    { _id: '1', action: 'Post Created', user: 'Admin User', details: 'Created new post: Breaking News', timestamp: '2024-08-27 10:30', icon: FileText },
    { _id: '2', action: 'Comment Approved', user: 'Editor', details: 'Approved 5 comments', timestamp: '2024-08-27 09:15', icon: MessageCircle },
    { _id: '3', action: 'User Login', user: 'Admin User', details: 'Login from 192.168.1.1', timestamp: '2024-08-27 08:00', icon: User },
  ]);

  return (
    <div>
      <style>{`
        .logs-header { font-family: "Playfair Display", serif; font-size: 24px; font-weight: 700; color: #071A33; margin: 0 0 32px; }
        .logs-container { display: flex; flex-direction: column; gap: 16px; }
        .log-item { background: white; border: 1px solid #e8e4dd; border-radius: 8px; padding: 16px; display: flex; gap: 16px; align-items: flex-start; }
        .log-icon { width: 40px; height: 40px; background: rgba(196,66,47,.1); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #C4422F; flex-shrink: 0; }
        .log-content { flex: 1; }
        .log-action { font-weight: 600; color: #071A33; margin: 0; }
        .log-user { font-size: 12px; color: #64748B; margin: 4px 0 0; font-family: "IBM Plex Mono", monospace; }
        .log-details { font-size: 13px; color: #17202A; margin: 8px 0 0; line-height: 1.5; }
        .log-time { font-size: 11px; color: #64748B; font-family: "IBM Plex Mono", monospace; margin: 8px 0 0; }
        .log-delete { width: 32px; height: 32px; border: 1px solid #e8e4dd; background: white; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #C4422F; }
        .log-delete:hover { background: #C4422F; color: white; border-color: #C4422F; }
      `}</style>

      <h1 className="logs-header">Activity Logs</h1>

      <div className="logs-container">
        {logs.map((log) => (
          <div key={log._id} className="log-item">
            <div className="log-icon">
              <log.icon size={20} />
            </div>
            <div className="log-content">
              <p className="log-action">{log.action}</p>
              <p className="log-user">By: {log.user}</p>
              <p className="log-details">{log.details}</p>
              <p className="log-time">
                <Clock size={11} style={{ display: 'inline', marginRight: 4 }} />
                {log.timestamp}
              </p>
            </div>
            <button className="log-delete"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLogsPanel;