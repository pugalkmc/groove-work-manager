import React, { useState, useEffect } from 'react';
import axiosInstance from '../../config';

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [resetToken, setResetToken] = useState('');

  useEffect(() => {
    // Fetch the user profile data
    const fetchProfile = async () => {
      try {
        const { data } = await axiosInstance.get('/api/user/profile');
        setUser(data);
        setName(data.name);
        setPhoneNumber(data.phoneNumber);
        setBio(data.bio || '');
        setEmail(data.email);  // Keep email non-editable
      } catch (error) {
        console.error('Error fetching profile', error.message);
      }
    };

    fetchProfile();
  }, []);

  const toggleEdit = () => setIsEditing(!isEditing);

  const updateProfile = async () => {
    try {
      await axiosInstance.put('/api/user/profile', { name, phoneNumber, bio });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile', error.message);
    }
  };

  const updatePassword = async () => {
    try {
      await axiosInstance.put('/api/user/password', { oldPassword, newPassword });
    } catch (error) {
      console.error('Error updating password', error.message);
    }
  };

  const forgotPassword = async () => {
    try {
      const { data } = await axiosInstance.post('/api/user/forgot-password', { email });
      setResetToken(data);
    } catch (error) {
      console.error('Error sending reset token', error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">User Profile</h2>

      <div className="card p-4 shadow-lg">
        <div className="row">
          <div className="col-md-6">
            <label><strong>Email (cannot be changed):</strong></label>
            <input
              type="email"
              value={email}
              className="form-control"
              readOnly
            />
          </div>

          <div className="col-md-6">
            <label><strong>Phone Number:</strong></label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="form-control"
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md-6">
            <label><strong>Name:</strong></label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              disabled={!isEditing}
            />
          </div>

          <div className="col-md-6">
            <label><strong>Bio:</strong></label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="form-control"
              disabled={!isEditing}
              rows="3"
            />
          </div>
        </div>

        <div className="text-center mt-4">
          {!isEditing ? (
            <button className="btn btn-primary" onClick={toggleEdit}>Edit Profile</button>
          ) : (
            <>
              <button className="btn btn-success mr-2" onClick={updateProfile}>Save Changes</button>
              <button className="btn btn-secondary" onClick={toggleEdit}>Cancel</button>
            </>
          )}
        </div>
      </div>

      {/* Change Password Section */}
      <div className="card p-4 mt-5 shadow-lg">
        <h4>Change Password</h4>
        <div className="form-group">
          <label>Old Password:</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="form-control"
          />
        </div>
        <button className="btn btn-warning" onClick={updatePassword}>Update Password</button>
      </div>

      {/* Forgot Password Section */}
      <div className="card p-4 mt-5 shadow-lg">
        <h4>Forgot Password</h4>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
          />
        </div>
        <button className="btn btn-danger" onClick={forgotPassword}>Send Reset Token</button>

        {resetToken && (
          <div className="mt-3">
            <p><strong>Message:</strong> {resetToken}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
