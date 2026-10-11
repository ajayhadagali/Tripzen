import { useState } from 'react';
import { X } from 'lucide-react';

export default function AddDayModal({ onClose, onAdd }) {
  const [dayLabel, setDayLabel] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dayLabel.trim()) {
      setError('Enter a day label, like "Day 3"');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await onAdd(dayLabel.trim());
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add the day');
      setSaving(false);
    }
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
          <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
            {saving ? 'Saving...' : 'Add day'}
          </button>
          {error && <p className="error-text">{error}</p>}
        </form>
      </div>
    </div>
  );
}