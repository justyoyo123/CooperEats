import React, { useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-account" element={<CreateAccountPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/food" element={<FoodMenu />} />
          <Route path="/drink" element={<DrinkMenu />} />
          <Route path="/dessert" element={<DessertMenu />} />
          {/* Additional routes can be added here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
