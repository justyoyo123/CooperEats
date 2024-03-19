import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useUser from '../../hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { getAuth, deleteUser } from 'firebase/auth';
import './ProfilePage.css';

const ProfilePage = () => {
  const [currentUserInfo, setCurrentUserInfo] = useState({
    userName: '',
    phoneNumber: '',
    fullName: '',
    email: '',
    password: '',
  });
  const [editableUserName, setEditableUserName] = useState('');
  const [editablePhoneNumber, setEditablePhoneNumber] = useState('');
  const [editableFullName, setEditableFullName] = useState('');
  const [error, setError] = useState('');
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const { userId } = useUser();
  const navigate = useNavigate();
  const BACKEND_URL = "http://localhost:8080/api/users";

  useEffect(() => {
    if (userId) {
      fetchUserDetailsById(userId);
    } else {
      setError('User is not logged in.');
    }
  }, [userId]);

  const fetchUserDetailsById = async (id) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/${id}`);
      if (response.status === 200) {
        setCurrentUserInfo(response.data);
      } else {
        setError('Failed to fetch user details.');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching user details.');
    }
  };

  const handleUpdate = async () => {
    const updatedInfo = {
      email: currentUserInfo.email,
      password: currentUserInfo.password,
      userName: editableUserName || currentUserInfo.userName,
      phoneNumber: editablePhoneNumber || currentUserInfo.phoneNumber,
      fullName: editableFullName || currentUserInfo.fullName,
    };

    try {
      const response = await axios.put(`${BACKEND_URL}/${userId}`, updatedInfo);
      if (response.status === 200) {
        setCurrentUserInfo({
          ...currentUserInfo,
          ...updatedInfo
        });
        setError('Profile updated successfully.');
        setEditableUserName('');
        setEditablePhoneNumber('');
        setEditableFullName('');
      } else {
        setError('Failed to update profile.');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating profile.');
    }
  };

  const handlePasswordUpdate = async () => {
    if (currentPasswordInput !== currentUserInfo.password) {
      setError('Current password is incorrect.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match.');
      return;
    }

    try {
      const response = await axios.put(`${BACKEND_URL}/${userId}`, {
        ...currentUserInfo,
        password: newPassword
      });
      if (response.status === 200) {
        setError('Password updated successfully.');
        setCurrentUserInfo({ ...currentUserInfo, password: newPassword });
        setCurrentPasswordInput('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        setError('Failed to update password.');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating password.');
    }
  };

   const handleDeleteUser = async () => {
      try {
        // Delete user from your backend database
        const response = await axios.delete(`${BACKEND_URL}/${userId}`);
        if (response.status === 200) {
          // If successful, proceed to delete the user from Firebase
          const auth = getAuth();
          const user = auth.currentUser;

          deleteUser(user).then(() => {
            setError('User deleted successfully.');
            navigate('/login');
          }).catch((error) => {
            setError(error.message);
          });
        } else {
          setError('Failed to delete user from database.');
        }
      } catch (error) {
        setError(error.response?.data?.message || 'Error deleting user.');
      }
    };

    return (
      <div className="profile-container">
        <h1>Profile</h1>
        {error && <p className="error">{error}</p>}

        {/* Section for displaying personal info */}
        <div className="personal-info-section">
          <h2>Personal Info</h2>
          <div className="profile-info">
            <p><strong>User ID:</strong> {userId}</p>
            <p><strong>Email:</strong> {currentUserInfo.email}</p>
            <p><strong>Full Name:</strong> {currentUserInfo.fullName}</p>
            <p><strong>Phone Number:</strong> {currentUserInfo.phoneNumber}</p>
            <p><strong>Username:</strong> {currentUserInfo.userName}</p>
          </div>
        </div>

        {/* Section for updating personal info */}
        <div className="update-info-section">
          <h2>Update Personal Info</h2>
          <div className="profile-edit">
            <div className="input-group">
              <input
                type="text"
                value={editableFullName}
                onChange={(e) => setEditableFullName(e.target.value)}
                placeholder="Update Full Name"
              />
            </div>
            <div className="input-group">
              <input
                type="tel"
                value={editablePhoneNumber}
                onChange={(e) => setEditablePhoneNumber(e.target.value)}
                placeholder="Update Phone Number"
              />
            </div>
            <div className="input-group">
              <input
                type="text"
                value={editableUserName}
                onChange={(e) => setEditableUserName(e.target.value)}
                placeholder="Update Username"
              />
            </div>
            <div className="input-group">
              <button onClick={handleUpdate}>Update</button>
            </div>
          </div>
        </div>

        {/* Section for updating the password */}
        <div className="update-password-section">
          <h2>Update Password</h2>
          <div className="password-edit">
            <div className="input-group">
              <input
                type="password"
                value={currentPasswordInput}
                onChange={(e) => setCurrentPasswordInput(e.target.value)}
                placeholder="Current Password"
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Confirm New Password"
              />
            </div>
            <div className="input-group">
              <button onClick={handlePasswordUpdate}>Update Password</button>
            </div>
          </div>
        </div>

        {/* New Section for deleting the user */}
        <div className="delete-user-section">
          <h2>Delete User</h2>
          <p>This action will permanently delete your account and all its data.</p>
          <button onClick={handleDeleteUser} className="delete-user-button">Delete User</button>
        </div>
      </div>
    );
  };

  export default ProfilePage;