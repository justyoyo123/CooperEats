import React from 'react'
import './AdminFoodPage.css'
import { Link, useNavigate } from 'react-router-dom';


const AdminDashTop = () => {
    const navigate = useNavigate();
    return (
        <div className='adminDash-top'>
            <div className="adminDash-top-contents">
                <h2>Admin Dashboard</h2>
            </div>
        </div>
    )
}

export default AdminDashTop