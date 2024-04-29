import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Typography } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AdminOrderTop from './AdminOrderTop';

function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [foodNames, setFoodNames] = useState({});
    const [fulfilledOrders, setFulfilledOrders] = useState({});
    const [totalSales, setTotalSales] = useState(0);
    const [previousOrders, setPreviousOrders] = useState(new Set());

    const handleFulfillmentChange = async (orderId) => {
        setFulfilledOrders((prevFulfilledOrders) => ({
            ...prevFulfilledOrders,
            [orderId]: !prevFulfilledOrders[orderId],
        }));

        // Call API to update the order status in the backend
        try {
            const response = await axios.put(`http://localhost:8080/api/orders/fulfillOrder/${orderId}`);
            console.log('Order fulfillment status updated', response.data);
        } catch (error) {
            console.error('Failed to update order fulfillment status:', error);
            setFulfilledOrders((prevFulfilledOrders) => ({
                ...prevFulfilledOrders,
                [orderId]: !prevFulfilledOrders[orderId],
            }));
        }
    };
    useEffect(() => {
        const fetchAllFoodNames = async (allFoodIds) => {
            const names = {};
            for (let foodId of allFoodIds) {
                try {
                    const response = await axios.get(`http://localhost:8080/api/foods/${foodId}`);
                    names[foodId] = response.data.name;
                } catch (error) {
                    console.error(`Error fetching food name for ID ${foodId}:`, error);
                    names[foodId] = 'Unknown';
                }
            }
            return names;
        };

        const fetchOrders = async () => {
            try {
                const ordersResponse = await axios.get('http://localhost:8080/api/orders/all');
                const ordersData = ordersResponse.data;

                const currentTotal = ordersData.reduce((acc, order) => acc + order.totalPrice, 0);
                setTotalSales(currentTotal);

                setOrders(ordersData);

                const allFoodIds = new Set();
                ordersData.forEach(order => {
                    Object.keys(order.products).forEach(foodId => allFoodIds.add(foodId));
                });

                const foodNames = await fetchAllFoodNames(allFoodIds);

                const fulfillmentStatuses = {};
                for (const order of ordersData) {
                    fulfillmentStatuses[order.orderId] = order.fullfillmentStatus;
                }

                setFoodNames(foodNames);
                setFulfilledOrders(fulfillmentStatuses);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        fetchOrders();
    }, []);

    return (
        <>
        <AdminOrderTop/>
        <TableContainer component={Paper} sx={{
          maxWidth: '90%', margin: 'auto', overflowX: 'auto',
          boxShadow: '0px 4px 12px rgba(0,0,0,0.15)', borderRadius: '8px', mt: '-30px' 
        }}>
            <Typography variant="h5" gutterBottom component="div" sx={{ textAlign: 'center', mt: 2 }}>
                Total Sales: ${totalSales.toFixed(2)}
            </Typography>
            <Table aria-label="orders table" sx={{ minWidth: 650 }}>
            <TableHead>
                <TableRow sx={{ bgcolor: 'primary.dark' }}>
                    <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Order ID</TableCell>
                    <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Products and Quantity</TableCell>
                    <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Order Date and Time</TableCell>
                    <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Pickup Time</TableCell>
                    <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Total Price</TableCell>
                    <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Payment Status</TableCell>
                    <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Fulfillment Status</TableCell>
                </TableRow>
            </TableHead>
                <TableBody>
                    {orders.map((order, index) => (
                        <TableRow key={order.orderId} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'white' } }}>
                            <TableCell component="th" scope="row" style={{ color: 'white' }}>
                                {order.orderId}
                            </TableCell>
                            <TableCell>
                                {Object.entries(order.products).map(([foodId, quantity]) => (
                                    <div key={foodId}>{`${foodNames[foodId] || 'Loading...'}: ${quantity}`}</div>
                                ))}
                            </TableCell>
                            <TableCell>
                                {new Date(order.orderDate).toLocaleString('en-US', {
                                    year: 'numeric', month: 'long', day: 'numeric',
                                    hour: '2-digit', minute: '2-digit', second: '2-digit'
                                })}
                            </TableCell>
                            <TableCell>
                                {new Date(order.pickupTime).toLocaleString('en-US', {
                                    year: 'numeric', month: 'long', day: 'numeric',
                                    hour: '2-digit', minute: '2-digit', second: '2-digit'
                                })}
                            </TableCell>
                            <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                            <TableCell>{order.paymentStatus}</TableCell>
                            <TableCell>
                                <Checkbox
                                    icon={<CheckCircleOutlineIcon />}
                                    checkedIcon={<CheckCircleIcon />}
                                    checked={!!fulfilledOrders[order.orderId]}
                                    onChange={() => handleFulfillmentChange(order.orderId)}
                                    inputProps={{ 'aria-label': 'Fulfillment status' }}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        </>
    );
}

export default AdminOrdersPage;
