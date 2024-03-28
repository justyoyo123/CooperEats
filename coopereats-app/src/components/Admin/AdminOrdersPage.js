import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function AdminOrdersPage() {
    const [foods, setFoods] = useState([]);

    useEffect(() => {
        const fetchFoods = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/orders');
                setFoods(response.data);
            } catch (error) {
                console.error('Error fetching foods:', error);
            }
        };

        fetchFoods();
    }, []);

    return (
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Food ID</TableCell>
                        <TableCell align="right">Name</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Category</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {foods.map((food) => (
                        <TableRow key={food.id}>
                            <TableCell component="th" scope="row">
                                {food.id}
                            </TableCell>
                            <TableCell align="right">{food.name}</TableCell>
                            <TableCell align="right">${food.price}</TableCell>
                            <TableCell align="right">{food.category}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default AdminOrdersPage;
