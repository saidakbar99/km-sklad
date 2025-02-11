import { Navigate } from 'react-router-dom';

export const roleRedirects = {
  warehouse: "/balance",
  security: "/release",
};

export const DefaultRedirect = () => {
  const userRole = localStorage.getItem("role");
  return <Navigate to={roleRedirects[userRole] || "/login"} replace />;
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  // const token = localStorage.getItem('token');
  // const userRole = localStorage.getItem('role');
  // const location = useLocation();

  // if (!token) {
  //   return <Navigate to="/login" replace />;
  // }

  // if (!allowedRoles.includes(userRole)) {
  //   return <Navigate to={roleRedirects[userRole] || "/"} state={{ from: location }} replace />;
  // }

  return children;
};

export default ProtectedRoute;
