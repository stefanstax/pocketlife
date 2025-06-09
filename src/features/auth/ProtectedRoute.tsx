import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return isAuthenticated ? <Outlet /> : <Navigate to="/authentication/login" />;
};

export default ProtectedRoute;
