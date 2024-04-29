import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, updatePassword, deleteUser as deleteFirebaseUser } from 'firebase/auth';
import './ProfilePage.css';
import MyProfile from './components/MyProfile';
import useUser from '../../hooks/useUser';

const ProfilePage = () => {
  const [currentUserInfo, setCurrentUserInfo] = useState({
    userName: '',
    phoneNumber: '',
    fullName: '',
    email: '',
    password: '',
  });
  const [orderHistory, setOrderHistory] = useState([]);
  const [currentuserId, setUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState('');
  const [editablePhoneNumber, setEditablePhoneNumber] = useState('');
  const [editableFullName, setEditableFullName] = useState('');
  const [error, setError] = useState('');
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [foodNames, setFoodNames] = useState({});

  const { user, userId, isLoading } = useUser();
  const navigate = useNavigate();
  const BACKEND_URL = "http://20.88.180.242:8080/api/users";
  // const ORDER_HISTORY_URL = `http://20.88.180.242:8080/api/foods/user/${userId}`;

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);


  const fetchUserId = async (firebaseUid) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/firebase/${firebaseUid}`, { params: { firebaseUid } });
      setUserId(response.data);
      fetchUserDetailsById(response.data);
    } catch (error) {
      console.error("Error fetching application user ID:", error);
      setUserId(null);
    }
  };

  const fetchUserDetailsById = async (id) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/${id}`);
      setCurrentUserInfo(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching user details.');
    }
  };

  useEffect(() => {
    if (!userId) return;
    const fetchAllFoodNames = async (allFoodIds) => {
      const names = {};
      for (let foodId of allFoodIds) {
        try {
          const response = await axios.get(`http://20.88.180.242:8080/api/foods/${foodId}`);
          names[foodId] = response.data.name; // Store the name using foodId as the key
        } catch (error) {
          console.error(`Error fetching food name for ID ${foodId}:`, error);
          names[foodId] = 'Unknown'; // Use a placeholder in case of error
        }
      }
      return names;
    };

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://20.88.180.242:8080/api/orders/user/${userId}`);
        const order = response.data;
        const allFoodIds = new Set();
        order.forEach(order => {
          Object.keys(order.products).forEach(foodId => {
            allFoodIds.add(foodId);
          });
        });
        const foodNames = await fetchAllFoodNames(allFoodIds);
        setOrderHistory(response.data);
        setFoodNames(foodNames);
      } catch (error) {
        console.error("Error fetching order history:", error);
        setError(error.response?.data?.message || 'Error fetching order history.');
      }
    };

    fetchOrders();
  }, [userId]);

  const handleUpdate = async () => {
    console.log("Called from ProfilePage - handleUpdate with editable values:", {
      userName: editableUserName,
      phoneNumber: editablePhoneNumber,
      fullName: editableFullName,
    });

    console.log("Current user info state before update:", currentUserInfo);

    const updatedInfo = {
      email: currentUserInfo.email,  // Assuming email is not edited in the form
      userName: editableUserName || currentUserInfo.userName,
      phoneNumber: editablePhoneNumber || currentUserInfo.phoneNumber,
      fullName: editableFullName || currentUserInfo.fullName,
      password: currentUserInfo.password  // Assuming password changes are handled separately
    };

    console.log("Updated Info being sent to the server:", updatedInfo);

    try {
      const response = await axios.put(`${BACKEND_URL}/${userId}`, updatedInfo);
      console.log("Server response:", response);

      if (response.status === 200) {
        setCurrentUserInfo(updatedInfo);  // This will sync the ProfilePage state with the latest updates
        setError('Profile updated successfully.');
      } else {
        setError(`Failed to update profile: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Update failed:", error);
      setError(error.message || 'Error updating profile.');
    }
  };

  const handlePasswordUpdate = async (currentPassword, newPassword) => {
    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match.');
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      setError("No user is currently logged in.");
      return;
    }

    try {
      await updatePassword(user, newPassword);
      setError('Password updated successfully.');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      setError(error.message || 'Error updating password.');
    }
  };



  const handleDeleteUser = async () => {
    const auth = getAuth();
    const firebaseUser = auth.currentUser;

    if (!firebaseUser) {
      setError("No user is currently logged in.");
      return;
    }

    try {
      const deleteResponse = await axios.delete(`${BACKEND_URL}/${userId}`);
      if (deleteResponse.status === 200) {
        await deleteFirebaseUser(firebaseUser);
        navigate('/login');
      } else {
        setError('Failed to delete user from database.');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error occurred while attempting to delete user.');
    }
  };

  return (
      <div className="profile-container">
        <MyProfile
            currentUserInfo={currentUserInfo}
            userId={userId}
            orderHistory={orderHistory}
            foodNames={foodNames}
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
