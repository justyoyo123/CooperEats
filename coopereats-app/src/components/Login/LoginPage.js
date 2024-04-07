import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import useUser from '../../hooks/useUser';
import GoogleLogin from './GoogleLogin';

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
    const { mode, setMode } = useColorScheme(); // Declare mode and setMode using useColorScheme
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
                    alignItems: 'center',
                    width: '100%',
                    overflowX: 'hidden',
                }}
            >

                {/* Header with Logo */}
                <Box
                    component="header"
                    sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        py: 3,
                        px: 2,
                    }}
                >
                    <Typography level="h3"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}
                    >
                        {/* Logo Image */}
                        <Box
                            component="img"
                            src="/images/design/TheCooperUnion_logo.png"
                            alt="CooperEats Logo"
                            sx={{
                                width: 'auto', height: 50
                            }}
                        />
                        CooperEats
                    </Typography>
                </Box>
                {/* Main content area */}
                <Box
                    sx={{
                        width: '100%', // This makes sure the container takes the full width
                        maxWidth: '400px', // This sets the maximum width of the box
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center', // This aligns children (stacks) to center
                        p: 2, // Padding around the content
                    }}
                >

                    {/* Stack for Google Login and Sign Up */}
                    <Stack gap={2} sx={{ width: '100%', maxWidth: '400px', my: 4 }}>
                        <Stack gap={1}>
                            <Typography component="h1" level="h3">
                                Sign in
                            </Typography>
                            <Typography level="body-sm">
                                New to CooeprEats?{' '}
                                <Link component={RouterLink} to="/create-account" underline="hover">
                                    Sign up!
                                </Link>
                            </Typography>
                        </Stack>
                        <GoogleLogin />


                        {/* Divider with "or" text */}
                        <Divider sx={{ my: 2 }}>or</Divider>

                        {/* Email and Password Input Fields */}
                        <FormControl required>
                            <FormLabel>Email</FormLabel>
                            <Input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </FormControl>
                        <FormControl required>
                            <FormLabel>Password</FormLabel>
                            <Input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </FormControl>
                        <Stack direction="row" justifyContent="space-between">
                            <Checkbox size="sm" label="Remember me" name="persistent" />
                        </Stack>
                        <Button fullWidth type="submit" onClick={logIn}>
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