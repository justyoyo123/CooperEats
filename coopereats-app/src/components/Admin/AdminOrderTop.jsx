import React from 'react'
import './AdminOrderPage.css'
import { Link, useNavigate } from 'react-router-dom';


const AdminOrderTop = () => {
    const navigate = useNavigate();
    return (
        <div className='adminOrder-top'>
            <div className="adminOrder-top-contents">
                <h2>Orders</h2>
            </div>
        </div>
    )
}

export default AdminOrderTop