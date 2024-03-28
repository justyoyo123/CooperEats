import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import CreateAccountPage from './components/CreateAccount/CreateAccountPage';
import Header from './components/Header/Header';
import MainMenu from './components/Menu/MainMenu';
import AppetizerMenu from './components/Menu/AppetizerMenu';
import DrinkMenu from './components/Menu/DrinkMenu';
import DessertMenu from './components/Menu/DessertMenu';
import CartPage from './components/Cart/CartPage';
import LoginPage from './components/Login/LoginPage';
import PaymentPage from './components/Payment/Payment';
import AdminPage from './components/Admin/AdminPage';
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
            <Route path="/" element={<Home user={user} onSignOut={handleSignOut} />} />
            <Route path="/create-account" element={<CreateAccountPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/appetizer" element={<AppetizerMenu />} />
            <Route path="/main" element={<MainMenu />} />
            <Route path="/drink" element={<DrinkMenu />} />
            <Route path="/dessert" element={<DessertMenu />} />
            <Route path="/admin" element={
                <AdminPage />
            } />
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

// function Home() {
//   const { user, isLoading, data, setData } = useUser(); // Assuming useUser hook manages the state
//   const navigate = useNavigate();
//
//   useEffect(() => {
//     if (!isLoading && user) {
//       const loadUsers = async () => {
//         const token = await user.getIdToken();
//         const headers = { Authorization: `Bearer ${token}` };
//         try {
//           const response = await axios.get(`http://localhost:8080/api/users`, { headers });
//           setData(response.data);
//         } catch (error) {
//           console.error('Error fetching data:', error);
//         }
//       };
//       loadUsers();
//     }
//   }, [user, isLoading, setData]);
//
//   const handleSignOut = async () => {
//     try {
//       await signOut(getAuth());
//       navigate('/login');
//     } catch (error) {
//       console.error("Sign out error:", error);
//     }
//   };
//
//   if (isLoading) {
//     return <div className="centered"><h1>Loading...</h1></div>;
//   }
//
//   return (
//     <div className="centered">
//       {user ? (
//         <>
//           <h2>Welcome to CooperEats, {user.displayName || 'User'}!</h2>
//           <button className="auth-button" onClick={handleSignOut}>Log Out</button>
//         </>
//       ) : (
//         <h2>Welcome to CooperEats! Please log in.</h2>
//       )}
//     </div>
//   );
// }
//
// function App() {
//   //
//   // const { user, setUser } = useUser(); // Admin check starts here but not complete
//   const ProtectedRoute = ({ children }) => {
//     if (!user) {
//       return <Navigate to="/login" />;
//     }
//     const isAdmin = user && user.role === 'ADMIN';
//     if (!isAdmin) {
//       return <Navigate to="/" />;
//     }
//     return children;
//   };
//   return (
//
//     <Router>
//       <div className="App">
//         <Header />
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/create-account" element={<CreateAccountPage />} />
//           <Route path="/cart" element={<CartPage />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/appetizer" element={<AppetizerMenu />} /> {/* New appetizer component */}
//           <Route path="/main" element={<MainMenu />} /> {/* Renamed from FoodMenu */}
//           <Route path="/drink" element={<DrinkMenu />} />
//           <Route path="/dessert" element={<DessertMenu />} />
//           <Route path="/payment" element={<PaymentPage />} />
//           {/*<Route path="/admin" element = {<AdminPage />} />*/}
//           { <Route
//             path="/admin"
//             element={
//               <ProtectedRoute>
//                 <AdminPage />
//               </ProtectedRoute>
//             }
//           /> }
//           {/* Additional routes can be added here */}
//         </Routes>
//       </div>
//     </Router>
//   );
// }
//
// export default App;
