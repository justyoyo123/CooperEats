import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import axios from "axios";
import AdminHeader from './AdminHeader';
import { IconButton } from '@mui/joy';
import LogoutIcon from '@mui/icons-material/Logout';

function Header() {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserId = async (firebaseUid) => {
      try {
        const response = await axios.get(`http://localhost:8080/api/users/firebase/${firebaseUid}`, { params: { firebaseUid } });
        setUserId(response.data);
        console.log("Fetched application user ID:", response.data);
      } catch (error) {
        console.error("Error fetching application user ID:", error);
        setUserId(null);
      }
    };

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

  const handleLogout = () => {
    getAuth().signOut().then(() => navigate('/'));
  };

  useEffect(() => {
    const checkAdmin = async () => {
      if (userId) {
        const response = await axios.get(`http://localhost:8080/api/users/${userId}`);
        setIsAdmin(response.data.role === 'ADMIN');
      } else {
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, [userId]);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  if (isAdmin) {
    return <AdminHeader />;
  } else {
    return (
      <header className="header">
        <Link to="/">
          <img src="./images/design/coopereats_bubble.png" alt="CooperEats Logo" />
        </Link>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/food">Food</Link></li>
          <li><Link to="/cart">Cart</Link></li>
          {isAdmin && <li><Link to="/admin">Admin</Link></li>}
          {user ? (
            <>
              <li><Link to="/profile">Profile</Link></li>
              <li>{user.email}</li>
              <li>
                <IconButton aria-label="logout" onClick={handleLogout}>
                  <LogoutIcon />
                </IconButton>
              </li>
            </>
          ) : (
            <li><Link to="/login">Login</Link></li>
          )}
        </ul>
      </header>
    );
  }
}

export default Header;