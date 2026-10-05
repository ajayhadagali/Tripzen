import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { getItinerary, addDay, addActivity } from '../mockStore';
import AddDayModal from './AddDayModal';
import AddActivityModal from './AddActivityModal';

export default function ItineraryTab({ tripId }) {
  const [days, setDays] = useState([]);
  const [showAddDay, setShowAddDay] = useState(false);
  const [activeDayForActivity, setActiveDayForActivity] = useState(null);

  useEffect(() => {
    setDays(getItinerary(tripId));
  }, [tripId]);

  const handleAddDay = (dayLabel) => {
    addDay(tripId, dayLabel);
    setDays(getItinerary(tripId));
  };

  const handleAddActivity = (text) => {
    addActivity(tripId, activeDayForActivity.id, text);
    setDays(getItinerary(tripId));
  };

  return (
    <div>
      {days.length === 0 && <p style={{ marginBottom: 16 }}>No itinerary yet — add your first day.</p>}

      {days.map((d) => (
        <div key={d.id} className="place-tile" style={{ marginBottom: 14 }}>
          <span className="tag">{d.day}</span>
          {d.activities.length > 0 && (
            <ul style={{ margin: '8px 0 0', paddingLeft: 18, color: 'var(--ink-soft)' }}>
              {d.activities.map((a, i) => <li key={i} style={{ marginBottom: 4 }}>{a}</li>)}
            </ul>
          )}
          <button
            className="btn btn-ghost"
            style={{ marginTop: 10, padding: '6px 12px', fontSize: 13 }}
            onClick={() => setActiveDayForActivity(d)}
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

      {activeDayForActivity && (
        <AddActivityModal
          dayLabel={activeDayForActivity.day}
          onClose={() => setActiveDayForActivity(null)}
          onAdd={handleAddActivity}
        />
      )}
    </div>
  );
}