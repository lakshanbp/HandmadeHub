import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { registerUser } from '../services/api';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Password validation functions
  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
    };
  };

  const getPasswordStrength = (password: string) => {
    const validation = validatePassword(password);
    const validCount = Object.values(validation).filter(Boolean).length - 1; // -1 for isValid
    
    if (validCount <= 2) return { text: 'Weak', color: '#d32f2f' };
    if (validCount <= 3) return { text: 'Fair', color: '#f57c00' };
    if (validCount <= 4) return { text: 'Good', color: '#1976d2' };
    return { text: 'Strong', color: '#388e3c' };
  };

  const passwordValidation = validatePassword(password);
  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Password validation
    if (!passwordValidation.isValid) {
      setError('Password must meet all requirements: minimum 8 characters, uppercase, lowercase, number, and special character.');
      return;
    }
    
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    
    setLoading(true);
    try {
      const res = await registerUser({ name, email, password, role });
      setIsSuccess(true);
    } catch (e: any) {
      console.error('Registration error:', e);
      // Extract error message from API response
      const errorMessage = e.response?.data?.error || 'An error occurred. Please try again later.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 400, margin: '60px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 32 }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: 24 }}>Register</h2>
        {error && (
          <div style={{ 
            color: '#d32f2f', 
            background: '#ffebee', 
            padding: '12px', 
            borderRadius: '6px', 
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
        {isSuccess ? (
          <div style={{ textAlign: 'center', color: '#2e7d32', background: '#e8f5e9', padding: '16px', borderRadius: '8px' }}>
            <h3 style={{ marginTop: 0 }}>Registration Successful!</h3>
            <p>You can now <a href="/login" style={{ fontWeight: 600, color: '#1b5e20' }}>log in</a> to your account.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }}
              />
            </div>
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
              
              {/* Password Strength Indicator */}
              {password && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: '12px', color: '#666' }}>Strength:</span>
                    <span style={{ 
                      fontSize: '12px', 
                      fontWeight: 'bold', 
                      color: passwordStrength.color 
                    }}>
                      {passwordStrength.text}
                    </span>
                  </div>
                  
                  {/* Password Requirements */}
                  <div style={{ fontSize: '11px', color: '#666' }}>
                    <div style={{ 
                      color: passwordValidation.minLength ? '#388e3c' : '#d32f2f',
                      marginBottom: 2
                    }}>
                      ✓ Minimum 8 characters
                    </div>
                    <div style={{ 
                      color: passwordValidation.hasUpperCase ? '#388e3c' : '#d32f2f',
                      marginBottom: 2
                    }}>
                      ✓ At least one uppercase letter
                    </div>
                    <div style={{ 
                      color: passwordValidation.hasLowerCase ? '#388e3c' : '#d32f2f',
                      marginBottom: 2
                    }}>
                      ✓ At least one lowercase letter
                    </div>
                    <div style={{ 
                      color: passwordValidation.hasNumbers ? '#388e3c' : '#d32f2f',
                      marginBottom: 2
                    }}>
                      ✓ At least one number
                    </div>
                    <div style={{ 
                      color: passwordValidation.hasSpecialChar ? '#388e3c' : '#d32f2f'
                    }}>
                      ✓ At least one special character (!@#$%^&*)
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div style={{ marginBottom: 18 }}>
              <label>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                  style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4, paddingRight: 36 }}
                />
                <span
                  onClick={() => setShowConfirm(v => !v)}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#888' }}
                  tabIndex={0}
                  role="button"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? FaEyeSlash({ size: 18 }) : FaEye({ size: 18 })}
                </span>
              </div>
            </div>
            <div style={{ marginBottom: 18 }}>
              <label>Register as:</label>
              <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="customer"
                    checked={role === 'customer'}
                    onChange={() => setRole('customer')}
                  />
                  Customer
                </label>
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="artisan"
                    checked={role === 'artisan'}
                    onChange={() => setRole('artisan')}
                  />
                  Artisan
                </label>
              </div>
            </div>
            <button type="submit" style={{ background: '#222', color: '#fff', border: 'none', borderRadius: 24, padding: '12px 32px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', width: '100%' }}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        )}
        <div style={{ marginTop: 18, textAlign: 'center' }}>
          Already have an account? <a href="/login" style={{ color: '#b48a3a', textDecoration: 'underline' }}>Login</a>
        </div>
      </div>
    </>
  );
};

export default RegisterPage; 