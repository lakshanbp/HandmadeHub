import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import Navbar from '../components/Navbar';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      localStorage.setItem('token', res.data.token);
      // Optionally store user info: localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/'); // Redirect to home or dashboard
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 400, margin: '60px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 32 }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: 24 }}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }}
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4, paddingRight: 36 }}
              />
              <span
                onClick={() => setShowPassword(v => !v)}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#888' }}
                tabIndex={0}
                role="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? FaEyeSlash({ size: 18 }) : FaEye({ size: 18 })}
              </span>
            </div>
          </div>
          <div style={{ marginBottom: 18, textAlign: 'right' }}>
            <span
              style={{ color: '#b48a3a', textDecoration: 'underline', fontSize: '0.97rem', cursor: 'pointer' }}
              onClick={() => navigate('/forgot-password')}
            >
              Forgot Password?
            </span>
          </div>
          {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
          <button type="submit" style={{ background: '#222', color: '#fff', border: 'none', borderRadius: 24, padding: '12px 32px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', width: '100%' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div style={{ marginTop: 18, textAlign: 'center' }}>
          Don't have an account? <a href="/register" style={{ color: '#b48a3a', textDecoration: 'underline' }}>Register</a>
        </div>
      </div>
    </>
  );
};

export default LoginPage; 