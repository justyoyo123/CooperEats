import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Typography } from '@mui/material';

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
        <TableContainer component={Paper} sx={{ maxWidth: '90%', margin: 'auto', overflowX: 'auto' }}>
            <Typography variant="h4" gutterBottom component="div" sx={{ padding: 2, textAlign: 'center', color: 'primary.main' }}>
                Orders
            </Typography>
            <Table aria-label="orders table" sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow sx={{ '& th': { fontWeight: 'bold', backgroundColor: 'primary.dark', color: 'common.white' } }}>
                        <TableCell>Order ID</TableCell>
                        <TableCell>User</TableCell>
                        <TableCell>Products</TableCell>
                        <TableCell>Order Date</TableCell>
                        <TableCell>Pickup Time</TableCell>
                        <TableCell>Total Price</TableCell>
                        <TableCell>Payment Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map((order, index) => (
                        <TableRow key={order.orderId} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
                            <TableCell component="th" scope="row">
                                {order.orderId}
                            </TableCell>
                            <TableCell>{order.user ? order.user.email : 'N/A'}</TableCell>
                            <TableCell>
                                {Object.entries(order.products).map(([productName, quantity]) => (
                                    <div key={productName}>{`${productName}: ${quantity}`}</div>
                                ))}
                            </TableCell>
                            <TableCell>{order.orderDate}</TableCell>
                            <TableCell>{order.pickupTime}</TableCell>
                            <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                            <TableCell>{order.paymentStatus}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default AdminOrdersPage;
