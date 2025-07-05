import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { NavLink } from "react-router";
import LoginButton from "./LoginButton";
import { PRIMARY, SECONDARY, SHARED } from "../app/globalClasses";
import LogoutButton from "./LogoutButton";
import { IoLockClosed } from "react-icons/io5";
import { useState } from "react";
import { AiOutlineMenuFold } from "react-icons/ai";
import { FaReceipt } from "react-icons/fa6";
import { MdCurrencyExchange } from "react-icons/md";
import { VscIndent } from "react-icons/vsc";
import { IoIosCheckbox } from "react-icons/io";

const Navigation = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [showNav, setShowNav] = useState(false);

  const links = [
    {
      path: "/transactions",
      visibleForGuest: true,
      showInMainNav: true,
      hasParent: false,
      label: "Transactions",
      icon: <FaReceipt />,
    },
    {
      path: "/transactions/add",
      visibleForGuest: true,
      showInMainNav: false,
      hasParent: true,
      label: "Add Transaction",
    },
    {
      path: "/select-currencies",
      visibleForGuest: true,
      showInMainNav: true,
      hasParent: false,
      label: "Toggle Currencies",
      icon: <IoIosCheckbox />,
    },
    {
      path: "/currencies",
      visibleForGuest: false,
      showInMainNav: true,
      hasParent: false,
      label: "Currencies",
      icon: <MdCurrencyExchange />,
    },
    {
      path: "/currencies/add",
      visibleForGuest: false,
      showInMainNav: false,
      hasParent: true,
      label: "Add Currency",
    },
    {
      path: "/links",
      visibleForGuest: true,
      showInMainNav: true,
      hasParent: false,
      label: "Links",
    },
    {
      path: "/storage",
      visibleForGuest: true,
      showInMainNav: true,
      hasParent: false,
      label: "Storage",
    },
    {
      path: "/payment-methods",
      visibleForGuest: true,
      showInMainNav: true,
      hasParent: false,
      label: "Payment Methods",
    },
    {
      path: "/payment-methods/add",
      visibleForGuest: true,
      showInMainNav: false,
      hasParent: true,
      label: "Add Payment Method",
    },
  ];

  return (
    <nav className="w-full mx-auto p-4 bg-gray-950 h-[80px] lg:gap-4 flex flex-wrap items-center justify-between">
      <h1 className="text-2xl text-gray-200 font-black">PocketLife</h1>

      <div className={`flex text-gray-300 items-center gap-4 hidden lg:flex`}>
        {links.map((link) => {
          return (
            <NavLink
              key={link?.path}
              to={link?.path}
              className={({ isActive }) =>
                `flex gap-2 items-center ${
                  !link?.visibleForGuest &&
                  user?.email !== import.meta.env.VITE_ADMIN_EMAIL
                    ? "opacity-50 pointer-events-none"
                    : null
                } ${link?.showInMainNav ? "block" : "hidden"} ${
                  isActive ? "text-[#5152fb]" : "text-gray-200"
                }`
              }
            >
              {!link?.visibleForGuest &&
                user?.email !== import.meta.env.VITE_ADMIN_EMAIL && (
                  <IoLockClosed />
                )}
              {link?.icon} {link?.label}
            </NavLink>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        <AiOutlineMenuFold
          fontSize={30}
          onClick={() => setShowNav(!showNav)}
          className={`min-w-[50px] ${PRIMARY} ${SHARED}`}
        />
        {!token && (
          <>
            <NavLink
              to="/authentication/registration"
              className={`${SECONDARY} ${SHARED}`}
            >
              Sign Up
            </NavLink>
            <LoginButton />
          </>
        )}
        {token && <LogoutButton />}
      </div>
      <div
        className={`top-[80px] absolute left-0 w-full lg:w-[300px] min-h-[100dvh] bg-gray-950 flex flex-col z-99 p-10 text-gray-300 items-start gap-4 ${
          showNav === false && "hidden"
        }`}
      >
        {links.map((link) => {
          return (
            <NavLink
              key={link?.path}
              onClick={() => setShowNav(false)}
              to={link?.path}
              className={({ isActive }) =>
                `flex gap-2 items-center ${
                  !link?.visibleForGuest &&
                  user?.email !== import.meta.env.VITE_ADMIN_EMAIL
                    ? "opacity-50 pointer-events-none"
                    : null
                } ${isActive ? "text-[#5152fb]" : "text-gray-200"}`
              }
            >
              {!link?.visibleForGuest &&
                user?.email !== import.meta.env.VITE_ADMIN_EMAIL && (
                  <IoLockClosed />
                )}
              {link?.hasParent ? <VscIndent /> : null}
              {link?.icon} {link?.label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
