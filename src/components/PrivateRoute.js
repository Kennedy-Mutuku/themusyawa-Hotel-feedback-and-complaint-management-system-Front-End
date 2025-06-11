import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// PrivateRoute component to protect admin routes
const PrivateRoute = () => {
  const adminToken = localStorage.getItem('adminToken');

  // If no token, redirect to admin login
  if (!adminToken) {
    return <Navigate to="/adminlogin" replace />;
  }

  // Token exists, allow rendering nested routes/components
  return <Outlet />;
};

export default PrivateRoute;
