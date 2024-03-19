import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import useUser from '../../hooks/useUser';

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Use the useUser hook
    const { setUser, setUserId } = useUser();

    const logIn = async () => {
        try {
            const auth = getAuth();
            const response = await signInWithEmailAndPassword(auth, email, password);
            setUser(response.user); // Update the user in the context
            setUserId(response.user.uid); // Update the user ID in the context
            navigate('/'); // Redirect to the home page upon successful login
        } catch (e) {
            setError(e.message); // Display login errors
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
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
