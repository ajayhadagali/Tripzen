import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

// TEMP: mock data until backend Trip API is ready
const mockTrips = [
  { id: 1, name: 'Goa Trip', members: 4, dates: '12-15 Dec' },
  { id: 2, name: 'Manali Trek', members: 5, dates: '20-25 Dec' },
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
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Welcome, {user.name || 'Traveler'}</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <h3>Your Trips</h3>
      <div className="trip-list">
        {trips.map((trip) => (
          <div key={trip.id} className="trip-card">
            <h4>{trip.name}</h4>
            <p>{trip.members} members · {trip.dates}</p>
          </div>
        ))}
      </div>

      <button className="new-trip-btn">+ New Trip</button>
    </div>
  );
}
