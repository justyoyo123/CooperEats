import React from 'react';
import AdminHeader from '../Header/AdminHeader'; // Import the admin header

const AdminPage = () => {
  return (
    <div>
      <AdminHeader /> {/* Use the admin-specific header */}
      <h1>Admin Dashboard</h1>
      {/* The rest of your admin page content */}
    </div>
  );
};

export default AdminPage;
