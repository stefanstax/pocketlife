import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import type { RootState } from "../app/store";

const AdminRoute = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return user?.email === import.meta.env.VITE_ADMIN_EMAIL ? (
    <Outlet />
  ) : (
    <Navigate to="/authentication/login" />
  );
};

export default AdminRoute;
