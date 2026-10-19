
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

export default function ProtectedRoute() {
  const { user, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) return <Loader text="Checking your session..." />;

  if (!localStorage.getItem("token")) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
