// useUser.js
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from 'axios';

const useUser = () => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const BACKEND_URL = "http://localhost:8080/api/users";

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch user ID from backend using email
        try {
          const response = await axios.get(`${BACKEND_URL}/findByEmail`, { params: { email: currentUser.email } });
          setUserId(response.data); // Assuming the endpoint directly returns the user ID
        } catch (error) {
          console.error('Error fetching user ID:', error);
          setUserId(null);
        }
      } else {
        setUserId(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, setUser, userId, setUserId, isLoading };
};

export default useUser;
