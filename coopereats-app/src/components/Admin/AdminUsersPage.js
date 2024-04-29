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
import AdminUserTop from './AdminUserTop';

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
        <>
        <AdminUserTop/>
        <TableContainer component={Paper} sx={{
          maxWidth: '90%', margin: 'auto', overflowX: 'auto',
          boxShadow: '0px 4px 12px rgba(0,0,0,0.15)', borderRadius: '8px', mt: '-40px' 
        }}>
          <Table aria-label="customized user table">
            <TableHead>
              <TableRow sx={{
                '& th': {
                  fontWeight: 'bold',
                  backgroundColor: '#333',
                  color: 'common.white',
                  padding: '16px'
                }
              }}>
                <TableCell>User ID</TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Email</TableCell>
                <TableCell align="right">Role</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.userId} hover sx={{
                  transition: 'background-color 0.2s',
                  '&:hover': { backgroundColor: 'action.hover' }
                }}>
                  <TableCell component="th" scope="row" sx={{ backgroundColor: '#333', color: 'white', padding: '16px', fontSize: '1rem', borderRadius: '5px' }}>
                    {user.userId}
                  </TableCell>
                  <TableCell align="right" sx={{ color: 'text.secondary' }}>{user.name}</TableCell>
                  <TableCell align="right" sx={{ color: 'text.secondary' }}>{user.email}</TableCell>
                  <TableCell align="right" sx={{ color: 'blue', fontWeight: 'medium' }}>
                    {user.role}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => deleteUser(user.userId)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </>
      );
      
}

export default AdminUsersPage;
