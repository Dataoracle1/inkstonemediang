import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const DesksManagement = () => {
  const [desks, setDesks] = useState([]);
  const [newDesk, setNewDesk] = useState('');

  useEffect(() => {
    setDesks([
      { _id: '1', name: 'Breaking News', count: 24 },
      { _id: '2', name: 'Business', count: 18 },
      { _id: '3', name: 'Technology', count: 15 },
    ]);
  }, []);

  const handleAdd = () => {
    if (!newDesk.trim()) return;
    setDesks([...desks, { _id: Date.now(), name: newDesk, count: 0 }]);
    setNewDesk('');
  };

  const handleDelete = (id) => {
    setDesks(desks.filter(d => d._id !== id));
  };

  return (
    <div>
      <style>{`
        .desks-header { font-family: "Playfair Display", serif; font-size: 24px; font-weight: 700; color: #071A33; margin: 0 0 32px; }
        .input-group { display: flex; gap: 12px; margin-bottom: 32px; }
        .input-group input { flex: 1; padding: 10px 14px; border: 1px solid #e8e4dd; border-radius: 4px; font-family: inherit; }
        .btn-primary { padding: 10px 20px; background: #C4422F; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 8px; }
        .btn-primary:hover { opacity: 0.9; }
        .desks-table { width: 100%; border-collapse: collapse; background: white; border: 1px solid #e8e4dd; border-radius: 8px; overflow: hidden; }
        .desks-table th { background: #F1F3F5; padding: 14px; text-align: left; font-weight: 600; font-size: 12px; font-family: "IBM Plex Mono", monospace; color: #64748B; }
        .desks-table td { padding: 14px; border-bottom: 1px solid #e8e4dd; }
        .desk-name { font-weight: 600; color: #071A33; }
        .desk-count { background: rgba(196,66,47,.1); color: #C4422F; padding: 4px 8px; border-radius: 4px; font-weight: 600; font-size: 12px; }
        .action-btns { display: flex; gap: 8px; }
        .action-btn { width: 32px; height: 32px; border: 1px solid #e8e4dd; background: white; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .action-btn:hover { background: #C4422F; color: white; border-color: #C4422F; }
      `}</style>

      <h1 className="desks-header">Desks Management</h1>

      <div className="input-group">
        <input
          type="text"
          value={newDesk}
          onChange={(e) => setNewDesk(e.target.value)}
          placeholder="New desk name..."
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button onClick={handleAdd} className="btn-primary">
          <Plus size={16} /> Add
        </button>
      </div>

      <table className="desks-table">
        <thead>
          <tr>
            <th>Desk Name</th>
            <th>Stories</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {desks.map((desk) => (
            <tr key={desk._id}>
              <td className="desk-name">{desk.name}</td>
              <td><span className="desk-count">{desk.count} stories</span></td>
              <td>
                <div className="action-btns">
                  <button className="action-btn"><Edit2 size={14} /></button>
                  <button className="action-btn" onClick={() => handleDelete(desk._id)}>
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

export default DesksManagement;