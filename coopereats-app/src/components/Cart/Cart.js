import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Cart = ({ userId }) => {
  const [cart, setCart] = useState(null);

  // Function to fetch the cart
  const fetchCartByUserId = async () => {
    try {
      const response = await axios.get(`/api/carts/user/${userId}`);
      setCart(response.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  // Function to update the cart (e.g., removing an item by setting its quantity to 0)
  const handleRemoveItem = async (foodId) => {
    try {
      const response = await axios.post(`/api/carts/user/${userId}`, {
        foodId,
        quantity: 0 // Assuming setting quantity to 0 removes the item
      });
      setCart(response.data); // Update cart in state with the response
    } catch (error) {
      console.error('Failed to update cart:', error);
    }
  };

  useEffect(() => {
    fetchCartByUserId();
  }, [userId]); // Fetch cart when userId changes

  if (!cart) {
    return <div>Loading cart...</div>;
  }

  return (
    <div>
      <h2>Your Cart</h2>
      {cart.products && Object.entries(cart.products).length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <ul>
          {Object.entries(cart.products).map(([foodId, quantity]) => (
            <li key={foodId}>
              Food ID: {foodId}, Quantity: {quantity}
              <button onClick={() => handleRemoveItem(foodId)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <div>Total Price: ${cart.totalPrice}</div>
    </div>
  );
};

export default Cart;