import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { Link, NavLink, useLocation } from "react-router";
import LoginButton from "./LoginButton";
import { SECONDARY, SHARED } from "../app/globalClasses";
import LogoutButton from "./LogoutButton";
import { IoLockClosed } from "react-icons/io5";

const Navigation = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);

  const links = [
    {
      path: "/transactions",
      visibleForGuest: true,
      label: "Transactions",
    },
    {
      path: "/select-currencies",
      visibleForGuest: true,
      label: "Toggle Currencies",
    },
    {
      path: "/currencies",
      visibleForGuest: false,
      label: "Manage Currencies",
    },
    {
      path: "/links",
      visibleForGuest: false,
      label: "Links",
    },
    {
      path: "/storage",
      visibleForGuest: false,
      label: "Storage",
    },
  ];

  return (
    <nav className="w-full mx-auto p-4 bg-gray-800 lg:gap-4 flex flex-wrap items-center justify-between">
      <h1 className="text-2xl text-gray-200 font-black">PocketLife</h1>
      <div className="navigation flex flex-wrap text-gray-300  items-center gap-4">
        {links.map((link) => {
          return (
            <NavLink
              key={link?.path}
              to={link?.path}
              className={({ isActive }) =>
                `flex gap-2 items-center ${
                  isActive
                    ? "text-blue-600"
                    : !link?.visibleForGuest
                    ? "opacity-50"
                    : "text-gray-200"
                }`
              }
            >
              {!link?.visibleForGuest && <IoLockClosed />}
              {link?.label}
            </NavLink>
          );
        })}
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
