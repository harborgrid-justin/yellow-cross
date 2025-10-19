import React, { useState } from 'react';
import { useAuth } from '../../shared/context/AuthContext';

const ProfilePage: React.FC = () => {
  const { user, updateUser, accessToken } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstName, lastName, email })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      updateUser(data.user);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to change password');
      }

      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordChange(false);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="container">
          <p>Loading user profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1>
            <i className="fas fa-user-circle"></i> User Profile
          </h1>
          <p>Manage your account information and settings</p>
        </div>

        {message && (
          <div className={`alert alert-${message.type}`} role="alert">
            <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
            {message.text}
          </div>
        )}

        {/* Profile Information */}
        <div className="profile-section">
          <div className="section-header">
            <h2>Profile Information</h2>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="btn btn-secondary">
                <i className="fas fa-edit"></i> Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleProfileUpdate} className="profile-form">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Saving...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i> Save Changes
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFirstName(user.firstName || '');
                    setLastName(user.lastName || '');
                    setEmail(user.email || '');
                  }}
                  className="btn btn-outline"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <div className="info-item">
                <label>Username</label>
                <p>{user.username}</p>
              </div>
              <div className="info-item">
                <label>First Name</label>
                <p>{user.firstName || 'Not set'}</p>
              </div>
              <div className="info-item">
                <label>Last Name</label>
                <p>{user.lastName || 'Not set'}</p>
              </div>
              <div className="info-item">
                <label>Email</label>
                <p>{user.email}</p>
              </div>
              <div className="info-item">
                <label>Role</label>
                <p>{user.roles.join(', ')}</p>
              </div>
            </div>
          )}
        </div>

        {/* Password Change */}
        <div className="profile-section">
          <div className="section-header">
            <h2>Security</h2>
            {!showPasswordChange && (
              <button onClick={() => setShowPasswordChange(true)} className="btn btn-secondary">
                <i className="fas fa-key"></i> Change Password
              </button>
            )}
          </div>

          {showPasswordChange && (
            <form onSubmit={handlePasswordChange} className="profile-form">
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <small>Must be at least 8 characters with uppercase, lowercase, digit, and special character</small>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Changing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-key"></i> Change Password
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordChange(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="btn btn-outline"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
