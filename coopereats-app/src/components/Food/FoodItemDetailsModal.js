import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {getAuth, onAuthStateChanged} from "firebase/auth";
import { Tabs, Tab, Box, Button, IconButton, Snackbar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
// import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const FoodItemDetailsModal = ({ show, onHide, foodName, details, foodId }) => {
  const [userId, setUserId] = useState(null);
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({[foodId]: 1});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchUserId = async (firebaseUid) => {
      try {
        const response = await axios.get(`http://app:8080/api/users/firebase/${firebaseUid}`, { params: { firebaseUid } });
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
    if (userId) {
      fetchCartByUserId();
    }
  }, [userId]); // Fetch cart when userId changes

  // Function to fetch the cart
  const fetchCartByUserId = async () => {
    try {
      const response = await axios.get(`http://app:8080/api/carts/user/${userId}`);
      setCart(response.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };
  // Function to increment quantity
  // const incrementQuantity = (foodId) => {
  //   setQuantities(prev => ({ ...prev, [foodId]: (prev[foodId] || 0) + 1 }));
  // };

  const incrementQuantity = async (foodId) => {
    try {
      const stockResponse = await axios.get(`http://app:8080/api/foods/${foodId}`);
      const availableQuantity = stockResponse.data.quantity;

      setQuantities(prev => {
        const currentQuantity = prev[foodId] || 0;

        if (currentQuantity + 1 > availableQuantity) {
          console.error('Cannot add more items than available in stock');
          alert('You cannot add more of this item, as it exceeds the available stock.');
          return { ...prev }; // Return the previous state without changes
        } else {
          return { ...prev, [foodId]: currentQuantity + 1 };
        }
      });
    } catch (error) {
      console.error('Failed to fetch available stock:', error);
    }
  };

  // Function to decrement quantity
  const decrementQuantity = (foodId) => {
    setQuantities(prev => ({ ...prev, [foodId]: Math.max(1, (prev[foodId] || 1) - 1) }));
  };
  const handleAddToCart = async (foodId) => {
    if (!userId) {
        setSnackbarMessage('Please log in to add items to the cart.');
        setSnackbarOpen(true);
    } else {
        try {
            const quantity = quantities[foodId] || 1;
            const response = await axios.post(`http://app:8080/api/carts/user/${userId}`, {
                foodId,
                quantity: quantity,
            });
            setCart(response.data);
            setSnackbarMessage('Item added to cart!');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Failed to add item to cart:', error);
        }
    }
  }
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Modal
      show={show} // Use the show prop here
      onHide={onHide} // Use the onHide prop here
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>{foodName}</h4>
        <p>
          Description: {details.description}<br />
          Ingredients: {details.ingredients}<br />
          Allergens: {details.allergens}
        </p>
        <div>
          <IconButton onClick={()=>decrementQuantity(foodId)}><RemoveIcon /></IconButton>
          <span>{quantities[foodId]}</span>
          <IconButton onClick={()=>incrementQuantity(foodId)}><AddIcon /></IconButton>
          <Button onClick={() => handleAddToCart(foodId)} startIcon={<AddShoppingCartIcon />}>Add to Cart</Button>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button> {/* Use the onHide prop here */}
      </Modal.Footer>
      <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            message={snackbarMessage}
      />
    </Modal>
  );
};

export default FoodItemDetailsModal;
