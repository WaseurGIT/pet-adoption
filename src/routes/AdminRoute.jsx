import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import Swal from "sweetalert2";

const AdminRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; // or spinner
  }

  if (!user || user.role !== "admin") {
    Swal.fire({
      icon: "error",
      title: "Access Denied",
      text: "You are not authorized to access this page",
    });
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
