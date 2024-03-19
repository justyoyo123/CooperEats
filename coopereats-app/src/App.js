import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import CreateAccountPage from './components/CreateAccount/CreateAccountPage';
import Header from './components/Header/Header';
import FoodMenu from './components/Menu/FoodMenu';
import DrinkMenu from './components/Menu/DrinkMenu';
import DessertMenu from './components/Menu/DessertMenu';
import CartPage from './components/Cart/CartPage';
import LoginPage from './components/Login/LoginPage';
import useUser from './hooks/useUser';
import PaymentPage from './components/Payment/Payment';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import AdminPage from './components/Admin/AdminPage';
import ProfilePage from './components/Profile/ProfilePage'; // Added from HEAD
import FoodPage from './components/Food/FoodPage'; // Added from HEAD, assuming it's different from FoodMenu and thus kept separately
import { AuthProvider } from './contexts/AuthContext'; // Ensure you have the correct path to AuthContext.js

// Home component and the rest of the components stay the same as in your conflict version.

function App() {
  const { user } = useUser(); // Use destructuring to get the user from useUser hook, adjust if your hook returns differently

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
    <AuthProvider> {/* This wrapper provides the authentication context */}
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-account" element={<CreateAccountPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/food" element={<FoodPage />} /> {/* Assuming FoodPage is correctly routed here */}
            <Route path="/drink" element={<DrinkMenu />} />
            <Route path="/dessert" element={<DessertMenu />} />
            <Route path="/payment" element={<PaymentPage />} />
            {/* The ProtectedRoute wrapper is used here to protect the AdminPage */}
            <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProfilePage />} /> {/* ProfilePage added from HEAD */}
            {/* Additional routes can be added here */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
