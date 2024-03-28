// import { useState, useEffect } from "react";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
//
// const useUser = () => {
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//
//   useEffect(() => {
//     const auth = getAuth();
//     const unsubscribe = onAuthStateChanged(auth, currentUser => {
//       setUser(currentUser);
//       setIsLoading(false);
//     });
//
//     // Clean up subscription on unmount
//     return () => unsubscribe();
//   }, []);
//
//   return { user, isLoading };
// };
//
// export default useUser;
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const useUser = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null); // Add state for additional data
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      setIsLoading(false);
      // Optionally, you can reset data to null or some initial state when the user changes
      // This ensures stale data isn't left over from a previous user session
      setData(null);
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  return { user, isLoading, data, setData };
};

export default useUser;
