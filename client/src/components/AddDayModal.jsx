import { useState } from 'react';
import { X } from 'lucide-react';

export default function AddDayModal({ onClose, onAdd }) {
  const [dayLabel, setDayLabel] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!dayLabel.trim()) return;
    onAdd(dayLabel.trim());
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add a day</h3>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Day label</label>
            <input
              placeholder="e.g. Day 3"
              value={dayLabel}
              onChange={(e) => setDayLabel(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">Add day</button>
        </form>
      </div>
    </div>
  );
}