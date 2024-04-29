import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import './AdminHeader.css';
import { getAuth } from 'firebase/auth';

function AdminHeader() {
    const navigate = useNavigate();
    return (
        <AppBar position="static" elevation={0} style={{ backgroundColor: '#323232' }}>
            <Toolbar>
                <Typography variant="h6" style={{ marginRight: 'auto' }}>
                <Link to="/admin/menu" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <img src="./images/design/TheCooperUnion_logo.png" alt="CooperEats Admin Logo" style={{ maxWidth: "120px", height: "auto" }} />
                </Link>
                </Typography>
                <Button color="inherit" component={Link} to="/admin/menu">Dashboard</Button>
                <Button color="inherit" component={Link} to="/admin/users">Users</Button>
                <Button color="inherit" component={Link} to="/admin/orders">Orders</Button>
                <Button color="inherit" onClick={() => {
                    getAuth().signOut().then(() => navigate('/')); // Logout and redirect to '/'
                }}>Logout</Button>
            </Toolbar>
        </AppBar>
    );
}

export default AdminHeader;