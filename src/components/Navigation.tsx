import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { Link } from "react-router";
import LoginButton from "./LoginButton";
import { PRIMARY, SHARED } from "../app/globalClasses";

const Navigation = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  console.log(user?.email);

  return (
    <nav className="w-full gap-4 min-h-[80px] flex items-center justify-center p-4">
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
      {!isAuthenticated && <LoginButton />}
    </nav>
  );
};

export default Navigation;
