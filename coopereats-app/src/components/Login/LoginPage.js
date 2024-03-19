import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
<<<<<<< HEAD
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import useUser from '../../hooks/useUser';
=======
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
>>>>>>> 2a64b4ba2f56cdc8146cc6a123743a32a41b5ee6

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
<<<<<<< HEAD
    const navigate = useNavigate();

    // Use the useUser hook
    const { setUser, setUserId } = useUser();

    const logIn = async () => {
        try {
            const auth = getAuth();
            const response = await signInWithEmailAndPassword(auth, email, password);
            setUser(response.user); // Update the user
            setUserId(response.user.uid); // Update the user ID
            navigate('/'); // Redirect to the home page upon successful login
        } catch (e) {
            setError(e.message); // Display login errors
=======

    const navigate = useNavigate();

    const logIn = async () => {
        try {
            await signInWithEmailAndPassword(getAuth(), email, password);
            navigate('/'); // Redirect to the home page upon successful login
        } catch (e) {
            setError(e.message); // Set any sign-in errors to be displayed
>>>>>>> 2a64b4ba2f56cdc8146cc6a123743a32a41b5ee6
        }
    };

    return (
<<<<<<< HEAD
        <div className="create-account-container">
            <div className="create-account-form">
=======
        <div className="create-account-container"> {/* Use the same container class for consistency */}
            <div className="create-account-form"> {/* Use the same form class for consistency */}
>>>>>>> 2a64b4ba2f56cdc8146cc6a123743a32a41b5ee6
                <h1>Log In</h1>
                {error && <p className="error">{error}</p>}
                <div className="input-group">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button onClick={logIn}>Log In</button>
                <p>
                    <Link to="/create-account">Don't have an account? Create one here.</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
