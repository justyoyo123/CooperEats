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


import useUser from '../../../hooks/useUser';

import React, { ChangeEvent, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { updatePassword, getAuth, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';


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
    handlePasswordUpdate: (currentPassword: string, newPassword: string) => Promise<void>;
    handleDeleteUser: () => Promise<void>;
}


const MyProfile = ({
    currentUserInfo,
    userId,
    handlePasswordUpdate,
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

    const navigate = useNavigate();

    // Function definitions
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

    const formatPhoneNumber = (value: string): string => {
        if (!value) return value;

        const phoneNumber = value.replace(/[^\d]/g, '');
        const match = phoneNumber.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);

        if (match) {
            const intlCode = match[1] ? '+1 ' : '';
            return [intlCode, '(', match[2], ') - ', match[3], ' - ', match[4]].join('');
        }

        return value;
    };

    const handlePhoneNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputNumbers = e.target.value.replace(/[^\d]/g, '');
        const formattedPhoneNumber = formatPhoneNumber(inputNumbers);
        setEditablePhoneNumber(formattedPhoneNumber);
    };


    const handleUpdate = async (updatedInfo: {
        fullName: string;
        phoneNumber: string;
        userName: string;
        email: string;
        password: string;
    }) => {
        try {
            const response = await axios.put(`${BACKEND_URL}/${userId}`, updatedInfo);
            if (response.status === 200) {
                alert('Profile updated successfully!');
                // Update local state or perform other actions on success
            } else {
                throw new Error(`Failed to update profile: ${response.statusText}`);
            }
        } catch (error: any) {
            setError(error.response?.data?.message || 'An error occurred during the update.');
            alert(error.message);
        }
    };

    const updateUserInfoAndPassword = async () => {
        if (newPassword !== confirmNewPassword) {
            setError('Passwords do not match.');
            return;
        }

        const updateData = {
            fullName: editableFullName || currentUserInfo.fullName,
            phoneNumber: editablePhoneNumber || currentUserInfo.phoneNumber,
            userName: editableUserName || currentUserInfo.userName,
            email: currentUserInfo.email,  // Email is assumed to be unchanged
            password: newPassword  // New password from input
        };

        try {
            // Update user info in your backend
            const response = await axios.put(`${BACKEND_URL}/${userId}`, updateData);
            if (response.status === 200) {
                // If backend update is successful, update password in Firebase
                const auth = getAuth();
                const user = auth.currentUser;
                if (user) {
                    await updatePassword(user, newPassword);
                    setError('Profile and password updated successfully.');
                    setNewPassword('');
                    setConfirmNewPassword('');
                    setCurrentPassword('');
                } else {
                    setError('No user logged in.');
                }
            } else {
                throw new Error(`Failed to update profile: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Update failed:', error);
        }
    };

    const onUpdateInfo = async () => {
        const updateData = {
            fullName: editableFullName || currentUserInfo.fullName,  // Use edited name or fallback to current
            phoneNumber: editablePhoneNumber || currentUserInfo.phoneNumber,  // Use edited phone or fallback to current
            userName: editableUserName || currentUserInfo.userName,  // Use edited username or fallback to current
            email: currentUserInfo.email,  // Assuming email is not editable in this form
            password: currentUserInfo.password  // Assuming password changes are handled separately
        };

        console.log("Updating with info:", updateData);
        await handleUpdate(updateData);
    };




    return (
        <Box sx={{ flex: 1, width: '100%' }}>
            <Box
                sx={{
                    position: 'sticky',
                    top: { sm: -100, md: -110 },
                    bgcolor: 'background.body',
                    zIndex: 9995,
                }}
            >
                <Box
                    component="header"
                    sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 3,
                        px: 2,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {/* Logo Image */}
                        <Box
                            component="img"
                            src="/images/design/TheCooperUnion_logo.png"
                            alt="CooperEats Logo"
                            sx={{ width: 'auto', height: 50 }}
                        />
                        <Typography level="h3">CooperEats</Typography>
                    </Box>
                    {/* Home Icon Button */}
                    <IconButton
                        aria-label="home"
                        onClick={handleGoHome}
                    >
                        <HomeIcon />
                    </IconButton>
                </Box>
            </Box>
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
                <Card sx={{ textAlign: 'center' }}> {/* Add text alignment to the Card */}
                    <Box sx={{ mb: 1 }}>
                        <Typography level="title-md">Security</Typography>
                        <Typography level="body-sm">
                            Change your password.
                        </Typography>
                    </Box>
                    <Stack
                        spacing={3}
                        direction="column"
                        alignItems="center" // Align stack items to the center
                        justifyContent="center" // Center the stack along the cross axis
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


                {/* Manage Account */}
                <Card>
                    <Box sx={{ mb: 1 }}>
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