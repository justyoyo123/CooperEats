import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { getAuth, onAuthStateChanged } from "firebase/auth";

function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  return (
    <header className="header">
      <Link to="/">
        <img src="./images/design/coopereats_bubble.png" alt="CooperEats Logo"/>
      </Link>
      <ul>
        {/* <li><Link to="/">Home</Link></li> */}
        <li><Link to="/foodmenu">Food</Link></li>
        <li><Link to="/drinkmenu">Drink</Link></li>
        <li><Link to="/dessertmenu">Dessert</Link></li>
        <li><Link to="/cart">Cart</Link></li>
        {user ? (
          <>
            <li>{user.email}</li> {/* Display the user's email */}
            <li><button onClick={() => getAuth().signOut()}>Logout</button></li> {/* Logout button */}
          </>
        ) : (
          <li><Link to="/login">Login</Link></li> /* Show Login link if not logged in */
        )}
      </ul>
    </header>
  );
}

export default Header;
