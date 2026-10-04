import { Plus } from 'lucide-react';

const mockDays = [
  { day: 'Day 1', activities: ['Arrival & check-in', 'Baga Beach sunset'] },
  { day: 'Day 2', activities: ['Fort Aguada visit', 'Anjuna market shopping'] },
];

export default function ItineraryTab() {
  return (
    <div>
      {mockDays.map((d) => (
        <div key={d.day} className="place-tile" style={{ marginBottom: 14 }}>
          <span className="tag">{d.day}</span>
          <ul style={{ margin: '8px 0 0', paddingLeft: 18, color: 'var(--ink-soft)' }}>
            {d.activities.map((a) => <li key={a} style={{ marginBottom: 4 }}>{a}</li>)}
          </ul>
        </div>
      ))}
      <button className="btn btn-primary" style={{ marginTop: 8 }}>
        <Plus size={16} /> Add activity
      </button>
    </div>
  );
}