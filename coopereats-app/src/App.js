import React, { useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';
import CreateAccountPage from './components/CreateAccount/CreateAccountPage';
import Header from './components/Header/Header';
import FoodMenu from './components/Menu/FoodMenu';
import DrinkMenu from './components/Menu/DrinkMenu';
import DessertMenu from './components/Menu/DessertMenu';
import CartPage from './components/Cart/CartPage';
import LoginPage from './components/Login/LoginPage';
import useUser from './hooks/useUser';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Button, Navbar, Container } from 'react-bootstrap';
import AdminPage from './components/Admin/AdminPage';
import ProfilePage from './components/Profile/ProfilePage';
import { AuthProvider } from './contexts/AuthContext'; // Ensure you have the correct path to AuthContext.js
import FoodPage from './components/Food/FoodPage';

// Home component
function Home() {
  const { user, isLoading, data, setData } = useUser(); // Assuming useUser hook manages the state
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      const loadUsers = async () => {
        const token = await user.getIdToken();
        const headers = { Authorization: `Bearer ${token}` };
        try {
          const response = await axios.get(`http://localhost:8080/api/getUsers`, { headers });
          setData(response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      loadUsers();
    }
  }, [user, isLoading, setData]);

  const handleSignOut = async () => {
    try {
      await signOut(getAuth());
      navigate('/login');
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (isLoading) {
    return <div className="centered"><h1>Loading...</h1></div>;
  }

  return (
    <div className="centered">
      {user ? (
        <>
          <h2>Welcome to CooperEats, {user.displayName || 'User'}!</h2>
          <button className="auth-button" onClick={handleSignOut}>Log Out</button>
        </>
      ) : (
        <h2>Welcome to CooperEats! Please log in.</h2>
      )}
    </div>
  );
}

function App() {
  const { user, setUser } = useUser(); // Adjust this line based on your useUser hook

  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }

    const isAdmin = user && user.role === 'admin';

    if (!isAdmin) {
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-account" element={<CreateAccountPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/food" element={<FoodPage />} />
            {/* Ensure other menu routes are updated similarly */}
            <Route path="/profile" element={<ProfilePage />} />
            {/* ProtectedRoute for admin pages */}
            <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;