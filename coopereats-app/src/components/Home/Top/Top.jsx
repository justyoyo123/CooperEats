import React from 'react'
import './Top.css'
import { Link, useNavigate } from 'react-router-dom';


const Top = () => {
    const navigate = useNavigate();
    return (
        <div className='top'>
            <div className="top-contents">
                <h2>Order your favourite food here</h2>
                <p>Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and satisfy your vravings and elevate your dining experience, one delicious meal at a time.</p>
                <button onClick={() => navigate('/food')}>View Menu</button>
            </div>
        </div>
    )
}

export default Top