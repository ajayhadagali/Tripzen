import { useState } from 'react';
import { X } from 'lucide-react';

export default function AddExpenseModal({ members, onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(members[0]);
  const [splitAmong, setSplitAmong] = useState([...members]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const toggleMember = (m) => {
    setSplitAmong((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !amount || splitAmong.length === 0) {
      setError('Fill in all fields and select at least one person to split with');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await onAdd({ title: title.trim(), amount: parseFloat(amount), paidBy, splitAmong });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save the expense');
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add expense</h3>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>What was it for?</label>
            <input placeholder="e.g. Dinner at beach shack" value={title}
              onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="field">
            <label>Amount (₹)</label>
            <input type="number" placeholder="0" value={amount}
              onChange={(e) => setAmount(e.target.value)} />
          </div>

          <div className="field">
            <label>Paid by</label>
            <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
              {members.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="field">
            <label>Split among</label>
            <div className="chip-row">
              {members.map((m) => (
                <button
                  type="button"
                  key={m}
                  className={splitAmong.includes(m) ? 'chip active' : 'chip'}
                  onClick={() => toggleMember(m)}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
            {saving ? 'Saving...' : 'Add expense'}
          </button>
          {error && <p className="error-text">{error}</p>}
        </form>
      </div>
    </div>
  );
}