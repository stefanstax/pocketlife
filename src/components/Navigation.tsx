import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { Link } from "react-router";
import LoginButton from "./LoginButton";
import { SECONDARY, SHARED } from "../app/globalClasses";
import LogoutButton from "./LogoutButton";
import { IoLockClosed } from "react-icons/io5";

const Navigation = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const currentURL = window.location.href;

  return (
    <nav className="w-full mx-auto p-4 bg-gray-800 lg:gap-4 flex flex-wrap items-center justify-between">
      <h1 className="text-2xl text-gray-400 font-black">PocketLife</h1>
      <div className="navigation flex flex-wrap text-gray-300  items-center gap-4">
        <Link
          to="/transactions/"
          className={`hover:text-[#5152fb] p-3 rounded-lg font-bold`}
        >
          Transactions
        </Link>
        {user?.email === import.meta.env.VITE_ADMIN_EMAIL && (
          <Link
            to="/currencies/"
            className=" hover:text-[#5152fb] p-3 rounded-lg font-bold"
          >
            Manage Currencies
          </Link>
        )}
        <Link
          to="/select-currencies/"
          className=" hover:text-[#5152fb] p-3 rounded-lg font-bold"
        >
          Toggle Currencies
        </Link>
        <Link to="#" className=" flex items-center gap-2  opacity-50 font-bold">
          <IoLockClosed />
          Links
        </Link>
        <Link to="#" className="flex gap-2 items-center  opacity-50 font-bold">
          <IoLockClosed />
          Storage
        </Link>
      </div>
      <div className="flex flex-wrap gap-2">
        {!token && (
          <>
            <Link
              to="/authentication/registration"
              className={`${SECONDARY} ${SHARED}`}
            >
              Sign Up
            </Link>
            <LoginButton />
          </>
        )}
        {token && <LogoutButton />}
      </div>
    </nav>
  );
};

export default Navigation;
