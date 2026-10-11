import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import api from '../api';

export default function SettlementView({ tripId, onClose }) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/expenses/${tripId}/settlement`)
      .then(({ data }) => setResult(data))
      .catch(() => setError('Could not calculate the settlement.'));
  }, [tripId]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Settle up</h3>
        </div>

        {error && <p className="error-text">{error}</p>}
        {!result && !error && <p>Calculating...</p>}

        {result && (
          <>
            <h4 style={{ fontSize: 15, marginBottom: 6 }}>Who is owed, who owes</h4>
            {Object.entries(result.balances).map(([person, paise]) => (
              <div key={person} className="settle-row">
                <span className="who">{person}</span>
                <span className="settle-amt" style={{ color: paise >= 0 ? 'var(--teal)' : 'var(--coral-dark)' }}>
                  {paise >= 0 ? 'gets back' : 'owes'} ₹{(Math.abs(paise) / 100).toFixed(0)}
                </span>
              </div>
            ))}

            <h4 style={{ fontSize: 15, margin: '20px 0 6px' }}>
              {result.transactions.length === 0
                ? 'Everyone is settled up'
                : `${result.transactions.length} payment${result.transactions.length > 1 ? 's' : ''} settle everything`}
            </h4>
            {result.transactions.map((t, i) => (
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