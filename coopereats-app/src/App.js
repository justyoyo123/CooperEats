import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import CreateAccountPage from './components/CreateAccountPage';
import Header from './components/Header/Header';
import FoodMenu from './components/Menu/FoodMenu';
import DrinkMenu from './components/Menu/DrinkMenu';
import CartPage from './components/Cart/CartPage';
import LoginPage from './components/Login/LoginPage';
import ProfilePage from './components/Profile/ProfilePage';

function Home() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    const loadUsers = async () => {
      const response = await axios.get(`http://localhost:8080/api/getUsers`);
      setData(response.data);
    };

    loadUsers();
  }, []);

  if (data) {
    return (
      <>
        <h1>RPS</h1>
        <nav>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/create-account">Create Account</Link>
          <Link to="/login">Login</Link>
        </nav>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </>
    );
  }

  return <h1>Data</h1>;
}

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-account" element={<CreateAccountPage />} />
          <Route path="/foodmenu" element={<FoodMenu />} />
          <Route path="/drinkmenu" element={<DrinkMenu />} />
          <Route path="/dessertmenu" element={<DrinkMenu />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          {/* Include any other routes here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
