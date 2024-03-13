import React from 'react';
import { Link } from 'react-router-dom';
import './AdminHeader.css';
import { getAuth } from 'firebase/auth'

function AdminHeader() {

  return (
    <header className="admin-header">
      <Link to="/admin">
        <img src="./images/design/TheCooperUnion_logo.png" alt="CooperEats Admin Logo" style={{ maxWidth: "120px", height: "auto"}} />
      </Link>
      <nav>
        <ul>
          <li><Link to="/admin/dashboard">Dashboard</Link></li>
          <li><Link to="/admin/users">Users</Link></li>
          <li><Link to="/admin/menu">Menu</Link></li>
          <li><Link to="/admin/orders">Orders</Link></li>
          {/* More admin links can be addded */}
          <li><button onClick={() => getAuth().signOut()}>Logout</button></li>
        </ul>
      </nav>
    </header>
  );
}

export default AdminHeader;
