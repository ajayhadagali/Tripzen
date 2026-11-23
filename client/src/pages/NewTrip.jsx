import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function NewTrip() {
  const [form, setForm] = useState({
    name: '', destination: '', startDate: '', endDate: '', members: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...form, [name]: value };
    // If the start date moves past the chosen end date, clear the end date
    if (name === 'startDate' && next.endDate && value > next.endDate) next.endDate = '';
    setForm(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.destination.trim()) {
      setError('Trip name and destination are required');
      return;
    }
    if ((form.startDate && !form.endDate) || (!form.startDate && form.endDate)) {
      setError('Enter both a start date and an end date, or leave both empty');
      return;
    }
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      setError('End date cannot be before the start date');
      return;
    }
    setError('');
    setLoading(true);

    const memberList = form.members.split(',').map((m) => m.trim()).filter(Boolean);
    const hasDates = form.startDate && form.endDate;

    try {
      await api.post('/trips', {
        name: form.name.trim(),
        destination: form.destination.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
        dates: hasDates ? `${form.startDate} to ${form.endDate}` : 'Dates TBD',
        members: memberList.length ? memberList : ['You'],
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create the trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-side" style={{ minHeight: '100vh' }}>
      <div className="auth-box">
        <span className="eyebrow">New trip</span>
        <h2>Plan a new trip</h2>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Trip name</label>
            <input name="name" placeholder="e.g. Goa Trip" value={form.name} onChange={handleChange} />
          </div>
          <div className="field">
            <label>Destination</label>
            <input name="destination" placeholder="e.g. Panaji" value={form.destination} onChange={handleChange} />
          </div>
          <div className="field">
            <label>Start date</label>
            <input name="startDate" type="date" value={form.startDate}
              max={form.endDate || undefined} onChange={handleChange} />
          </div>
          <div className="field">
            <label>End date</label>
            <input name="endDate" type="date" value={form.endDate}
              min={form.startDate || undefined} onChange={handleChange} />
          </div>
          <div className="field">
            <label>Members (comma-separated)</label>
            <input name="members" placeholder="Alice, Bob, Carol" value={form.members} onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating...' : 'Create trip'}
          </button>
        </form>
        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  );
}