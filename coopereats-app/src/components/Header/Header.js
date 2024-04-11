import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Tabs, Tab, Box, Button, IconButton, Snackbar } from '@mui/material';
import Badge, { BadgeProps } from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from "axios";
import AdminHeader from './AdminHeader';

function Header() {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false); // State to track if the user is an admin
  const navigate = useNavigate();

  useEffect(() => {
    const handleCartUpdate = () => {
      fetchCartByUserId(); // Assuming this function updates the cart quantity in your header
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

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

  useEffect(() => {
    if (userId) {
      fetchCartByUserId();
      fetchCartQuantity();
    }
  }, [userId]); // Fetch cart when userId changes

  // Function to fetch the cart
  const fetchCartByUserId = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/carts/user/${userId}`);
      setCart(response.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };
  const fetchCartQuantity = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/carts/quantity/user/${userId}`); // Assuming there's an endpoint to directly fetch cart quantity
      setCartQuantity(response.data.quantity);
    } catch (error) {
      console.error('Failed to fetch cart quantity:', error);
      setCartQuantity(0);
    }
  }

  const handleLogout = () => {
    getAuth().signOut().then(() => navigate('/'));
  };

  if (isAdmin) {
    return <AdminHeader />;
  } else {
    return (
      <header className="header">
        <Link to="/" className="logo-link">
          CooperEats
        </Link>
        <div className="header-nav">
          <IconButton onClick={() => navigate('/food')}><RestaurantMenuIcon /></IconButton>
          <IconButton onClick={() => navigate('/cart')}>
            <Badge badgeContent={cartQuantity} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          {user ? (
            <>
              <IconButton onClick={() => navigate('/profile')}><AccountCircleIcon /></IconButton>
              <IconButton aria-label="logout" onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>
            </>
          ) : (
            <IconButton onClick={() => navigate('/login')}><LoginIcon /></IconButton>
          )}
          {isAdmin && <Link to="/admin">Admin</Link>}
        </div>
      </header>
    );
  }
}

export default Header;