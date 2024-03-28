// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import './Header.css';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';
// import axios from "axios";
//
// function Header() {
//   const [user, setUser] = useState(null);
//   const [userId, setUserId] = useState(null);
//
//   useEffect(() => {
//     const fetchUserId = async (firebaseUid) => {
//       try {
//         const response = await axios.get(`http://localhost:8080/api/users/firebase/${firebaseUid}`, { params: { firebaseUid } });
//         setUserId(response.data);
//         console.log("Fetched application user ID:", response.data);
//       } catch (error) {
//         console.error("Error fetching application user ID:", error);
//         setUserId(null);
//       }
//     };
//
//     const auth = getAuth();
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         // Fetch the application-specific userId using the Firebase UID
//         fetchUserId(user.uid);
//       } else {
//         // User is signed out
//         setUserId(null);
//       }
//     });
//
//     return () => unsubscribe();
//   }, []);
//
//   // check if user currently logged in is admin
//   const isAdmin = async (userId) => {
//     const response = await axios.get(`http://localhost:8080/api/users/${userId}`)
//     return response.data.role === 'ADMIN';
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
//       </Link>
//       <ul>
//         <li><Link to="/appetizer">Appetizer</Link></li>
//         <li><Link to="/main">Main</Link></li>
//         <li><Link to="/drink">Drink</Link></li>
//         <li><Link to="/dessert">Dessert</Link></li>
//         <li><Link to="/cart">Cart</Link></li>
//         {isAdmin(userId) && (
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
import axios from "axios";

function Header() {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // State to track if the user is an admin

  useEffect(() => {
    const fetchUserId = async (firebaseUid) => {
      try {
        const response = await axios.get(`http://localhost:8080/api/users/firebase/${firebaseUid}`, { params: { firebaseUid } });
        setUserId(response.data);
        console.log("Fetched application user ID:", response.data);
      } catch (error) {
        console.error("Error fetching application user ID:", error);
        setUserId(null);
      }
    };

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Fetch the application-specific userId using the Firebase UID
        fetchUserId(user.uid);
      } else {
        // User is signed out
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkAdmin = async () => {
      if (userId) { // Only check if we have a userId
        const response = await axios.get(`http://localhost:8080/api/users/${userId}`);
        setIsAdmin(response.data.role === 'ADMIN');
      } else {
        setIsAdmin(false); // Reset admin status if no user
      }
    };

    checkAdmin();
  }, [userId]); // Trigger the effect when userId changes

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
          {isAdmin && (
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
