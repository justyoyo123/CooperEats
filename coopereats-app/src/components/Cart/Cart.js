// import React, { useState, useEffect } from 'react';
// import { Card, CardContent, Typography, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';
// import axios from 'axios';
// import {getAuth, onAuthStateChanged} from "firebase/auth";
//
// const Cart = ({userId}) => {
//   const [cart, setCart] = useState(null);
//
//   // Function to fetch the cart
//   const fetchCartByUserId = async () => {
//     try {
//       const response = await axios.get(`/api/carts/user/${userId}`);
//       setCart(response.data);
//     } catch (error) {
//       console.error('Failed to fetch cart:', error);
//     }
//   };
//
//   // Function to update the cart (e.g., removing an item by setting its quantity to 0)
//   // const handleRemoveItem = async (foodId) => {
//   //   try {
//   //     const response = await axios.post(`/api/carts/user/${userId}`, {
//   //       foodId,
//   //       quantity: 0, // Assuming setting quantity to 0 removes the item
//   //       totalPrice: 0
//   //     });
//   //     setCart(response.data); // Update cart in state with the response
//   //   } catch (error) {
//   //     console.error('Failed to update cart:', error);
//   //   }
//   // };
//   const handleRemoveItem = async (foodId) => {
//     try {
//       // Fetch the food item's details to get its price
//       const foodResponse = await axios.get(`/api/foods/${foodId}`);
//       const price = foodResponse.data.price;
//
//       // Calculate the price deduction
//       const quantityBeingRemoved = cart.products[foodId];
//       const priceDeduction = price * quantityBeingRemoved;
//       console.log("priceDeduction", priceDeduction);
//       // Optimistically update the totalPrice on the frontend
//       const updatedTotalPrice = Math.max(0, cart.totalPrice - priceDeduction);
//       console.log("updatedTotalPrice", updatedTotalPrice);
//       // Prepare the updated products map without the removed item
//       const updatedProducts = Object.fromEntries(
//           Object.entries(cart.products).filter(([key]) => key !== foodId.toString())
//       );
//
//       // Optimistically update the cart state
//       setCart((prevCart) => ({
//         ...prevCart,
//         totalPrice: updatedTotalPrice,
//         products: updatedProducts,
//       }));
//
//       // Make the API call to remove the item from the cart by setting its quantity to 0
//       // Note: Ensure your backend logic appropriately updates the totalPrice when items are removed
//       await axios.post(`/api/carts/user/${userId}`, {
//         foodId,
//         quantity: 0,
//         totalPrice: updatedTotalPrice,
//         products: updatedProducts,
//       });
//
//     } catch (error) {
//       console.error('Failed to remove item from cart:', error);
//       // Handle the error appropriately (e.g., revert optimistic update, show error message)
//     }
//   };
//
//   useEffect(() => {
//     fetchCartByUserId();
//   }, [userId]); // Fetch cart when userId changes
//
//   if (!cart) {
//     return <div>Loading cart...</div>;
//   }
//   return (
//       <Card sx={{ maxWidth: 600, margin: '20px auto' }}>
//         <CardContent>
//           <Typography variant="h5" component="div" gutterBottom>
//             Your Shopping Cart
//           </Typography>
//           {cart.products && Object.keys(cart.products).length === 0 ? (
//               <Typography>Your cart is empty</Typography>
//           ) : (
//               <List>
//                 {Object.entries(cart.products).map(([foodId, quantity]) => (
//                     <ListItem key={foodId} divider>
//                       <ListItemText primary={`Food ID: ${foodId}`} secondary={`Quantity: ${quantity}`} />
//                       <ListItemSecondaryAction>
//                         <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveItem(foodId)}>
//                           <DeleteIcon />
//                         </IconButton>
//                       </ListItemSecondaryAction>
//                     </ListItem>
//                 ))}
//               </List>
//           )}
//           <Typography variant="h6" component="div">
//             Total Price: ${cart.totalPrice}
//           </Typography>
//         </CardContent>
//       </Card>
//   );
//   // return (
//   //   <div>
//   //     <h2>Your Cart</h2>
//   //     {cart.products && Object.entries(cart.products).length === 0 ? (
//   //       <p>Your cart is empty</p>
//   //     ) : (
//   //       <ul>
//   //         {Object.entries(cart.products).map(([foodId, quantity]) => (
//   //           <li key={foodId}>
//   //             Food ID: {foodId}, Quantity: {quantity}
//   //             <button onClick={() => handleRemoveItem(foodId)}>Remove</button>
//   //           </li>
//   //         ))}
//   //       </ul>
//   //     )}
//   //     <div>Total Price: ${cart.totalPrice}</div>
//   //   </div>
//   // );
// };
//
// export default Cart;