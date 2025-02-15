import { Navigate, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import { useEffect, useState } from 'react';

export const roleRedirects = {
  warehouse: "/balance",
  security: "/release",
  admin: "/balance"
};

export const DefaultRedirect = () => {
  const userRole = sessionStorage.getItem("role");
  return <Navigate to={roleRedirects[userRole] || "/login"} replace />;
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = sessionStorage.getItem('token');
  const userRole = sessionStorage.getItem('role');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={roleRedirects[userRole] || "/"} state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
