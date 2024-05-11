import React from 'react'
import './CartPage.css'
import { Link, useNavigate } from 'react-router-dom';


const CartTop = () => {
    const navigate = useNavigate();
    return (
        <div className='cart-top'>
            <div className="cart-top-contents">
                <h2>Your Shopping Cart</h2>
                <button onClick={() => navigate('/food')}>View Menu</button>
            </div>
        </div>
    )
}

export default CartTop