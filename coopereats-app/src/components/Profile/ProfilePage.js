import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useUser from '../../hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { getAuth, deleteUser as deleteFirebaseUser } from 'firebase/auth';
import './ProfilePage.css';
import MyProfile from './components/MyProfile';

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
    // Password management
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

        // Strip out non-digit characters before checking the length
        const phoneNumberDigits = updatedInfo.phoneNumber.replace(/\D/g, '');

        if (phoneNumberDigits.length !== 10) {
            alert("Invalid phone number. The phone number must be 10 digits long.");
            setError("Invalid phone number. Please ensure it is 10 digits long.");
            return; // Prevent the function from proceeding
        }

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
        const auth = getAuth();
        const firebaseUser = auth.currentUser;

        if (!firebaseUser) {
            console.error("No user is currently logged in.");
            setError("No user is currently logged in.");
            return;
        }

        try {
            const deleteResponse = await axios.delete(`${BACKEND_URL}/${userId}`);
            if (deleteResponse.status === 200) {

                await deleteFirebaseUser(firebaseUser);

                navigate('/login');
            } else {
                console.error(`Failed to delete user from database: Status code ${deleteResponse.status}`);
                setError('Failed to delete user from database.');
            }
        } catch (error) {
            console.error(`Error occurred while attempting to delete user: ${error.message}`);
            setError(error.response?.data?.message || error.message || 'Error occurred while attempting to delete user.');
        }
    };


    return (
        <div className="profile-container">
            <MyProfile
                currentUserInfo={currentUserInfo}
                userId={userId}
                editableFullName={editableFullName}
                setEditableFullName={setEditableFullName}
                editablePhoneNumber={editablePhoneNumber}
                setEditablePhoneNumber={setEditablePhoneNumber}
                editableUserName={editableUserName}
                setEditableUserName={setEditableUserName}
                currentPassword={currentPasswordInput}
                setCurrentPassword={setCurrentPasswordInput}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmNewPassword={confirmNewPassword}
                setConfirmNewPassword={setConfirmNewPassword}
                handleUpdate={handleUpdate}
                handlePasswordUpdate={handlePasswordUpdate}
                handleDeleteUser={handleDeleteUser}
            />

        </div>
    );
};

export default ProfilePage;