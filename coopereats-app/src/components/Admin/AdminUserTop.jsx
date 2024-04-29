import React from 'react'
import './AdminUserPage.css'
import { Link, useNavigate } from 'react-router-dom';


const AdminUserTop = () => {
    const navigate = useNavigate();
    return (
        <div className='adminUser-top'>
            <div className="adminUser-top-contents">
                <h2>Users</h2>
            </div>
        </div>
    )
}

export default AdminUserTop