import { useState } from 'react';
import { X } from 'lucide-react';

export default function AddActivityModal({ dayLabel, onClose, onAdd }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text.trim());
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add activity — {dayLabel}</h3>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Activity</label>
            <input
              placeholder="e.g. Scuba diving at Grand Island"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">Add activity</button>
        </form>
      </div>
    </div>
  );
}