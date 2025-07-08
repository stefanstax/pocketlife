import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { NavLink, useLocation, useNavigate } from "react-router";
import LoginButton from "./LoginButton";
import { SECONDARY, SHARED } from "../app/globalClasses";
import LogoutButton from "./LogoutButton";
import { FaLock, FaArrowLeft } from "react-icons/fa6";
import { links } from "./navigationLinks";

const Navigation = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);

  const location = useLocation();
  const navigate = useNavigate();

  const childrenLinks = links.filter((link) => link?.child === true);
  const parentLinks = links.filter((link) => link?.child === false);

  return (
    <nav className="w-full">
      <div className="w-full mx-auto p-4 bg-gray-950 lg:gap-4 flex flex-wrap items-center justify-start">
        <h1 className="text-2xl text-gray-200 font-black">PocketLife</h1>

        <div className={`hidden items-center gap-4 lg:flex`}>
          {parentLinks?.map((link) => {
            return (
              <NavLink
                key={link?.url}
                to={link?.url}
                className={({ isActive }) =>
                  `flex gap-2 items-center ${
                    user?.email !== import.meta.env.VITE_ADMIN_EMAIL
                      ? "opacity-50 pointer-events-none"
                      : null
                  } ${isActive ? "text-blue-200" : "text-white"}`
                }
              >
                {(link?.locked || user?.email) &&
                  user?.email !== import.meta.env.VITE_ADMIN_EMAIL && (
                    <FaLock />
                  )}
                {link?.label}
              </NavLink>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2 ml-auto">
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
      </div>
      <div className="w-full lg:hidden overflow-x-auto lg:overflow-x-hidden flex items-center gap-4 justify-start lg:justify-center bg-gray-950 p-4 text-white font-[500] text-center">
        {parentLinks?.map((link) => {
          return (
            <NavLink
              key={link?.url}
              to={link?.url}
              className={({ isActive }) =>
                `flex lg:hidden gap-2 items-center ${
                  user?.email !== import.meta.env.VITE_ADMIN_EMAIL
                    ? "opacity-50 pointer-events-none"
                    : null
                } ${isActive ? "opacity-50 pointer-events-none" : "text-white"}`
              }
            >
              {(link?.locked || user?.email) &&
                user?.email !== import.meta.env.VITE_ADMIN_EMAIL && <FaLock />}
              {link?.label}
            </NavLink>
          );
        })}
      </div>
      {location?.pathname !== "/" && (
        <div className="w-full overflow-x-auto lg:overflow-x-hidden flex items-center gap-4 justify-start lg:justify-center bg-gray-950 p-4 text-white font-[500] text-center">
          {location?.pathname !== "/" && (
            <button
              aria-label="Go to previous page"
              onClick={() => navigate(-1)}
              className="text-sm flex items-center gap-2 cursor-pointer"
            >
              <FaArrowLeft /> Back
            </button>
          )}

          {childrenLinks.map((link) => {
            if (location?.pathname.includes(link?.parent)) {
              return (
                <NavLink
                  key={link?.url}
                  className={`min-w-fit text-sm ${
                    link.locked ||
                    (user?.email !== import.meta.env.VITE_ADMIN_EMAIL &&
                      "opacity-50 pointer-events-none")
                  } ${
                    location?.pathname === link?.url &&
                    "opacity-50 pointer-events-none"
                  }`}
                  to={link?.url}
                >
                  {link?.label}
                </NavLink>
              );
            }
          })}
        </div>
      )}
    </nav>
  );
};

export default Navigation;
