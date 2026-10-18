import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "./Loader";
import { toast } from "react-toastify";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.user);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast.error("Please login to proceed");
    }
  }, [loading, isAuthenticated]);

  if (loading) return <Loader />;

  return isAuthenticated ? <Outlet /> : <Navigate to="/user/login" replace />;
};

export default ProtectedRoute;
