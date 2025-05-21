// src/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token"); // Check if token exists

  if (!isAuthenticated) {
    return <Navigate to="/SignIn" replace />; // Redirect to SignIn page
  }

  return children; // Otherwise, show the page
};

export default ProtectedRoute;
