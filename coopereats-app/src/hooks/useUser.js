import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const useUser = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      setIsLoading(false);
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  return { user, isLoading };
};

export default useUser;
