import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';

/**
 * Example component showing how to use the authentication and profile hooks
 * This is a demonstration component - integrate these patterns into your actual components
 */
export const AuthExample: React.FC = () => {
  const { 
    data: authData, 
    loading: authLoading, 
    error: authError, 
    isAuthenticated, 
    handleLogin, 
    handleRegister, 
    handleLogout, 
    clearError: clearAuthError 
  } = useAuth();

  const { 
    data: profileData, 
    loading: profileLoading, 
    error: profileError, 
    handleGetProfile, 
    handleUpdateProfile, 
    handleUpdatePassword, 
    clearError: clearProfileError 
  } = useProfile();

  // Form states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ 
    nombre: '', 
    apellidos: '', 
    email: '', 
    password: '', 
    phone_number: '' 
  });
  const [profileForm, setProfileForm] = useState({ 
    nombre: '', 
    apellidos: '', 
    phone_number: '' 
  });
  const [passwordForm, setPasswordForm] = useState({ 
    current_password: '', 
    new_password: '' 
  });

  // Handle login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin(loginForm);
  };

  // Handle registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleRegister(registerForm);
  };

  // Handle profile update
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleUpdateProfile(profileForm);
  };

  // Handle password update
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleUpdatePassword(passwordForm);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#e66414', textAlign: 'center' }}>Authentication Example</h1>
      
      {/* Authentication Status */}
      <div style={{ 
        padding: '10px', 
        margin: '10px 0', 
        backgroundColor: isAuthenticated ? '#d4edda' : '#f8d7da',
        border: `1px solid ${isAuthenticated ? '#c3e6cb' : '#f5c6cb'}`,
        borderRadius: '4px'
      }}>
        <strong>Status:</strong> {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
        {authData && (
          <div>
            <strong>User:</strong> {authData.user.nombre} {authData.user.apellidos}
          </div>
        )}
      </div>

      {/* Error Display */}
      {(authError || profileError) && (
        <div style={{ 
          padding: '10px', 
          margin: '10px 0', 
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          color: '#721c24'
        }}>
          <strong>Error:</strong> {authError?.message || profileError?.message}
          <button 
            onClick={() => { clearAuthError(); clearProfileError(); }}
            style={{ marginLeft: '10px', padding: '5px 10px' }}
          >
            Clear
          </button>
        </div>
      )}

      {/* Loading Indicator */}
      {(authLoading || profileLoading) && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ color: '#e66414' }}>Loading...</div>
        </div>
      )}

      {!isAuthenticated ? (
        <div>
          {/* Login Form */}
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ color: '#e66414' }}>Login</h2>
            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom: '10px' }}>
                <label>Email:</label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Password:</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={authLoading}
                style={{ 
                  backgroundColor: '#e66414', 
                  color: 'white', 
                  padding: '10px 20px', 
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: authLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {authLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>

          {/* Registration Form */}
          <div>
            <h2 style={{ color: '#e66414' }}>Register</h2>
            <form onSubmit={handleRegisterSubmit}>
              <div style={{ marginBottom: '10px' }}>
                <label>Nombre:</label>
                <input
                  type="text"
                  value={registerForm.nombre}
                  onChange={(e) => setRegisterForm({ ...registerForm, nombre: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Apellidos:</label>
                <input
                  type="text"
                  value={registerForm.apellidos}
                  onChange={(e) => setRegisterForm({ ...registerForm, apellidos: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Email:</label>
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Password:</label>
                <input
                  type="password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Phone Number:</label>
                <input
                  type="tel"
                  value={registerForm.phone_number}
                  onChange={(e) => setRegisterForm({ ...registerForm, phone_number: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={authLoading}
                style={{ 
                  backgroundColor: '#e66414', 
                  color: 'white', 
                  padding: '10px 20px', 
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: authLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {authLoading ? 'Registering...' : 'Register'}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div>
          {/* Profile Display */}
          {profileData && (
            <div style={{ marginBottom: '30px' }}>
              <h2 style={{ color: '#e66414' }}>Profile</h2>
              <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                <p><strong>ID:</strong> {profileData.id}</p>
                <p><strong>Nombre:</strong> {profileData.nombre}</p>
                <p><strong>Apellidos:</strong> {profileData.apellidos}</p>
                <p><strong>Email:</strong> {profileData.email}</p>
                <p><strong>Phone:</strong> {profileData.phone_number}</p>
                <p><strong>Created:</strong> {new Date(profileData.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          )}

          {/* Profile Update Form */}
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ color: '#e66414' }}>Update Profile</h2>
            <form onSubmit={handleProfileSubmit}>
              <div style={{ marginBottom: '10px' }}>
                <label>Nombre:</label>
                <input
                  type="text"
                  value={profileForm.nombre}
                  onChange={(e) => setProfileForm({ ...profileForm, nombre: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  placeholder={profileData?.nombre || ''}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Apellidos:</label>
                <input
                  type="text"
                  value={profileForm.apellidos}
                  onChange={(e) => setProfileForm({ ...profileForm, apellidos: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  placeholder={profileData?.apellidos || ''}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Phone Number:</label>
                <input
                  type="tel"
                  value={profileForm.phone_number}
                  onChange={(e) => setProfileForm({ ...profileForm, phone_number: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  placeholder={profileData?.phone_number || ''}
                />
              </div>
              <button 
                type="submit" 
                disabled={profileLoading}
                style={{ 
                  backgroundColor: '#e66414', 
                  color: 'white', 
                  padding: '10px 20px', 
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: profileLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {profileLoading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>

          {/* Password Update Form */}
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ color: '#e66414' }}>Update Password</h2>
            <form onSubmit={handlePasswordSubmit}>
              <div style={{ marginBottom: '10px' }}>
                <label>Current Password:</label>
                <input
                  type="password"
                  value={passwordForm.current_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>New Password:</label>
                <input
                  type="password"
                  value={passwordForm.new_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={profileLoading}
                style={{ 
                  backgroundColor: '#e66414', 
                  color: 'white', 
                  padding: '10px 20px', 
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: profileLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {profileLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

          {/* Logout Button */}
          <div style={{ textAlign: 'center' }}>
            <button 
              onClick={handleLogout}
              disabled={authLoading}
              style={{ 
                backgroundColor: '#dc3545', 
                color: 'white', 
                padding: '10px 20px', 
                border: 'none', 
                borderRadius: '4px',
                cursor: authLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {authLoading ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
