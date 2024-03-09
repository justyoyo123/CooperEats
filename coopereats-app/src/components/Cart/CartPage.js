import React from 'react';
import Cart from './Cart';

const userId = 1; // Placeholder user ID, EDIT after firebase is configured

const CartPage = () => {
  return (
    <div>
      <h1>Your Shopping Cart</h1>
      <Cart userId={userId} />
      {/* You can add more content or layout around the Cart component here */}
    </div>
  );
};                                   

export default CartPage;
