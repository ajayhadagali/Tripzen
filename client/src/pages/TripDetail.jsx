import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Compass, MapPinned, Wallet, CalendarDays } from 'lucide-react';
import { getTripById } from '../mockStore';
import PlacesExplorer from '../components/PlacesExplorer';
import ExpensesTab from '../components/ExpensesTab';
import ItineraryTab from '../components/ItineraryTab';

const TABS = [
  { key: 'Overview', icon: Compass },
  { key: 'Places', icon: MapPinned },
  { key: 'Expenses', icon: Wallet },
  { key: 'Itinerary', icon: CalendarDays },
];

export default function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    setTrip(getTripById(id));
    setActiveTab('Overview'); // reset tab when switching trips
  }, [id]);

  if (!trip) {
    return (
      <div className="page">
        <button onClick={() => navigate('/dashboard')} className="back-link">
          <ArrowLeft size={15} /> Back to trips
        </button>
        <p>Trip not found.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <button onClick={() => navigate('/dashboard')} className="back-link">
        <ArrowLeft size={15} /> Back to trips
      </button>

      <span className="eyebrow">{trip.destination}</span>
      <h2>{trip.name}</h2>
      <p style={{ marginTop: 6 }}>{trip.dates} · {trip.members.length} members</p>

      <div className="pill-tabs">
        {TABS.map(({ key, icon: Icon }) => (
          <button
            key={key}
            className={activeTab === key ? 'pill-tab active' : 'pill-tab'}
            onClick={() => setActiveTab(key)}
          >
            <Icon size={14} /> {key}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'Overview' && (
          <div>
            <h3 style={{ marginBottom: 14 }}>Members</h3>
            <div className="place-grid">
              {trip.members.map((m) => (
                <div key={m} className="place-tile">
                  <h4>{m}</h4>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'Places' && <PlacesExplorer destination={trip.destination} />}
        {activeTab === 'Expenses' && <ExpensesTab tripId={trip.id} members={trip.members} />}
        {activeTab === 'Itinerary' && <ItineraryTab />}
      </div>
    </div>
  );
}