<<<<<<< HEAD
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
=======
// AuthContext.js
import React, { useContext, useState, useEffect } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null); // Store auth in state
>>>>>>> 2a64b4ba2f56cdc8146cc6a123743a32a41b5ee6
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
<<<<<<< HEAD
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(getAuth(), provider);
  };

  const logOut = async () => {
    await signOut(getAuth());
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    setCurrentUser,
    signInWithGoogle,
    signOut: logOut,
  };
=======
    setAuth(getAuth()); // Call getAuth() here after Firebase has been initialized in index.js
    // ... rest of your useEffect hook
  }, []);

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        setLoading(false);
      });
      return unsubscribe; // Ensure we unsubscribe on component unmount
    }
  }, [auth]); // Add auth as a dependency here

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider); // Use auth from state
  };

  const logOut = () => {
    return signOut(auth); // Use auth from state
  };

  // Check if auth is not null before providing it
  const value = auth
    ? {
        currentUser,
        signInWithGoogle,
        signOut: logOut,
      }
    : {};
>>>>>>> 2a64b4ba2f56cdc8146cc6a123743a32a41b5ee6

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
<<<<<<< HEAD
};

export const useAuth = () => useContext(AuthContext);
=======
}

export default AuthProvider;
>>>>>>> 2a64b4ba2f56cdc8146cc6a123743a32a41b5ee6
