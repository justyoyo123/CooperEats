import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from 'axios'; // Import axios for making HTTP requests

const useUser = () => {
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null); // Keep track of userId
    const [isLoading, setIsLoading] = useState(true);
    const BACKEND_URL = "http://localhost:8080/api/users"; // Backend URL for fetching user details

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                // Fetch user ID from backend using email, if currentUser is present
                try {
                    const response = await axios.get(`${BACKEND_URL}/findByEmail`, { params: { email: currentUser.email } });
                    setUserId(response.data); // Assuming the endpoint directly returns the user ID
                } catch (error) {
                    console.error('Error fetching user ID:', error);
                    setUserId(null); // Set userId to null if there is an error fetching it
                }
            } else {
                setUserId(null); // Set userId to null if no currentUser is present
            }
            setIsLoading(false); // Update loading state
        });

        // Clean up subscription on unmount
        return () => unsubscribe();
    }, []);

    return { user, setUser, userId, setUserId, isLoading };
};

export default useUser;