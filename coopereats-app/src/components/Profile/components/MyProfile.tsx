import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import IconButton from '@mui/joy/IconButton';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import PhoneIcon from '@mui/icons-material/Phone';
import VisibilitySharpIcon from '@mui/icons-material/VisibilitySharp';
import VisibilityOffSharpIcon from '@mui/icons-material/VisibilityOffSharp';
import HomeIcon from '@mui/icons-material/Home';
import axios, { AxiosError } from 'axios';

import useUser from '../../../hooks/useUser';

import React, { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updatePassword, getAuth, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import {List, ListItem} from "@mui/material";


const BACKEND_URL = "http://localhost:8080/api/users";

interface MyProfileProps {
    currentUserInfo: {
        userName: string;
        phoneNumber: string;
        fullName: string;
        email: string;
        password: string;
    };
    userId: string;
    orderHistory: any[];
    foodNames: Record<string, string>;
    handlePasswordUpdate: (currentPassword: string, newPassword: string) => Promise<void>;
    handleDeleteUser: () => Promise<void>;
}


const MyProfile = ({
    currentUserInfo,
    userId,
    handlePasswordUpdate,
    orderHistory,
    foodNames,
    handleDeleteUser,
}: MyProfileProps) => {
    const [editableFullName, setEditableFullName] = useState(currentUserInfo.fullName);
    const [editablePhoneNumber, setEditablePhoneNumber] = useState(currentUserInfo.phoneNumber);
    const [editableUserName, setEditableUserName] = useState(currentUserInfo.userName);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [error, setError] = useState('');

    const [userInfo, setUserInfo] = useState({
        fullName: currentUserInfo.fullName,
        userName: currentUserInfo.userName,
        phoneNumber: currentUserInfo.phoneNumber,
        email: currentUserInfo.email,
        password: '',
        newPassword: '',
        confirmNewPassword: ''
    });


    const navigate = useNavigate();

    const confirmAndDelete = async () => {
        if (!deleteConfirmation) {
            alert('Please confirm deletion.');
            return;
        }
        if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
            await handleDeleteUser();
            navigate('/');
        }
    };

    const handleGoHome = () => {
        navigate('/');
    };

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedPhoneNumber = formatPhoneNumber(e.target.value);
        setEditablePhoneNumber(formattedPhoneNumber);  // Update the displayed value
        setUserInfo(prevState => ({
            ...prevState,
            phoneNumber: formattedPhoneNumber  // Update the state for form submission or API calls
        }));
    };



    const formatPhoneNumber = (phoneNumber: string): string => {
        phoneNumber = phoneNumber.replace(/\D/g, '');  // Remove all non-numeric characters
        phoneNumber = phoneNumber.substring(0, 10);  // Limit to 10 digits

        const match = phoneNumber.match(/^(\d{1,3})(\d{0,3})(\d{0,4})$/);
        if (match) {
            const [, areaCode, prefix, lineNum] = match;
            return `${areaCode ? '(' + areaCode : ''}${areaCode.length === 3 ? ') ' : ''}${prefix}${prefix.length === 3 ? ' - ' : ''}${lineNum}`;
        }
        return phoneNumber;
    };





    const handleUpdate = async (updateData: {
        fullName: string;
        phoneNumber: string;
        userName: string;
        email: string;
        password: string;
    }) => {
        try {
            const response = await axios.put(`${BACKEND_URL}/${userId}`, updateData);
            if (response.status === 200) {
                alert('Profile updated successfully!');
                setUserInfo(prevState => ({ ...prevState, ...updateData, newPassword: '', confirmNewPassword: '' }));
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(error.message);
                if (axios.isAxiosError(error)) {
                    setError(error.response?.data?.message || 'An error occurred during the update.');
                } else {
                    setError('An error occurred that is not handled by axios');
                }
            } else {
                setError('An unexpected error occurred');
            }
        }
    };


    const updateUserInfoAndPassword = async () => {
        if (newPassword !== confirmNewPassword) {
            console.error("Passwords do not match.");
            setError('Passwords do not match.');
            return;
        }

        setUserInfo(prevState => ({
            ...prevState,
            password: newPassword
        }));

        const updateData = {
            fullName: editableFullName || currentUserInfo.fullName,
            phoneNumber: editablePhoneNumber || currentUserInfo.phoneNumber,
            userName: editableUserName || currentUserInfo.userName,
            email: currentUserInfo.email,
            password: newPassword
        };

        setEditableFullName('');
        setEditablePhoneNumber('');
        setEditableUserName('');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');

        try {
            const response = await axios.put(`${BACKEND_URL}/${userId}`, updateData);
            if (response.status === 200) {
                await handleFirebasePasswordUpdate();
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (error) {
            processError(error);
        }
    };


    const onUpdateInfo = async () => {
        const updateData = {
            fullName: editableFullName || currentUserInfo.fullName,
            phoneNumber: editablePhoneNumber || currentUserInfo.phoneNumber,
            userName: editableUserName || currentUserInfo.userName,
            email: currentUserInfo.email,
            password: userInfo.password
        };

        setEditableFullName('');
        setEditablePhoneNumber('');
        setEditableUserName('');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');

        await handleUpdate(updateData);
    };


    const handleFirebasePasswordUpdate = async () => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            await updatePassword(user, newPassword);
            setError('Profile and password updated successfully.');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setUserInfo(prevState => ({
                ...prevState,
                password: newPassword
            }));
        } else {
            setError('No user logged in.');
        }
    };

    const processError = (error: any) => {
        if (axios.isAxiosError(error)) {
            setError(error.response?.data?.message || 'An error occurred during the update.');
        } else if (error instanceof Error) {
            setError(error.message);
        } else {
            setError('An unexpected error occurred');
        }
    };


    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return (
        <Box sx={{ flex: 1, width: '100%' }}>
            <Stack
                spacing={4}
                sx={{
                    display: 'flex',
                    maxWidth: '800px',
                    mx: 'auto',
                    px: { xs: 2, md: 6 },
                    py: { xs: 2, md: 3 },
                }}
            >
                <Card>
                    <Box sx={{ mb: 1 }}>
                        <Typography level="title-md">Account Info</Typography>
                        <Typography level="body-sm">
                            Edit your personal information.
                        </Typography>
                    </Box>


                    {/* Current Information Display Section */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mb: 2,
                    }}>
                        <Box sx={{
                            p: 2,
                            backgroundColor: 'background.level1',
                            borderRadius: '8px',
                            textAlign: 'left',
                            maxWidth: '480px',
                            width: '100%',
                        }}>
                            <Typography sx={{ mb: 2, fontWeight: 'bold' }}>
                                Personal Information
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Stack spacing={1} sx={{ p: 1, alignItems: 'flex-start', width: 'fit-content' }}>
                                    <Typography><strong>User ID:</strong> {userId}</Typography>
                                    <Typography><strong>Full Name:</strong> {currentUserInfo.fullName}</Typography>
                                    <Typography><strong>Username:</strong> {currentUserInfo.userName}</Typography>
                                    <Typography><strong>Phone Number:</strong> {currentUserInfo.phoneNumber}</Typography>
                                    <Typography><strong>Email:</strong> {currentUserInfo.email}</Typography>
                                </Stack>
                            </Box>
                        </Box>
                    </Box>



                    {/* Personal Info Section */}
                    <Stack direction="row" spacing={2} justifyContent="center" sx={{ flexWrap: 'wrap' }}>
                        {/* Editing Full Name */}
                        <FormControl sx={{ width: '100%', maxWidth: '360px', mb: 2 }}>
                            <FormLabel>Name</FormLabel>
                            <Input
                                size="md"
                                value={editableFullName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditableFullName(e.target.value)}
                            />
                        </FormControl>
                    </Stack>

                    <Stack direction="row" spacing={2} justifyContent="center" sx={{ flexWrap: 'wrap' }}>
                        {/* Editing Username */}
                        <FormControl sx={{ width: '100%', maxWidth: '360px', mb: 2 }}>
                            <FormLabel>Username</FormLabel>
                            <Input
                                size="md"
                                type="text"
                                value={editableUserName}
                                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setEditableUserName(e.target.value)}
                            />
                        </FormControl>
                    </Stack>

                    <Stack direction="row" spacing={4} justifyContent="center">
                        {/* Editing Phone Number */}
                        <FormControl sx={{ width: '100%', maxWidth: '360px' }}>
                            <FormLabel>Phone Number</FormLabel>
                            <Input
                                size="md"
                                type="text"
                                value={editablePhoneNumber}
                                onChange={handlePhoneNumberChange}
                                startDecorator={<PhoneIcon />}
                            />
                        </FormControl>
                    </Stack>


                    <CardActions sx={{ justifyContent: 'center', pt: 2 }}>
                        <Button
                            size="sm"
                            variant="outlined"
                            color="neutral"
                            onClick={onUpdateInfo}
                            sx={{ width: 'auto', maxWidth: 'fit-content' }}
                        >
                            Update
                        </Button>
                    </CardActions>
                </Card>

                {/* Password Section */}
                <Card>
                    <Box sx={{ mb: 1 }}>
                        <Typography level="title-md">Security</Typography>
                        <Typography level="body-sm">
                            Change your password.
                        </Typography>
                    </Box>
                    <Stack
                        spacing={3}
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                        sx={{ px: 2, py: 3 }}
                    >
                        {/* Manage Current Password */}
                        <FormControl sx={{ width: '100%', maxWidth: '360px' }}> {/* Adjust max-width if needed */}
                            <FormLabel htmlFor="current-password">Current Password</FormLabel>
                            <Input
                                id="current-password"
                                size="sm"
                                type={showCurrentPassword ? 'text' : 'password'}
                                value={currentPassword}
                                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setCurrentPassword(e.target.value)}
                                endDecorator={
                                    <IconButton
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                                    >
                                        {showCurrentPassword ? <VisibilityOffSharpIcon /> : <VisibilitySharpIcon />}
                                    </IconButton>
                                }
                            />
                        </FormControl>

                        {/* Manage New Password */}
                        <FormControl sx={{ width: '100%', maxWidth: '360px' }}> {/* Adjust max-width if needed */}
                            <FormLabel htmlFor="new-password">New Password</FormLabel>
                            <Input
                                id="new-password"
                                size="sm"
                                type={showNewPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setNewPassword(e.target.value)}
                                endDecorator={
                                    <IconButton
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        aria-label={showNewPassword ? "Hide password" : "Show password"}
                                    >
                                        {showNewPassword ? <VisibilityOffSharpIcon /> : <VisibilitySharpIcon />}
                                    </IconButton>
                                }
                            />
                        </FormControl>

                        {/* Manage Confirm New Password */}
                        <FormControl sx={{ width: '100%', maxWidth: '360px' }}> {/* Adjust max-width if needed */}
                            <FormLabel htmlFor="confirm-new-password">Confirm New Password</FormLabel>
                            <Input
                                id="confirm-new-password"
                                size="sm"
                                type={showConfirmNewPassword ? 'text' : 'password'}
                                value={confirmNewPassword}
                                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setConfirmNewPassword(e.target.value)}
                                endDecorator={
                                    <IconButton
                                        onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                                        aria-label={showConfirmNewPassword ? "Hide password" : "Show password"}
                                    >
                                        {showConfirmNewPassword ? <VisibilityOffSharpIcon /> : <VisibilitySharpIcon />}
                                    </IconButton>
                                }
                            />
                        </FormControl>
                    </Stack>
                    <CardActions sx={{ justifyContent: 'center', pt: 2 }}>
                        <Button
                            size="sm"
                            variant="outlined"
                            color="neutral"
                            onClick={updateUserInfoAndPassword}
                            sx={{ width: 'auto', maxWidth: 'fit-content' }}
                        >
                            Update
                        </Button>
                    </CardActions>
                </Card>
                {/* Order History Section */}
                <Card>
                    <Box sx={{ mb: 1 }}>
                        <Typography level="title-md">Order History</Typography>
                        <Typography level="body-sm">
                            Review your past orders.
                        </Typography>
                    </Box>
                    <List
                        sx={{
                            maxHeight: '300px',  // Set a maximum height
                            overflowY: 'auto',   // Enable scrolling
                        }}
                    >
                        {orderHistory.map((order, index) => (
                            <ListItem key={index}>
                                <Typography>
                                    <strong>Order Number:</strong> {order.orderId} - <strong>Date:</strong> {
                                    new Date(order.orderDate).toLocaleString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit'
                                    })
                                }
                                    <br/>
                                    <br/>
                                    {Object.entries(order.products).map(([foodId, quantity]) => (
                                        <div key={foodId}>{`${foodNames[foodId] || 'Loading...'}: ${quantity}`}</div>
                                    ))}
                                    {/*<strong>Items:</strong> {order.items.map((item: { name: any; }) => item.name).join(', ')}*/}
                                </Typography>
                            </ListItem>
                        ))}
                    </List>
                </Card>

                {/* Manage Account */}
                <Card>
                    <Box sx={{mb: 1}}>
                        <Typography level="title-md">Manage Account</Typography>
                        <Typography level="body-sm">
                            This action will permanently delete your account and all its data.
                        </Typography>
                    </Box>



                    <Stack spacing={2} sx={{ my: 1, justifyContent: 'center' }}>
                        <label style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                            <input
                                type="checkbox"
                                checked={deleteConfirmation}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeleteConfirmation(e.target.checked)}
                            />
                            I understand that this action cannot be undone.
                        </label>
                    </Stack>



                    {/* Delete User */}
                    <CardActions sx={{ justifyContent: 'center', pt: 2 }}>
                        <Stack direction="row" spacing={2}>
                            <Button
                                size="sm"
                                variant="outlined"
                                color="danger"
                                onClick={confirmAndDelete}
                            >
                                Delete
                            </Button>
                        </Stack>
                    </CardActions>
                </Card>

            </Stack>
        </Box>
    );
}

export default MyProfile;