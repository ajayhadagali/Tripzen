import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Compass,
  MapPinned,
  Wallet,
  CalendarDays,
  Pencil,
  Plus,
  X,
  Check,
} from 'lucide-react';
import api from '../api';
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
  const [loading, setLoading] = useState(true);

  // Member editing state
  const [isEditingMembers, setIsEditingMembers] = useState(false);
  const [draftMembers, setDraftMembers] = useState([]);
  const [newMember, setNewMember] = useState('');
  const [savingMembers, setSavingMembers] = useState(false);
  const [memberError, setMemberError] = useState('');

  useEffect(() => {
    setLoading(true);
    setActiveTab('Overview');
    setIsEditingMembers(false);
    api.get(`/trips/${id}`)
      .then(({ data }) => setTrip({ ...data, id: data._id }))
      .catch(() => setTrip(null))
      .finally(() => setLoading(false));
  }, [id]);

  const startEditingMembers = () => {
    setDraftMembers([...trip.members]);
    setNewMember('');
    setMemberError('');
    setIsEditingMembers(true);
  };

  const cancelEditingMembers = () => {
    setIsEditingMembers(false);
    setNewMember('');
    setMemberError('');
  };

  const handleAddMember = () => {
    const trimmed = newMember.trim();
    if (!trimmed) return;
    if (draftMembers.some((m) => m.toLowerCase() === trimmed.toLowerCase())) {
      setMemberError('Member already exists.');
      return;
    }
    setDraftMembers([...draftMembers, trimmed]);
    setNewMember('');
    setMemberError('');
  };

  const handleRemoveMember = (memberToRemove) => {
    if (draftMembers.length <= 1) {
      setMemberError('A trip must have at least one member.');
      return;
    }
    setDraftMembers(draftMembers.filter((m) => m !== memberToRemove));
    setMemberError('');
  };

  const handleSaveMembers = async () => {
    const pending = newMember.trim();
    const finalMembers =
      pending && !draftMembers.some((m) => m.toLowerCase() === pending.toLowerCase())
        ? [...draftMembers, pending]
        : draftMembers;

    setSavingMembers(true);
    setMemberError('');
    try {
      const { data } = await api.put(`/trips/${trip.id}/members`, {
        members: finalMembers,
      });
      setTrip({ ...data, id: data._id });
      setNewMember('');
      setIsEditingMembers(false);
    } catch (err) {
      console.error('Save members failed:', err.response || err);
      setMemberError(err.response?.data?.message || 'Failed to update members');
    } finally {
      setSavingMembers(false);
    }
  };

  const backButton = (
    <button onClick={() => navigate('/dashboard')} className="back-link">
      <ArrowLeft size={15} /> Back to trips
    </button>
  );

  if (loading) return <div className="page">{backButton}<p>Loading trip...</p></div>;
  if (!trip) return <div className="page">{backButton}<p>Trip not found.</p></div>;

  return (
    <div className="page">
      {backButton}

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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h3 style={{ margin: 0 }}>Members</h3>
              {!isEditingMembers && (
                <button onClick={startEditingMembers} className="pill-tab">
                  <Pencil size={13} /> Edit
                </button>
              )}
            </div>

            {!isEditingMembers ? (
              <div className="place-grid">
                {trip.members.map((m) => (
                  <div key={m} className="place-tile">
                    <h4>{m}</h4>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <input
                    type="text"
                    value={newMember}
                    onChange={(e) => setNewMember(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddMember();
                      }
                    }}
                    placeholder="Add member name..."
                    style={{ flex: 1 }}
                  />
                  <button type="button" onClick={handleAddMember} className="pill-tab">
                    <Plus size={14} /> Add
                  </button>
                </div>

                {memberError && (
                  <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 10 }}>
                    {memberError}
                  </p>
                )}

                <div className="place-grid" style={{ marginBottom: 16 }}>
                  {draftMembers.map((m) => (
                    <div
                      key={m}
                      className="place-tile"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                    >
                      <h4 style={{ margin: 0 }}>{m}</h4>
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(m)}
                        aria-label={`Remove ${m}`}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'inherit',
                          padding: 4,
                        }}
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    onClick={handleSaveMembers}
                    disabled={savingMembers}
                    className="pill-tab active"
                  >
                    <Check size={14} /> {savingMembers ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEditingMembers}
                    disabled={savingMembers}
                    className="pill-tab"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === 'Places' && <PlacesExplorer destination={trip.destination} />}
        {activeTab === 'Expenses' && <ExpensesTab tripId={trip.id} members={trip.members} />}
        {activeTab === 'Itinerary' && <ItineraryTab tripId={trip.id} />}
      </div>
    </div>
  );
}