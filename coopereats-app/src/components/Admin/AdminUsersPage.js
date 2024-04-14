import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Typography
} from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";

function AdminUsersPage() {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };


    useEffect(() => {
        fetchUsers();
    }, []);

    const deleteUser = async (userId) => {
        try {
            await axios.delete(`http://localhost:8080/api/users/${userId}`);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <TableContainer component={Paper} elevation={0} sx={{ maxWidth: '90%', margin: 'auto', overflowX: 'auto', elevation: 0, border: 'none'}}>
            <Typography variant="h4" gutterBottom component="div" sx={{ padding: 2, textAlign: 'center', color: 'black' }}>
                Users
            </Typography>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow sx={{ '& th': { fontWeight: 'bold', backgroundColor: 'primary.dark', color: 'common.white' } }}>
                        <TableCell>User ID</TableCell>
                        <TableCell align="right">Name</TableCell>
                        <TableCell align="right">Email</TableCell>
                        <TableCell align="right">Role</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.userId}>
                            <TableCell component="th" scope="row" style={{ color: 'white' }}>
                                {user.userId}
                            </TableCell>
                            <TableCell align="right">{user.name}</TableCell>
                            <TableCell align="right">{user.email}</TableCell>
                            <TableCell align="right">{user.role}</TableCell>
                            <TableCell align="right">
                                <IconButton onClick={() => deleteUser(user.userId)}>
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default AdminUsersPage;
