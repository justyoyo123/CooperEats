import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { IconButton, Typography, Button, FormControl, FormLabel, Input, Stack, Divider, Link, Box } from '@mui/joy';
import VisibilityOffSharpIcon from '@mui/icons-material/VisibilityOffSharp'; // Import visibility icons
import VisibilitySharpIcon from '@mui/icons-material/VisibilitySharp'; // Import visibility icons
import GoogleLogin from './GoogleLogin';
import useUser from '../../hooks/useUser';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser, setUserId } = useUser();

    const logIn = async () => {
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }
        setIsLoading(true);
        try {
            const auth = getAuth();
            const response = await signInWithEmailAndPassword(auth, email, password);
            setUser(response.user);
            setUserId(response.user.uid);
            navigate('/');
        } catch (e) {
            setError("Failed to sign in: " + e.message);
        }
        setIsLoading(false);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', overflowX: 'hidden', mt: 4 }}>
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
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            endDecorator={
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <VisibilityOffSharpIcon /> : <VisibilitySharpIcon />}
                                </IconButton>
                            }
                        />
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
