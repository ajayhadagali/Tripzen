import { useState } from 'react';
import { X } from 'lucide-react';

export default function AddActivityModal({ dayLabel, onClose, onAdd }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Describe the activity first');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await onAdd(text.trim());
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add the activity');
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add activity: {dayLabel}</h3>
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
          <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
            {saving ? 'Saving...' : 'Add activity'}
          </button>
          {error && <p className="error-text">{error}</p>}
        </form>
      </div>
    </div>
  );
}