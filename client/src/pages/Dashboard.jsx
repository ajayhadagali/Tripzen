import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { LogOut, Plus, Users } from 'lucide-react';

const mockTrips = [
  { id: 1, name: 'Goa Trip', destination: 'Goa', members: 4, dates: '12-15 Dec' },
  { id: 2, name: 'Manali Trek', destination: 'Manali', members: 5, dates: '20-25 Dec' },
];

export default function Dashboard() {
  const [trips] = useState(mockTrips);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="eyebrow">Tripzen</span>
          <h2>Welcome back, {user.name || 'Traveler'}</h2>
        </div>
        <button className="btn btn-ghost" onClick={handleLogout}>
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="section-title">
        <h3>Your trips</h3>
      </div>

      <div className="ticket-grid">
        {trips.map((trip) => (
          <div key={trip.id} className="ticket" onClick={() => navigate(`/trip/${trip.id}`)}>
            <div className="ticket-top">
              <div className="trip-name">{trip.name}</div>
              <div className="trip-dates">{trip.dates}</div>
            </div>
            <div className="ticket-route">
              <span className="dot" />
              <span className="place-label">Home</span>
              <span className="dashes" />
              <span className="place-label">{trip.destination}</span>
              <span className="dot end" />
            </div>
            <div className="ticket-perf" />
            <div className="ticket-bottom">
              <span className="badge"><Users size={12} style={{ marginRight: 4, verticalAlign: -2 }} />{trip.members} members</span>
              <span>View trip →</span>
            </div>
          </div>
        ))}

        <div className="add-trip-card" onClick={() => navigate('/trip/new')}>
          <Plus size={22} />
          <span style={{ fontWeight: 600 }}>Plan a new trip</span>
        </div>
      </div>
    </div>
  );
}