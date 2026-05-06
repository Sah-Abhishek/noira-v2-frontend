// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const UserProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("userjwt");
  const email = localStorage.getItem("userEmail");
  const location = useLocation();

  // If no token, redirect to login
  if (!token || !email) {
    return <Navigate to="/userlogin" replace state={{ from: location }} />;
  }

  // Otherwise, render children
  return children;
};

export default UserProtectedRoute;
