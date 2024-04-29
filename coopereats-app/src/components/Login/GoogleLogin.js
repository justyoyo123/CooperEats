import React from "react";
import { useAuth } from '../../contexts/AuthContext';
import axios from "axios";
import { Button } from '@mui/joy';
import GoogleIcon from './GoogleIcon';
import { useNavigate } from 'react-router-dom';

export default function GoogleLogin() {
    const { signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    async function handleGoogleLogin() {
        try {
            const result = await signInWithGoogle();
            const firebaseUser = result.user;
            const username = firebaseUser.email.substring(0, firebaseUser.email.lastIndexOf("@"));

            // Check if user already exists in the backend by their Firebase UID
            try {
                await axios.get(`http://20.88.180.242:8080/api/users/firebase/${firebaseUser.uid}`);

                // User exists in the backend, so we can redirect them to the home page
                navigate('/');
            } catch (error) {
                // User does not exist in backend, create a new user
                const backendUser = {
                    userName: username,
                    email: firebaseUser.email,
                    fullName: firebaseUser.displayName || '',
                    phoneNumber: firebaseUser.phoneNumber || '',
                    firebaseUid: firebaseUser.uid,
                };

                // Create a new user entry in the backend
                const createUserResponse = await axios.post("http://20.88.180.242:8080/api/users", backendUser);

                if (createUserResponse.status === 200) {
                    console.log('User created in backend:', createUserResponse.data);
                    navigate('/'); // Redirect to home page after successful creation
                } else {
                    throw new Error('Failed to create user in backend');
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Button
            variant="soft"
            color="neutral"
            fullWidth
            startDecorator={<GoogleIcon />}
            onClick={handleGoogleLogin}
        >
            Continue with Google
        </Button>
    );
}
