import * as React from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import IconButton from '@mui/joy/IconButton';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab, { tabClasses } from '@mui/joy/Tab';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardOverflow from '@mui/joy/CardOverflow';
import { ChangeEvent } from 'react';

import PhoneIcon from '@mui/icons-material/Phone';
import VisibilitySharpIcon from '@mui/icons-material/VisibilitySharp';
import VisibilityOffSharpIcon from '@mui/icons-material/VisibilityOffSharp';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';


interface MyProfileProps {
    currentUserInfo: {
        userName: string;
        phoneNumber: string;
        fullName: string;
        email: string;
        password: string;
    };
    userId: string;
    editableFullName: string;
    setEditableFullName: React.Dispatch<React.SetStateAction<string>>;
    editablePhoneNumber: string;
    setEditablePhoneNumber: React.Dispatch<React.SetStateAction<string>>;
    editableUserName: string;
    setEditableUserName: React.Dispatch<React.SetStateAction<string>>;
    currentPassword: string;
    setCurrentPassword: React.Dispatch<React.SetStateAction<string>>;
    newPassword: string;
    setNewPassword: React.Dispatch<React.SetStateAction<string>>;
    confirmNewPassword: string;
    setConfirmNewPassword: React.Dispatch<React.SetStateAction<string>>;
    handlePasswordUpdate: () => Promise<void>;
    handleUpdate: () => Promise<void>;
    handleDeleteUser: () => Promise<void>;
}



export default function MyProfile({
    currentUserInfo,
    userId,
    editableFullName,
    setEditableFullName,
    editablePhoneNumber,
    setEditablePhoneNumber,
    editableUserName,
    setEditableUserName,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    handleUpdate,
    handlePasswordUpdate,
    handleDeleteUser,
}: MyProfileProps) {

    const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
    const [showNewPassword, setShowNewPassword] = React.useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = React.useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = React.useState(false);

    const navigate = useNavigate();

    const confirmAndDelete = () => {
        if (!deleteConfirmation) {
            alert('Please confirm the deletion by checking the box.');
            return;
        }
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            handleDeleteUser();
            navigate('/');
        }
    };


    // Handle home navigation
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
                                onChange={(e) => setEditableFullName(e.target.value)}
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
                                onChange={(e) => setEditableUserName(e.target.value)}
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
                                onChange={(e) => setCurrentPassword(e.target.value)}
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
                                onChange={(e) => setNewPassword(e.target.value)}
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
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
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
                            sx={{ width: 'auto', maxWidth: 'fit-content' }}
                        >
                            Update
                        </Button>
                    </CardActions>
                </Card>




                <Card>
                    <Box sx={{ mb: 1 }}>
                        <Typography level="title-md">Wallet</Typography>
                        <Typography level="body-sm">
                            Some Description about Payment Method.
                        </Typography>
                    </Box>
                    <Stack spacing={2} sx={{ my: 1 }}>
                    </Stack>
                    <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                        <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
                            <Button
                                size="sm"
                                variant="outlined"
                                color="neutral">
                                Update
                            </Button>
                        </CardActions>
                    </CardOverflow>
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
                                onChange={(e) => setDeleteConfirmation(e.target.checked)}
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

