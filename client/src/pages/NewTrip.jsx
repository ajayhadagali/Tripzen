import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addTrip } from '../mockStore';

export default function NewTrip() {
  const [form, setForm] = useState({
    name: '', destination: '', startDate: '', endDate: '', members: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.destination) return;

    const memberList = form.members
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean);

    addTrip({
      name: form.name,
      destination: form.destination,
      dates: form.startDate && form.endDate ? `${form.startDate} to ${form.endDate}` : 'Dates TBD',
      members: memberList.length ? memberList : ['You'],
    });

    navigate('/dashboard');
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
            <input name="destination" placeholder="e.g. Goa" value={form.destination} onChange={handleChange} />
          </div>
          <div className="field">
            <label>Start date</label>
            <input name="startDate" type="date" value={form.startDate} onChange={handleChange} />
          </div>
          <div className="field">
            <label>End date</label>
            <input name="endDate" type="date" value={form.endDate} onChange={handleChange} />
          </div>
          <div className="field">
            <label>Members (comma-separated)</label>
            <input name="members" placeholder="Alice, Bob, Carol" value={form.members} onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-primary btn-block">Create trip</button>
        </form>
      </div>
    </div>
  );
}