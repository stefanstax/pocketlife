import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import type { RootState } from "../app/store";

const GuestRoute = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  } else {
    return <Outlet />;
  }
};

export default GuestRoute;
