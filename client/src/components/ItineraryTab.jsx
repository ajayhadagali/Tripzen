import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import api from '../api';
import AddDayModal from './AddDayModal';
import AddActivityModal from './AddActivityModal';

export default function ItineraryTab({ tripId }) {
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddDay, setShowAddDay] = useState(false);
  const [activeDay, setActiveDay] = useState(null);

  const loadDays = async () => {
    try {
      const { data } = await api.get(`/itinerary/${tripId}`);
      setDays(data);
      setError('');
    } catch {
      setError('Could not load the itinerary. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadDays();
  }, [tripId]);

  // These throw on failure so the modals can show the server's message
  const handleAddDay = async (dayLabel) => {
    await api.post(`/itinerary/${tripId}`, { day: dayLabel });
    await loadDays();
  };

  const handleAddActivity = async (text) => {
    await api.post(`/itinerary/${tripId}/${activeDay._id}/activities`, { text });
    await loadDays();
  };

  return (
    <div>
      {loading && <p>Loading itinerary...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && days.length === 0 && (
        <p style={{ marginBottom: 16 }}>No itinerary yet. Add your first day.</p>
      )}

      {days.map((d) => (
        <div key={d._id} className="place-tile" style={{ marginBottom: 14 }}>
          <span className="tag">{d.day}</span>
          {d.activities.length > 0 && (
            <ul style={{ margin: '8px 0 0', paddingLeft: 18, color: 'var(--ink-soft)' }}>
              {d.activities.map((a, i) => <li key={i} style={{ marginBottom: 4 }}>{a}</li>)}
            </ul>
          )}
          <button
            className="btn btn-ghost"
            style={{ marginTop: 10, padding: '6px 12px', fontSize: 13 }}
            onClick={() => setActiveDay(d)}
          >
            <Plus size={14} /> Add activity
          </button>
        </div>
      ))}

      <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => setShowAddDay(true)}>
        <Plus size={16} /> Add day
      </button>

      {showAddDay && (
        <AddDayModal onClose={() => setShowAddDay(false)} onAdd={handleAddDay} />
      )}

      {activeDay && (
        <AddActivityModal
          dayLabel={activeDay.day}
          onClose={() => setActiveDay(null)}
          onAdd={handleAddActivity}
        />
      )}
    </div>
  );
}