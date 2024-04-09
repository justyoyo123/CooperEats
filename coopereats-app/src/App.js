import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import './App.css';
import CreateAccountPage from './components/CreateAccount/CreateAccountPage';
import Header from './components/Header/Header';
import FoodPage from './components/Food/FoodPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import CartPage from './components/Cart/CartPage';
import LoginPage from './components/Login/LoginPage';
import PaymentPage from './components/Payment/Payment';
import ProfilePage from './components/Profile/ProfilePage';
import AdminPage from './components/Admin/AdminPage';
import AdminUsersPage from './components/Admin/AdminUsersPage';
import AdminOrdersPage from './components/Admin/AdminOrdersPage';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import HomePage from './components/Home/HomePage';
import { CssVarsProvider } from '@mui/joy/styles';

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), async (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
      if (firebaseUser) {
        try {
          const response = await axios.get(`http://localhost:8080/api/users/firebase/${firebaseUser.uid}`);
          setIsAdmin(response.data.role === 'ADMIN');
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(getAuth());
      console.log('User signed out successfully');
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <CssVarsProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/create-account" element={<CreateAccountPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route
              path="*"
              element={
                <>
                  <Header user={user} onSignOut={handleSignOut} />
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/food" element={<FoodPage />} />
                    <Route path="/payment" element={<PaymentPage />} />
                    <Route path="/admin/menu" element={<AdminPage />} />
                    <Route path="/admin/users" element={<AdminUsersPage />} />
                    <Route path="/admin/orders" element={<AdminOrdersPage />} />
                    {/* Redirect any other path to HomePage */}
                    <Route path="*" element={<HomePage />} />
                  </Routes>
                </>
              }
            />
          </Routes>
        </div>
      </Router>
    </CssVarsProvider>
  );
}

export default App;
