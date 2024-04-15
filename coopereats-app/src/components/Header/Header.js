import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from "axios";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AdminHeader from './AdminHeader';

function Header() {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user);
      if (user) {
        fetchUserId(user.uid);
      } else {
        setUserId(null);
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserId = async (firebaseUid) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/users/firebase/${firebaseUid}`);
      setUserId(response.data);
      setIsAdmin(response.data.role === 'ADMIN');
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserId(null);
      setIsAdmin(false);
    }
  };

  const handleLogout = () => {
    getAuth().signOut().then(() => navigate('/'));
  };

  if (isAdmin) {
    return <AdminHeader />;
  }

  return (
    <header className="header">
      <Link to="/" className="logo-link">
        <img src="./images/design/cooperlogo.png" alt="Cooper Union Logo" className="logo-image" />
        CooperEats
      </Link>
      <nav className="header-nav">
        <IconButton onClick={() => navigate('/food')}><RestaurantMenuIcon /></IconButton>
        {isAdmin && <Link to="/admin">Admin</Link>}
        {user ? (
          <>
            <IconButton onClick={() => navigate('/cart')}><ShoppingCartIcon /></IconButton>
            <IconButton onClick={() => navigate('/profile')}><AccountCircleIcon /></IconButton>
            <IconButton onClick={handleLogout}><LogoutIcon /></IconButton>
          </>
        ) : (
          <IconButton onClick={() => navigate('/login')}><LoginIcon /></IconButton>
        )}
        <IconButton onClick={() => navigate('/')}><HomeIcon /></IconButton>
      </nav>
    </header>
  );
}

export default Header;
