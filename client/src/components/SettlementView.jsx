import { ArrowRight } from 'lucide-react';
import { calculateNetBalances, simplifyDebts } from '../utils/settle';

export default function SettlementView({ expenses, members, onClose }) {
  const balances = calculateNetBalances(expenses, members);
  const transactions = simplifyDebts(balances);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Settle up</h3>
        </div>

        {transactions.length === 0 ? (
          <p>Everyone's settled up — no payments needed.</p>
        ) : (
          <>
            <p style={{ marginBottom: 16 }}>
              {transactions.length} payment{transactions.length > 1 ? 's' : ''} will settle everything.
            </p>
            {transactions.map((t, i) => (
              <div key={i} className="settle-row">
                <span className="who">{t.from}</span>
                <ArrowRight size={16} color="var(--ink-soft)" />
                <span className="who">{t.to}</span>
                <span className="settle-amt">₹{t.amount.toFixed(0)}</span>
              </div>
            ))}
          </>
        )}

        <button className="btn btn-ghost btn-block" style={{ marginTop: 16 }} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}