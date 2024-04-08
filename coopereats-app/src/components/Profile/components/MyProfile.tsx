import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import DeleteButton from '@mui/material/Button';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import FormHelperText from '@mui/joy/FormHelperText';
import Input from '@mui/joy/Input';
import IconButton from '@mui/joy/IconButton';
import Textarea from '@mui/joy/Textarea';
import Stack from '@mui/joy/Stack';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Typography from '@mui/joy/Typography';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab, { tabClasses } from '@mui/joy/Tab';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardOverflow from '@mui/joy/CardOverflow';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import AccessTimeFilledRoundedIcon from '@mui/icons-material/AccessTimeFilledRounded';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import PhoneIcon from '@mui/icons-material/Phone';
import VisibilitySharpIcon from '@mui/icons-material/VisibilitySharp';
import VisibilityOffSharpIcon from '@mui/icons-material/VisibilityOffSharp';
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useNavigate } from 'react-router-dom';



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
                <Box sx={{ px: { xs: 2, md: 6 } }}>
                    <Breadcrumbs
                        size="sm"
                        aria-label="breadcrumbs"
                        separator={<ChevronRightRoundedIcon fontSize="small" />}
                        sx={{ pl: 0 }}
                    >
                        <Link
                            underline="none"
                            color="neutral"
                            href="#some-link"
                            aria-label="Home"
                        >
                            <HomeRoundedIcon />
                        </Link>
                        <Typography color="primary" fontWeight={500} fontSize={12}>
                            My profile
                        </Typography>
                    </Breadcrumbs>
                    <Typography level="h2" component="h1" sx={{ mt: 1, mb: 2 }}>
                        My profile
                    </Typography>
                </Box>
                <Tabs
                    defaultValue={0}
                    sx={{
                        bgcolor: 'transparent',
                    }}
                >
                    <TabList
                        tabFlex={1}
                        size="sm"
                        sx={{
                            pl: { xs: 0, md: 4 },
                            justifyContent: 'left',
                            [`&& .${tabClasses.root}`]: {
                                fontWeight: '600',
                                flex: 'initial',
                                color: 'text.tertiary',
                                [`&.${tabClasses.selected}`]: {
                                    bgcolor: 'transparent',
                                    color: 'text.primary',
                                    '&::after': {
                                        height: '2px',
                                        bgcolor: 'primary.500',
                                    },
                                },
                            },
                        }}
                    >
                        <Tab sx={{ borderRadius: '6px 6px 0 0' }} indicatorInset value={0}>
                            Account Info
                        </Tab>
                        <Tab sx={{ borderRadius: '6px 6px 0 0' }} indicatorInset value={2}>
                            Security
                        </Tab>
                        <Tab sx={{ borderRadius: '6px 6px 0 0' }} indicatorInset value={3}>
                            Wallet
                        </Tab>
                        <Tab sx={{ borderRadius: '6px 6px 0 0' }} indicatorInset value={4}>
                            Manage Account
                        </Tab>
                    </TabList>
                </Tabs>
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
                    <Box sx={{ p: 2, backgroundColor: 'background.level1', borderRadius: '8px', mb: 2 }}>
                        <Typography component="div" sx={{ mb: 2, fontWeight: 'bold' }}>
                            Current Information
                        </Typography>
                        <Typography><strong>User ID:</strong> {userId}</Typography> {/* Correctly display userId here */}
                        <Typography><strong>Full Name:</strong> {currentUserInfo.fullName}</Typography>
                        <Typography><strong>Username:</strong> {currentUserInfo.userName}</Typography>
                        <Typography><strong>Phone Number:</strong> {currentUserInfo.phoneNumber}</Typography>
                        <Typography><strong>Email:</strong> {currentUserInfo.email}</Typography>
                    </Box>

                    {/* Personal Info Section */}
                    <Stack direction="row" spacing={2}>
                        {/* Editing Full Name */}
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input
                                size="sm"
                                value={editableFullName}
                                onChange={(e) => setEditableFullName(e.target.value)}
                            />
                        </FormControl>

                        {/* Editing Username */}
                        <FormControl sx={{ flexGrow: 1 }}>
                            <FormLabel>Username</FormLabel>
                            <Input
                                size="sm"
                                type="text"
                                value={editableUserName}
                                onChange={(e) => setEditableUserName(e.target.value)}
                                sx={{ flexGrow: 1 }}
                            />
                        </FormControl>
                    </Stack>

                    <Stack direction="row" spacing={2}>
                        {/* Editing Phone Number */}
                        <FormControl>
                            <FormLabel>Phone Number</FormLabel>
                            <Input
                                size="sm"
                                type="text"
                                value={editablePhoneNumber}
                                onChange={(e) => setEditablePhoneNumber(e.target.value)}
                                startDecorator={<PhoneIcon />}
                            />
                        </FormControl>

                    </Stack>

                    <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                        <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
                            <Button
                                size="sm"
                                variant="outlined"
                                color="neutral"
                                onClick={handleUpdate}
                            >
                                Update
                            </Button>
                        </CardActions>
                    </CardOverflow>
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
                        sx={{ px: 2, py: 3 }}
                    >
                        {/* Manage Current Password */}
                        <FormControl>
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
                        <FormControl>
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
                        <FormControl>
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

                    <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                        <CardActions sx={{ justifyContent: 'flex-end', pt: 2 }}>
                            <Button
                                size="sm"
                                variant="outlined"
                                color="neutral"
                                onClick={handlePasswordUpdate}
                            >
                                Update Password
                            </Button>
                        </CardActions>
                    </CardOverflow>
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
                    <Stack spacing={2} sx={{ my: 1 }}>
                    </Stack>

                    <Stack spacing={2} sx={{ my: 1 }}>
                        <label>
                            <input
                                type="checkbox"
                                checked={deleteConfirmation}
                                onChange={(e) => setDeleteConfirmation(e.target.checked)}
                            />
                            I understand that this action cannot be undone.
                        </label>
                    </Stack>


                    {/* Delete User */}
                    <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
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

