import { useEffect, useState } from 'react';
import { Plus, ArrowRightLeft } from 'lucide-react';
import { getExpenses, addExpense } from '../mockStore';
import AddExpenseModal from './AddExpenseModal';
import SettlementView from './SettlementView';

export default function ExpensesTab({ tripId, members }) {
  const [expenses, setExpenses] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showSettle, setShowSettle] = useState(false);

  useEffect(() => {
    setExpenses(getExpenses(tripId));
  }, [tripId]);

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const perHead = members.length ? Math.round(total / members.length) : 0;

  const handleAdd = (expense) => {
    addExpense(tripId, expense);
    setExpenses(getExpenses(tripId));
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

      {expenses.length === 0 && <p style={{ marginBottom: 16 }}>No expenses logged yet.</p>}

      {expenses.map((e) => (
        <div key={e.id} className="expense-row">
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
        <SettlementView
          expenses={expenses}
          members={members}
          onClose={() => setShowSettle(false)}
        />
      )}
    </div>
  );
}