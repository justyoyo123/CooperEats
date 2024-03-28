import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/orders/all');
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    return (
        <TableContainer component={Paper}>
            <Typography variant="h4" gutterBottom component="div" sx={{ padding: 2 }}>
                Orders
            </Typography>
            <Table aria-label="orders table">
                <TableHead>
                    <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell align="right">User</TableCell>
                        <TableCell align="right">Order Date</TableCell>
                        <TableCell align="right">Pickup Time</TableCell>
                        <TableCell align="right">Total Price</TableCell>
                        <TableCell align="right">Payment Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.orderId}>
                            <TableCell component="th" scope="row">
                                {order.orderId}
                            </TableCell>
                            <TableCell align="right">{order.user ? order.user.email : 'N/A'}</TableCell>
                            <TableCell align="right">{order.orderDate}</TableCell>
                            <TableCell align="right">{order.pickupTime}</TableCell>
                            <TableCell align="right">${order.totalPrice}</TableCell>
                            <TableCell align="right">{order.paymentStatus}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default AdminOrdersPage;
