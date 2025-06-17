import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { Navigate, Outlet } from "react-router";

const AdminRoute = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return user?.email === "website@maypact.com" ? (
    <Outlet />
  ) : (
    <Navigate to="/authentication/login" />
  );
};

export default AdminRoute;
