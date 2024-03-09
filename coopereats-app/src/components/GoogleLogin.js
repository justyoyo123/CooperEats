import React from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

export default function GoogleLogin() {
    const { signInWithGoogle } = useAuth();

    async function handleGoogleLogin() {
        try {
            const result = await signInWithGoogle();
            const token = await result.user.getIdToken();
            const response = await axios.post("http://localhost:5000/api/auth/google", {
                token,
            });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleGoogleLogin}
        >
            Sign in with Google
        </button>
    );
}