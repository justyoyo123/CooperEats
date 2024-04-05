import React, {useEffect, useState} from 'react';
import Cart from './Cart';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import { Card, CardContent, Typography, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import './CartPage.css';

  const CartPage = () => {
    const navigate = useNavigate();
    //below is logic taken from checkoutform to dynamically get userid based off who is currently logged in. can maybe wrap in its own function but fine for now
    const [userId, setUserId] = useState(null);
    const [foodDetails, setFoodDetails] = useState({});
    const [cart, setCart] = useState(null);

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
        if (userId) {
            fetchCartByUserId();
        }
    }, [userId]); // Fetch cart when userId changes
    const goToCheckout = () => {
        navigate('/payment'); // Navigate to CheckoutForm
    };

    // // Function to fetch the cart
    // const fetchCartByUserId = async () => {
    //     try {
    //         const response = await axios.get(`http://localhost:8080/api/carts/user/${userId}`);
    //         setCart(response.data);
    //     } catch (error) {
    //         console.error('Failed to fetch cart:', error);
    //     }
    // };

    const fetchCartByUserId = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/api/carts/user/${userId}`);
          setCart(response.data);
    
          // Fetch food details for each item in the cart
          for (const foodId in response.data.products) {
            fetchFoodByFoodId(foodId);
          }
        } catch (error) {
          console.error('Failed to fetch cart:', error);
        }
    };

    const fetchFoodByFoodId = async (foodId) => {
        try {
          const response = await axios.get(`http://localhost:8080/api/foods/${foodId}`);
          // Store both name and price in foodDetails
          setFoodDetails(prev => ({ ...prev, [foodId]: {name: response.data.name, price: response.data.price} }));
        } catch (error) {
          console.error('Failed to fetch food:', error);
        }
    };
    

    const handleRemoveItem = async (foodId) => {
        try {
            // Calculate the price deduction
            const quantityBeingRemoved = cart.products[foodId];

            // Make the API call to remove the item from the cart by setting its quantity to 0
            const response = await axios.post(`http://localhost:8080/api/carts/user/${userId}`, {
                foodId,
                quantity: -quantityBeingRemoved,
            });
            setCart(response.data);

        } catch (error) {
            console.error('Failed to remove item from cart:', error);
        }
    };

    const handleAddItemQuantity = async (foodId) => {
        const updatedProducts = { ...cart.products };
        let curr_quantity;
        if (updatedProducts[foodId] !== undefined) {
            curr_quantity = updatedProducts[foodId]
            updatedProducts[foodId] += 1; // Increment the item quantity by 1

            // Make the API call to update the item quantity in the backend
            try {
                const response = await axios.post(`http://localhost:8080/api/carts/user/${userId}`, {
                    foodId,
                    quantity: updatedProducts[foodId] - curr_quantity,
                });

                const updatedCart = response.data;
                setCart(updatedCart);
            } catch (error) {
                console.error('Failed to add item quantity:', error);
            }
        }
    };

    const handleRemoveItemQuantity = async (foodId) => {
        const updatedProducts = { ...cart.products };
        let curr_quantity;
        if (updatedProducts[foodId] !== undefined && updatedProducts[foodId] > 1) {
            curr_quantity = updatedProducts[foodId]
            updatedProducts[foodId] -= 1; // Decrement the item quantity by 1

            // Make the API call to update the item quantity in the backend
            try {
                const response = await axios.post(`http://localhost:8080/api/carts/user/${userId}`, {
                    foodId,
                    quantity: updatedProducts[foodId] - curr_quantity,
                });
                const updatedCart = response.data;
                setCart(updatedCart);
            } catch (error) {
                console.error('Failed to remove item quantity:', error);
            }
        } else if (updatedProducts[foodId] === 1) {
            // If the quantity is 1, removing one item should remove the product entirely.
            handleRemoveItem(foodId);
        }
    };

    const handleClearCart = async () => {
        if (!userId) return; // Guard clause if userId is not available
        try {
            // DELETE request to clear the cart
            const response = await axios.delete(`http://localhost:8080/api/carts/${userId}`);
            // Update cart state to reflect the cleared cart
            setCart(response.data);
            console.log("Cart cleared");
        } catch (error) {
            console.error('Failed to clear cart:', error);
        }
    };

    if (!cart) {
        return (
            <Typography variant="h4" component="div" style={{ fontWeight: 'bold', textAlign: 'center', marginTop: '20px' }}>
                Your Cart is Empty!
            </Typography>
        );
    }

    return (
        <Card sx={{ maxWidth: 600, margin: '20px auto' }}>
            <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                    Your Shopping Cart
                </Typography>
                {cart.products && Object.keys(cart.products).length === 0 ? (
                    <Typography>Your cart is empty</Typography>
                ) : (
                    <List>
                        {Object.entries(cart.products).map(([foodId, quantity]) => (
                            <ListItem key={foodId} divider>
                                <ListItemText primary={`${foodDetails[foodId]?.name}`} secondary={`Total: $${foodDetails[foodId]?.price * quantity}`} />
                                <ListItemSecondaryAction>
                                    <IconButton aria-label="remove one" onClick={() => handleRemoveItemQuantity(foodId)}>
                                        <RemoveIcon />
                                    </IconButton>
                                    <span>{quantity}</span>
                                    <IconButton aria-label="add one" onClick={() => handleAddItemQuantity(foodId)}>
                                        <AddIcon />
                                    </IconButton>
                                    <IconButton aria-label="delete" onClick={() => handleRemoveItem(foodId, quantity)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                    
                )}
                <Typography variant="h6" component="div" gutterBottom>
                    Total Price: ${cart.totalPrice.toFixed(2)}
                </Typography>
                <Button variant="contained" color="primary" onClick={goToCheckout} sx={{ mt: 2 }}>
                    Proceed to Checkout
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleClearCart} sx={{ mt: 2 }}>
                    Clear Cart
                </Button>
            </CardContent>
        </Card>
    );
  }

export default CartPage;