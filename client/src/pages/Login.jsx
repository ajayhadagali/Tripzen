import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in both fields');
      return;
    }
    localStorage.setItem('token', 'mock-token-123');
    localStorage.setItem('user', JSON.stringify({ name: 'Test User', email: form.email }));
    navigate('/dashboard');
  };

  return (
    <div className="auth-wrap">
      <div className="auth-form-side">
        <div className="auth-box">
          <span className="eyebrow">Tripzen</span>
          <h2>Welcome back</h2>
          <p className="sub">Plan trips, split costs, discover places — all in one place.</p>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Email</label>
              <input name="email" type="email" placeholder="you@example.com"
                value={form.email} onChange={handleChange} />
            </div>
            <div className="field">
              <label>Password</label>
              <input name="password" type="password" placeholder="••••••••"
                value={form.password} onChange={handleChange} />
            </div>
            <button type="submit" className="btn btn-primary btn-block">Log in</button>
          </form>
          {error && <p className="error-text">{error}</p>}
          <p className="switch-line">New here? <Link to="/register">Create an account</Link></p>
        </div>
      </div>

      <div className="auth-scene">
        <div className="sun" />
        <div className="horizon-line" />
        <div className="scene-copy">
          <Compass color="white" size={28} />
          <h3 style={{ marginTop: 14 }}>"The best trips are the ones everyone actually agreed on."</h3>
          <p>Itineraries, hotels, and who-owes-who — sorted before you even land.</p>
        </div>
      </div>
    </div>
  );
}