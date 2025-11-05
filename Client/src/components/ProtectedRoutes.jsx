import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loading } from "./Loading";

const ProtectedRoutes = ({ allowedRoles }) => {
  const role = sessionStorage.getItem("role");
  const { loading } = useAuth();

  if (loading) return <Loading fullscreen />;
  if (!role) return <Navigate to="/login" />;
  if (!allowedRoles.includes(role)) return <Navigate to="/" />;
  return <Outlet />;
};

export default ProtectedRoutes;
