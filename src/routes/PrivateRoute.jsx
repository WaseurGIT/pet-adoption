import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

const PrivateRoute = ({ children, role: requiredRole }) => {
  const { user, role, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  if (!user) return <Navigate to="/login" replace />;

  if (requiredRole && role !== requiredRole) {
    return role === "admin" ? (
      <Navigate to="/dashboard/admin" replace />
    ) : (
      <Navigate to="/dashboard/user" replace />
    );
  }

  return children;
};

export default PrivateRoute;