import { useEffect, useState } from 'react';
import { Plus, ArrowRightLeft } from 'lucide-react';
import api from '../api';
import AddExpenseModal from './AddExpenseModal';
import SettlementView from './SettlementView';

export default function ExpensesTab({ tripId, members }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showSettle, setShowSettle] = useState(false);

  const loadExpenses = async () => {
    try {
      const { data } = await api.get(`/expenses/${tripId}`);
      setExpenses(data);
      setError('');
    } catch {
      setError('Could not load expenses. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadExpenses();
  }, [tripId]);

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const perHead = members.length ? Math.round(total / members.length) : 0;

  // Throws on failure so the modal can show the error
  const handleAdd = async (expense) => {
    await api.post(`/expenses/${tripId}`, expense);
    await loadExpenses();
  };

  return (
    <div>
      <div className="stat-strip">
        <div className="stat-box">
          <div className="label">Total spent</div>
          <div className="value">₹{total}</div>
        </div>
        <div className="stat-box">
          <div className="label">Per person (avg)</div>
          <div className="value">₹{perHead}</div>
        </div>
      </div>

      <div className="section-title">
        <h3>All expenses</h3>
      </div>

      {loading && <p>Loading expenses...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && expenses.length === 0 && (
        <p style={{ marginBottom: 16 }}>No expenses logged yet.</p>
      )}

      {expenses.map((e) => (
        <div key={e._id} className="expense-row">
          <div>
            <div style={{ fontWeight: 600 }}>{e.title}</div>
            <div className="who">paid by {e.paidBy} · split among {e.splitAmong.length}</div>
          </div>
          <div className="amt">₹{e.amount}</div>
        </div>
      ))}

      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Add expense
        </button>
        <button className="btn btn-secondary" onClick={() => setShowSettle(true)}>
          <ArrowRightLeft size={16} /> View settlement
        </button>
      </div>

      {showAdd && (
        <AddExpenseModal
          members={members}
          onClose={() => setShowAdd(false)}
          onAdd={handleAdd}
        />
      )}

      {showSettle && (
        <SettlementView tripId={tripId} onClose={() => setShowSettle(false)} />
      )}
    </div>
  );
}