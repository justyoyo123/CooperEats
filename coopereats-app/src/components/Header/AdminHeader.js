import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminHeader.css';
import { getAuth } from 'firebase/auth'

function AdminHeader() {
    const navigate = useNavigate();
  return (
    <header className="admin-header">
      <Link to="/admin">
        <img src="../../public/images/design/TheCooperUnion_logo.png" alt="CooperEats Admin Logo" style={{ maxWidth: "120px", height: "auto"}} />
      </Link>
      <nav>
          <ul>
              <li><Link to="/admin/menu">Dashboard</Link></li>
              <li><Link to="/admin/users">Users</Link></li>
              <li><Link to="/admin/orders">Orders</Link></li>
              <li>
                  <button onClick={() => {
                      getAuth().signOut().then(() => navigate('/')); // Logout and redirect to '/'
                  }}>Logout
                  </button>
              </li>
          </ul>
      </nav>
    </header>
  );
}

export default AdminHeader;
