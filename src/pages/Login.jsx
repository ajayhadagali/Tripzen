import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in both fields');
      return;
    }

    // TEMP: mock login until backend is connected.
    // Replace this block later with: const { data } = await api.post('/auth/login', form);
    localStorage.setItem('token', 'mock-token-123');
    localStorage.setItem('user', JSON.stringify({ name: 'Test User', email: form.email }));
    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <h2>Login to SplitStay</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <button type="submit">Login</button>
      </form>
      {error && <p className="error">{error}</p>}
      <p>No account? <Link to="/register">Register</Link></p>
    </div>
  );
}