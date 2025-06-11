import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem('adminToken'); // ✅ Check token
  return isAuthenticated ? children : <Navigate to="/adminlogin" />;
}

export default PrivateRoute;
