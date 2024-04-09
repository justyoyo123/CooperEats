import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import useUser from '../../hooks/useUser';
import GoogleLogin from './GoogleLogin';
import { IconButton } from '@mui/joy';
import HomeIcon from '@mui/icons-material/Home';


import {
    CssVarsProvider,
    useColorScheme,
    CssBaseline,
    GlobalStyles,
    Box,
    Typography,
    Button,
    Checkbox,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Divider,
    Link
} from '@mui/joy';


const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { mode, setMode } = useColorScheme();
    const { setUser, setUserId } = useUser();

    const logIn = async () => {
        try {
            const auth = getAuth();
            const response = await signInWithEmailAndPassword(auth, email, password);
            setUser(response.user);
            setUserId(response.user.uid);
            navigate('/');
        } catch (e) {
            setError(e.message);
        }
    };


    // Handle home navigation
    const handleGoHome = () => {
        navigate('/');
    };


    return (
        <CssVarsProvider defaultMode="dark" disableTransitionOnChange>
            <CssBaseline />
            <GlobalStyles
                styles={{
                    ':root': {
                        '--Form-maxWidth': '800px',
                        '--Transition-duration': '0.4s',
                    },
                }}
            />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    overflowX: 'hidden',
                }}
            >

            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >

                {/* Header */}
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

                {/* Main content area */}
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: '400px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        p: 2,
                    }}
                >

                    {/* Stack for Google Login and Sign Up */}
                    <Stack gap={2} sx={{ width: '100%', maxWidth: '400px', my: 4 }}>
                        <Stack gap={1}>
                            <Typography component="h1" level="h3">
                                Sign in
                            </Typography>
                            <Typography level="body-sm">
                                New to CooperEats?{' '}
                                <Link component={RouterLink} to="/create-account" underline="hover">
                                    Sign up!
                                </Link>
                            </Typography>
                        </Stack>
                        <GoogleLogin />
                        <Divider sx={{ my: 2 }}>or</Divider>

                        {/* Email and Password Input Fields */}
                        <FormControl required>
                            <FormLabel>Email</FormLabel>
                            <Input type="email" name="email" value={email} onChange={e => setEmail(e.target.value)} />
                        </FormControl>
                        <FormControl required sx={{ mt: 2 }}> {/* Added space */}
                            <FormLabel>Password</FormLabel>
                            <Input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} />
                        </FormControl>
                        {/* Removed Checkbox for "Remember me" */}
                        <Button
                            fullWidth variant="outlined"
                            sx={{
                                mt: 2, // Added more space before the button
                                borderColor: '#81c784',
                                color: '#81c784',
                                '&:hover': {
                                    backgroundColor: 'rgba(129, 200, 132, 0.04)',
                                    borderColor: '#81c784',
                                },
                            }}
                            onClick={logIn}
                        >
                            Sign In
                        </Button>
                    </Stack>

                </Box>

                {/* Footer */}
                <Box component="footer" sx={{ py: 2, width: '100%', textAlign: 'center' }}>
                    <Typography level="body2">© CooperEats {new Date().getFullYear()}</Typography>
                </Box>
            </Box>
        </CssVarsProvider>
    );

};

export default LoginPage;