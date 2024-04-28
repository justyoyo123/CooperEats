import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Typography } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [foodNames, setFoodNames] = useState({});
    const [fulfilledOrders, setFulfilledOrders] = useState({});
    const [totalSales, setTotalSales] = useState(0);

    const handleFulfillmentChange = async (orderId) => {
        setFulfilledOrders((prevFulfilledOrders) => ({
            ...prevFulfilledOrders,
            [orderId]: !prevFulfilledOrders[orderId],
        }));

        // Call API to update the order status in the backend
        try {
            const response = await axios.put(`http://app:8080/api/orders/fulfillOrder/${orderId}`);
            // You might want to do something with the response here, or check the status code to confirm the update was successful
            console.log('Order fulfillment status updated', response.data);
        } catch (error) {
            console.error('Failed to update order fulfillment status:', error);
            // Optionally revert the state if the API call failed
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
                    const response = await axios.get(`http://app:8080/api/foods/${foodId}`);
                    names[foodId] = response.data.name; // Store the name using foodId as the key
                } catch (error) {
                    console.error(`Error fetching food name for ID ${foodId}:`, error);
                    names[foodId] = 'Unknown'; // Use a placeholder in case of error
                }
            }
            return names;
        };

        const fetchOrders = async () => {
            const savedTotalSales = localStorage.getItem('totalSales');
            if (savedTotalSales) {
                setTotalSales(parseFloat(savedTotalSales));
            }
            try {
                const ordersResponse = await axios.get('http://app:8080/api/orders/all');
                const ordersData = ordersResponse.data;

                const currentTotal = ordersData.reduce((acc, order) => acc + order.totalPrice, 0);
                setOrders(ordersData);

                // Extract all unique foodIds from all orders
                const allFoodIds = new Set();
                ordersData.forEach(order => {
                    Object.keys(order.products).forEach(foodId => {
                        allFoodIds.add(foodId);
                    });
                });

                // Fetch food names for all unique foodIds
                const foodNames = await fetchAllFoodNames(allFoodIds);

                const fulfillmentStatuses = {};
                for (const order of ordersData) {
                    fulfillmentStatuses[order.orderId] = order.fullfillmentStatus;
                }
                const updatedTotalSales = savedTotalSales ? parseFloat(savedTotalSales) + currentTotal : currentTotal;
                setTotalSales(updatedTotalSales);
                localStorage.setItem('totalSales', updatedTotalSales.toString());
                // Update the state with orders, food names, and fulfillment statuses
                setOrders(ordersData);
                setFoodNames(foodNames);
                setFulfilledOrders(fulfillmentStatuses);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    return (
        <TableContainer component={Paper} elevation={0} sx={{ maxWidth: '90%', margin: 'auto', overflowX: 'auto', border: 'none' }}>
            <Typography variant="h4" gutterBottom component="div" sx={{ padding: 2, textAlign: 'center', color: 'black' }}>
                Orders
            </Typography>
            <Typography variant="h5" gutterBottom component="div" sx={{ textAlign: 'center', mt: 2 }}>
                Total Sales: ${totalSales.toFixed(2)}
            </Typography>
            <Table aria-label="orders table" sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow sx={{ '& th': { fontWeight: 'bold', backgroundColor: 'primary.dark', color: 'common.white' } }}>
                        <TableCell>Order ID</TableCell>
                        {/*<TableCell>User</TableCell>*/}
                        <TableCell>Products and Quantity</TableCell>
                        <TableCell>Order Date and Time</TableCell>
                        <TableCell>Pickup Time</TableCell>
                        <TableCell>Total Price</TableCell>
                        <TableCell>Payment Status</TableCell>
                        <TableCell>Fulfillment Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map((order, index) => (
                        <TableRow key={order.orderId} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'white' } }}>
                            <TableCell component="th" scope="row" style={{ color: 'white' }}>
                                {order.orderId}
                            </TableCell>
                            {/*<TableCell>{order.user ? order.user.email : 'N/A'}</TableCell>*/}
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
    );
}

export default AdminOrdersPage;
