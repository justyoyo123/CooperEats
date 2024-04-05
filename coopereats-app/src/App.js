import react, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import CreateAccountPage from './components/CreateAccount/CreateAccountPage';
import Header from './components/Header/Header';
import FoodPage from './components/Food/FoodPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import Car from './components/Carousel/Caro';
import CartPage from './components/Cart/CartPage';
import LoginPage from './components/Login/LoginPage';
import PaymentPage from './components/Payment/Payment';
import ProfilePage from './components/Profile/ProfilePage';
import AdminPage from './components/Admin/AdminPage';
import AdminUsersPage from './components/Admin/AdminUsersPage';
import AdminOrdersPage from './components/Admin/AdminOrdersPage';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';


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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleSignOut = async () => {
    try {
      await signOut(getAuth());
      // Since useNavigate hook can't be used outside of Router, we need to move or call this function where it can be used properly
      // navigate('/login');
      console.log('User signed out successfully');
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // const ProtectedRoute = ({ children }) => {
  //   const navigate = useNavigate();
  //
  //   useEffect(() => {
  //     if (!user) {
  //       navigate('/login');
  //     } else if (!isAdmin) {
  //       navigate('/');
  //     }
  //   }, [user, isAdmin, navigate]);
  //
  //   return children;
  // };

  return (
      <Router>
        <div className="App">
          <Header user={user} onSignOut={handleSignOut} />
          <Routes>
            <Route path="/" element={<Car />} />
            <Route path="/create-account" element={<CreateAccountPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/food" element={<FoodPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/admin/menu" element={
                <AdminPage />
            } />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
      </Router>
  );
}

function Home({ user, onSignOut }) {
  return (
      <div>
        {user ? (
            <>
              <h2>Welcome to CooperEats, {user.displayName || 'User'}!</h2>
              <button onClick={onSignOut}>Log Out</button>
            </>
        ) : (
            <h2>Welcome to CooperEats! Please log in.</h2>
        )}
      </div>
  );
}

export default App;
