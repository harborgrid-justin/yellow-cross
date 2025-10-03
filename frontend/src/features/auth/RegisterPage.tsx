import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firmName, setFirmName] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!acceptTerms) {
      setError('Please accept the terms and conditions');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, firmName })
      });

      if (response.ok) {
        navigate('/login');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-box">
          <div className="auth-header">
            <i className="fas fa-balance-scale"></i>
            <h1>Yellow Cross</h1>
            <p>Enterprise Law Firm Practice Management</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <h2>Create Account</h2>

            {error && (
              <div className="alert alert-error" role="alert">
                <i className="fas fa-exclamation-circle"></i>
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">
                <i className="fas fa-user"></i>
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Attorney"
                autoComplete="name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <i className="fas fa-envelope"></i>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="attorney@lawfirm.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="firmName">
                <i className="fas fa-building"></i>
                Law Firm Name
              </label>
              <input
                type="text"
                id="firmName"
                value={firmName}
                onChange={(e) => setFirmName(e.target.value)}
                placeholder="Smith & Associates"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <i className="fas fa-lock"></i>
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                autoComplete="new-password"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                <i className="fas fa-lock"></i>
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                autoComplete="new-password"
                required
              />
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  required
                />
                I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Creating account...
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus"></i> Create Account
                </>
              )}
            </button>

            <div className="auth-footer">
              <p>
                Already have an account? <Link to="/login">Sign in</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
