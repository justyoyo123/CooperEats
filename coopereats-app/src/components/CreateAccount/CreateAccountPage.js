import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';
import GoogleLogin from './../Login/GoogleLogin';
import { IconButton } from '@mui/joy';
import HomeIcon from '@mui/icons-material/Home';

import {
  CssVarsProvider,
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


const CreateAccountPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  const createAccount = async () => {
    try {
      if (password !== confirmPassword) {
        setError('Password and confirm password do not match');
        return;
      }

      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUid = userCredential.user.uid;

      const backendUser = {
        userName,
        email,
        fullName,
        phoneNumber,
        firebaseUid,
      };

      const response = await axios.post('http://localhost:8080/api/users', backendUser);

      if (response.status === 200) {
        navigate('/');
      } else {
        setError('Failed to create user in backend');
      }
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
        {/* Header with Color Scheme Toggle */}
        <Box component="header" sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 3,
          px: 2,
        }}>
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
          {/* Stack for Google Singup */}
          <Stack gap={2} sx={{ width: '100%', maxWidth: '400px', my: 4 }}>
            <Stack gap={1}>
              <Typography component="h1" level="h3">
                Create Account
              </Typography>
              <Typography level="body-sm">
                Already have an account?{' '}
                <Link component={RouterLink} to="/login" underline="hover">
                  Log in here
                </Link>
              </Typography>
            </Stack>
            <GoogleLogin />
            <Divider sx={{ my: 2 }}>or</Divider>
            {error && <Typography color="danger">{error}</Typography>}

            {/* Username, Email, Password Input Fields */}
            <FormControl required>
              <FormLabel>Username</FormLabel>
              <Input type="text" name="username" value={userName} onChange={(e) => setUserName(e.target.value)} />
            </FormControl>
            <FormControl required>
              <FormLabel>Email</FormLabel>
              <Input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl required>
              <FormLabel>Password</FormLabel>
              <Input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormControl>
            <FormControl required>
              <FormLabel>Re-enter Password</FormLabel>
              <Input type="password" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </FormControl>

            <Button
              fullWidth variant="outlined"
              sx={{
                mt: 2,
                borderColor: '#81c784',
                color: '#81c784',
                '&:hover': {
                  backgroundColor: 'rgba(129, 200, 132, 0.04)',
                  borderColor: '#81c784',
                },
              }}
              onClick={createAccount}
            >
              Create Account
            </Button>

          </Stack>
          {/* Footer */}
          <Box component="footer" sx={{ py: 2, width: '100%', textAlign: 'center' }}>
            <Typography level="body2">© CooperEats {new Date().getFullYear()}</Typography>
          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );

};

export default CreateAccountPage;