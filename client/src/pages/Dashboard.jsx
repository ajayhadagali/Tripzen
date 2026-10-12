import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LogOut, Plus, Users, Trash2 } from 'lucide-react';
import api from '../api';

export default function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tripToDelete, setTripToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    api.get('/trips')
      .then(({ data }) => setTrips(data.map((t) => ({ ...t, id: t._id }))))
      .catch(() => setError('Could not load trips. Is the server running?'))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const confirmDelete = async () => {
    setDeleting(true);
    setDeleteError('');
    try {
      await api.delete(`/trips/${tripToDelete.id}`);
      setTrips((prev) => prev.filter((t) => t.id !== tripToDelete.id));
      setTripToDelete(null);
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Could not delete the trip');
    } finally {
      setDeleting(false);
    }
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

      {loading && <p>Loading your trips...</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="ticket-grid">
        {trips.map((trip) => (
          <div key={trip.id} className="ticket" onClick={() => navigate(`/trip/${trip.id}`)}>
            <div className="ticket-top">
              <button
                className="ticket-delete"
                title="Delete trip"
                aria-label={`Delete ${trip.name}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteError('');
                  setTripToDelete(trip);
                }}
              >
                <Trash2 size={16} />
              </button>
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
              <span className="badge"><Users size={12} style={{ marginRight: 4, verticalAlign: -2 }} />{trip.members.length} members</span>
              <span>View trip →</span>
            </div>
          </div>
        ))}

        <div className="add-trip-card" onClick={() => navigate('/trip/new')}>
          <Plus size={22} />
          <span style={{ fontWeight: 600 }}>Plan a new trip</span>
        </div>
      </div>

      {tripToDelete && (
        <div className="modal-overlay" onClick={() => !deleting && setTripToDelete(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete this trip?</h3>
            </div>
            <p style={{ marginBottom: 6 }}>
              <strong>{tripToDelete.name}</strong> and all its expenses and itinerary will be removed. This can't be undone.
            </p>
            {deleteError && <p className="error-text">{deleteError}</p>}
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setTripToDelete(null)} disabled={deleting}>
                Keep trip
              </button>
              <button className="btn btn-danger" style={{ flex: 1, justifyContent: 'center' }}
                onClick={confirmDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete trip'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}