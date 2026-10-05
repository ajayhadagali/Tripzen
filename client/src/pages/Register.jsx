import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, User, Mail, Lock } from 'lucide-react';
import TravelScene from '../components/TravelScene';

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
              <div className="input-icon-wrap">
                <User size={16} />
                <input name="name" placeholder="Your name" value={form.name} onChange={handleChange} />
              </div>
            </div>
            <div className="field">
              <label>Email</label>
              <div className="input-icon-wrap">
                <Mail size={16} />
                <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
              </div>
            </div>
            <div className="field">
              <label>Password</label>
              <div className="input-icon-wrap">
                <Lock size={16} />
                <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block">Create account</button>
          </form>
          {error && <p className="error-text">{error}</p>}
          <p className="switch-line">Already have an account? <Link to="/login">Log in</Link></p>
        </div>
      </div>

      <TravelScene
        icon={MapPin}
        quote="Wherever you're headed, plan it together."
        subtext="Hotels, attractions, and shared expenses — all in one itinerary."
      />
    </div>
  );
}