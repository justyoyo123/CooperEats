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
  const [cartQuantity, setCartQuantity] = useState([]);
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
        // Fetch the application-specific userId using the Firebase UID
        fetchUserId(user.uid);
      } else {
        // User is signed out
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkAdmin = async () => {
      if (userId) { // Only check if we have a userId
        const response = await axios.get(`http://localhost:8080/api/users/${userId}`);
        setIsAdmin(response.data.role === 'ADMIN');
      } else {
        setIsAdmin(false); // Reset admin status if no user
      }
    };

    checkAdmin();
  }, [userId]); // Trigger the effect when userId changes

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
      const response = await axios.get(`http://localhost:8080/api/carts/user/${userId}`);
      if (response.data && response.data.products) {
        // Object.values() is used to get an array of quantities from the products object
        const totalQuantity = Object.values(response.data.products).reduce((total, qty) => total + qty, 0);
        setCartQuantity(totalQuantity);
      } else {
        setCartQuantity(0);
      }
    } catch (error) {
      console.error('Failed to fetch cart quantity:', error);
      setCartQuantity(0);
    }
  }  

  // Here, we decide which header to render based on isAdmin state
  if (isAdmin) {
    return <AdminHeader/>;
  } else {
    return (
        <header className="header">
          <Link to="/">
            <img src="./images/design/coopereats_bubble.png" alt="CooperEats Logo" />
          </Link>
          <ul>
            <li>
              <IconButton onClick={() => navigate('/food')}><RestaurantMenuIcon /></IconButton>
            </li>
            {isAdmin && (
                <li><Link to="/admin">Admin</Link></li> // Admin link, only visible to admins
            )}
            {user ? (
                <>
                  <li>
                    <IconButton onClick={() => navigate('/cart')}>
                      {/* <Badge badgeContent={cartQuantity} color="secondary">
                        <ShoppingCartIcon color="action" />
                      </Badge> */}
                      <ShoppingCartIcon />
                    </IconButton>
                  </li>
                  <li>
                    <IconButton onClick={() => navigate('/profile')}><AccountCircleIcon /></IconButton>
                    {/* <Link to="/profile">Profile</Link> */}
                  </li>
                  <li>
                    <IconButton onClick={() => getAuth().signOut().then(() => navigate('/'))}><LogoutIcon /></IconButton>
                  </li>
                </>
            ) : (
                <li><IconButton onClick = {() => navigate('/login')}><LoginIcon /></IconButton></li>
                // <li><Link to="/login">Login</Link></li>
            )}
          </ul>
        </header>
    );
  }
}

export default Header;


