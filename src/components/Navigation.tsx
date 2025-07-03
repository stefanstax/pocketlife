import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { Link } from "react-router";
import LoginButton from "./LoginButton";
import { PRIMARY, SHARED } from "../app/globalClasses";

const Navigation = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);

  return (
    <nav className="w-11/12 lg:w-10/12 mx-auto gap-4 grid grid-cols-2 lg:grid-cols-4 items-center justify-center">
      <Link to="/transactions/" className={`${PRIMARY} ${SHARED}`}>
        Transactions
      </Link>
      {user?.email === import.meta.env.VITE_ADMIN_EMAIL && (
        <Link to="/currencies/" className={`${PRIMARY} ${SHARED}`}>
          Manage Currencies
        </Link>
      )}
      <Link to="/select-currencies/" className={`${PRIMARY} ${SHARED}`}>
        Toggle Currencies
      </Link>
      {!token && <LoginButton />}
    </nav>
  );
};

export default Navigation;
