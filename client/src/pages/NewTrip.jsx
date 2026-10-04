import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NewTrip() {
  const [form, setForm] = useState({
    name: '', destination: '', startDate: '', endDate: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.destination) return;

    // TEMP: mock create until backend Trip API is ready
    // Replace later with: await api.post('/trips', form);
    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <h2>Plan a New Trip</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Trip name (e.g. Goa Trip)"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="destination"
          placeholder="Destination (e.g. Goa)"
          value={form.destination}
          onChange={handleChange}
        />
        <label style={{ fontSize: 13, color: '#555' }}>Start date</label>
        <input
          name="startDate"
          type="date"
          value={form.startDate}
          onChange={handleChange}
        />
        <label style={{ fontSize: 13, color: '#555' }}>End date</label>
        <input
          name="endDate"
          type="date"
          value={form.endDate}
          onChange={handleChange}
        />
        <button type="submit">Create Trip</button>
      </form>
    </div>
  );
}