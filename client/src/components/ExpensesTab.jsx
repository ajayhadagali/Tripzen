import { useState } from 'react';
import { Plus, ArrowRightLeft } from 'lucide-react';

const mockExpenses = [
  { id: 1, title: 'Hotel booking', amount: 4000, paidBy: 'Alice' },
  { id: 2, title: 'Dinner', amount: 1200, paidBy: 'Bob' },
  { id: 3, title: 'Cab', amount: 800, paidBy: 'Carol' },
];

export default function ExpensesTab({ members }) {
  const [expenses] = useState(mockExpenses);
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const perHead = Math.round(total / members.length);

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
      {expenses.map((e) => (
        <div key={e.id} className="expense-row">
          <div>
            <div style={{ fontWeight: 600 }}>{e.title}</div>
            <div className="who">paid by {e.paidBy}</div>
          </div>
          <div className="amt">₹{e.amount}</div>
        </div>
      ))}

      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <button className="btn btn-primary"><Plus size={16} /> Add expense</button>
        <button className="btn btn-secondary"><ArrowRightLeft size={16} /> View settlement</button>
      </div>
    </div>
  );
}