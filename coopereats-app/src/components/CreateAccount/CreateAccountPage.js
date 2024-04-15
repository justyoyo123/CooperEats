import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';
import { IconButton, Typography, Button, FormControl, FormLabel, Input, Stack, Divider, Link, Box } from '@mui/joy';
import HomeIcon from '@mui/icons-material/Home';
import GoogleLogin from './../Login/GoogleLogin';

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
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUid = userCredential.user.uid;

      // Ensure the password is being sent to the backend
      const backendUser = {
        userName,
        email,
        fullName,
        phoneNumber,
        firebaseUid,
        password  // Ensure this is included
      };

      // Post request to backend
      const response = await axios.post('http://localhost:8080/api/users', backendUser);
      if (response.status === 200) {
        navigate('/');  // Redirect on successful account creation
      } else {
        setError('Failed to create user in backend');
      }
    } catch (e) {
      setError(e.message);
    }
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
          <Typography component="h1" level="h3">Create Account</Typography>
          <Typography level="body-sm">Already have an account? <Link component={RouterLink} to="/login" underline="hover">Log in here</Link></Typography>
          <GoogleLogin />
          <Divider sx={{ my: 2 }}>or</Divider>
          {error && <Typography color="danger">{error}</Typography>}
          <FormControl required><FormLabel>Username</FormLabel><Input value={userName} onChange={(e) => setUserName(e.target.value)} /></FormControl>
          <FormControl required><FormLabel>Email</FormLabel><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></FormControl>
          <FormControl required><FormLabel>Password</FormLabel><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></FormControl>
          <FormControl required><FormLabel>Re-enter Password</FormLabel><Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></FormControl>
          <Button onClick={createAccount}>Create Account</Button>
        </Stack>
        <Typography level="body2">© CooperEats {new Date().getFullYear()}</Typography>
      </Box>
    </Box>
  );
};

export default CreateAccountPage;
