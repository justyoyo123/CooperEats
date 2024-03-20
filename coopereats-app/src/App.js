import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import CreateAccountPage from './components/CreateAccount/CreateAccountPage';
import Header from './components/Header/Header';
import DrinkMenu from './components/Menu/DrinkMenu';
import DessertMenu from './components/Menu/DessertMenu';
import CartPage from './components/Cart/CartPage';
import LoginPage from './components/Login/LoginPage';
import useUser from './hooks/useUser';
import PaymentPage from './components/Payment/Payment';
import AdminPage from './components/Admin/AdminPage';
import ProfilePage from './components/Profile/ProfilePage';
import FoodPage from './components/Food/FoodPage';
import { AuthProvider } from './contexts/AuthContext';

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
            <Route path="/create-account" element={<CreateAccountPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/food" element={<FoodPage />} />
            <Route path="/drink" element={<DrinkMenu />} />
            <Route path="/dessert" element={<DessertMenu />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProfilePage />} />
            {/* Additional routes can be added here */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
