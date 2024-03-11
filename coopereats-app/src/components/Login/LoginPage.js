import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const logIn = async () => {
        try {
            await signInWithEmailAndPassword(getAuth(), email, password);
            navigate('/'); // Redirect to the home page upon successful login
        } catch (e) {
            setError(e.message); // Set any sign-in errors to be displayed
        }
    };

    return (
        <div className="create-account-container"> {/* Use the same container class for consistency */}
            <div className="create-account-form"> {/* Use the same form class for consistency */}
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
