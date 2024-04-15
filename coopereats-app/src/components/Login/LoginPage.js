import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { IconButton, Typography, Button, FormControl, FormLabel, Input, Stack, Divider, Link, Box } from '@mui/joy';
import HomeIcon from '@mui/icons-material/Home';
import GoogleLogin from './GoogleLogin';  // Assuming GoogleLogin is correctly implemented elsewhere
import useUser from '../../hooks/useUser';  // Importing the useUser hook

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser, setUserId } = useUser();  // Use the useUser hook

    const logIn = async () => {
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }
        setIsLoading(true);
        try {
            const auth = getAuth();
            const response = await signInWithEmailAndPassword(auth, email, password);
            setUser(response.user);  // Update user context
            setUserId(response.user.uid);  // Update user ID context
            navigate('/');  // Navigate to home/dashboard on success
        } catch (e) {
            setError("Failed to sign in: " + e.message);  // Set error message from Firebase
        }
        setIsLoading(false);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', overflowX: 'hidden' }}>
            <Box component="header" sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 3, px: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box component="img" src="/images/design/TheCooperUnion_logo.png" alt="CooperEats Logo" sx={{ width: 'auto', height: 50 }} />
                    <Typography level="h3">CooperEats</Typography>
                </Box>
                <IconButton aria-label="home" onClick={() => navigate('/')}><HomeIcon /></IconButton>
            </Box>
            <Box sx={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                <Stack gap={2} sx={{ width: '100%', maxWidth: '400px', my: 4 }}>
                    <Typography component="h1" level="h3">Sign in</Typography>
                    <Typography level="body-sm">New to CooperEats? <Link component={RouterLink} to="/create-account">Sign up!</Link></Typography>
                    <GoogleLogin />
                    <Divider>or</Divider>
                    {error && <Typography color="danger" sx={{ mt: 1 }}>{error}</Typography>}
                    <FormControl required>
                        <FormLabel>Email</FormLabel>
                        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </FormControl>
                    <FormControl required sx={{ mt: 2 }}>
                        <FormLabel>Password</FormLabel>
                        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </FormControl>
                    <Button onClick={logIn} disabled={isLoading} sx={{ mt: 2, width: '100%', maxWidth: '100%' }}>
                        Sign In
                    </Button>
                    {isLoading && <Typography sx={{ mt: 1 }}>Logging in...</Typography>}
                </Stack>
                <Typography level="body2" sx={{ mt: 2 }}>© CooperEats {new Date().getFullYear()}</Typography>
            </Box>
        </Box>
    );
};

export default LoginPage;
