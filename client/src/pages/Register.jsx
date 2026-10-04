import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError('All fields are required');
      return;
    }
    localStorage.setItem('token', 'mock-token-123');
    localStorage.setItem('user', JSON.stringify({ name: form.name, email: form.email }));
    navigate('/dashboard');
  };

  return (
    <div className="auth-wrap">
      <div className="auth-form-side">
        <div className="auth-box">
          <span className="eyebrow">Tripzen</span>
          <h2>Start your next trip</h2>
          <p className="sub">Create an account to plan with your travel group.</p>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Name</label>
              <input name="name" placeholder="Your name" value={form.name} onChange={handleChange} />
            </div>
            <div className="field">
              <label>Email</label>
              <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
            </div>
            <div className="field">
              <label>Password</label>
              <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} />
            </div>
            <button type="submit" className="btn btn-primary btn-block">Create account</button>
          </form>
          {error && <p className="error-text">{error}</p>}
          <p className="switch-line">Already have an account? <Link to="/login">Log in</Link></p>
        </div>
      </div>

      <div className="auth-scene">
        <div className="sun" />
        <div className="horizon-line" />
        <div className="scene-copy">
          <MapPin color="white" size={28} />
          <h3 style={{ marginTop: 14 }}>"Wherever you're headed, plan it together."</h3>
          <p>Hotels, attractions, and shared expenses — all in one itinerary.</p>
        </div>
      </div>
    </div>
  );
}