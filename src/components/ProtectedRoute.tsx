import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import type { RootState } from "../app/store";

const ProtectedRoute = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return isAuthenticated ? <Outlet /> : <Navigate to="/authentication/login" />;
};

export default ProtectedRoute;
