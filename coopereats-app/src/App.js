import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
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
import Footer from './components/Footer/Footer';
import AboutUsPage from './components/AboutUs/AboutUsPage';


function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  localStorage.setItem('totalSales', '0');

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

  const ConditionalHeader = () => {
    const location = useLocation();
    const excludedPaths = ['/login', '/create-account', '/profile'];
    if (excludedPaths.includes(location.pathname)) {
      return null; // Do not render Header on these paths
    }
    return <Header user={user} onSignOut={handleSignOut} />;
  };


  return (
    <styled>
      <Router>
        <div className="App">
          <ConditionalHeader />
          <div className ="main-content">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/create-account" element={<CreateAccountPage />} />
              <Route path="/food" element={<FoodPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/admin/menu" element={<AdminPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/orders" element={<AdminOrdersPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/cart" element={<CartPage />} />
              {/* Redirect any other path to HomePage */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </styled>
  );
}

export default App;
