// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import './Header.css';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';
//
// function Header() {
//   const [user, setUser] = useState(null);
//
//   // Placeholder function for admin check - replace this with your actual logic
//   const isAdmin = (user) => {
//     // check a user property like user.role === 'admin' or firebase?
//     return user && user.isAdmin; // Example property, replace with your actual admin check
//   };
//
//   useEffect(() => {
//     const auth = getAuth();
//     onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//     });
//   }, []);
//
//   return (
//     <header className="header">
//       <Link to="/">
//         <img src="./images/design/coopereats_bubble.png" alt="CooperEats Logo" />
//         {/* Optionally, include the site name as well for accessibility and SEO */}
//         <h1 className="visually-hidden">CooperEats</h1>
//       </Link>
//       <ul>
//         <li><Link to="/">Home</Link></li> {/* Re-integrated from HEAD */}
//         <li><Link to="/food">Food</Link></li>
//         <li><Link to="/cart">Cart</Link></li>
//         {user && isAdmin(user) && (
//           <li><Link to="/admin">Admin</Link></li> // Admin link, only visible to admins
//         )}
//         {user ? (
//           <>
//             <li><Link to="/profile">Profile</Link></li>
//             <li>{user.email}</li>
//             <li><button onClick={() => getAuth().signOut()}>Logout</button></li>
//           </>
//         ) : (
//           <li><Link to="/login">Login</Link></li>
//         )}
//       </ul>
//     </header>
//   );
// }
//
// export default Header;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function Header() {
  const [user, setUser] = useState(null);

  // Placeholder function for admin check - replace this with your actual logic
  const isAdmin = (user) => {
    // check a user property like user.role === 'admin' or firebase?
    return user && user.isAdmin; // Example property, replace with your actual admin check
  };

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  return (
      <header className="header">
        <Link to="/">
          <img src="./images/design/coopereats_bubble.png" alt="CooperEats Logo" />
        </Link>
        <ul>
          <li><Link to="/appetizer">Appetizer</Link></li>
          <li><Link to="/main">Main</Link></li>
          <li><Link to="/drink">Drink</Link></li>
          <li><Link to="/dessert">Dessert</Link></li>
          <li><Link to="/cart">Cart</Link></li>
          {user && isAdmin(user) && (
              <li><Link to="/admin">Admin</Link></li> // Admin link, only visible to admins
          )}
          {user ? (
              <>
                <li><Link to="/profile">Profile</Link></li>
                <li>{user.email}</li>
                <li><button onClick={() => getAuth().signOut()}>Logout</button></li>
              </>
          ) : (
              <li><Link to="/login">Login</Link></li>
          )}
        </ul>
      </header>
  );
}

export default Header;