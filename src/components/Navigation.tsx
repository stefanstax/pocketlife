import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { NavLink, useLocation } from "react-router";
import LoginButton from "./LoginButton";
import { PRIMARY, SECONDARY, SHARED } from "../app/globalClasses";
import LogoutButton from "./LogoutButton";
import { links } from "./navigationLinks";

const Navigation = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);

  const location = useLocation();

  const childrenLinks = links.filter(
    (link) => link?.child === true && link?.admin === false
  );
  const parentLinks = links.filter(
    (link) => link?.child === false && link?.admin === false
  );

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
                  `flex gap-2 items-center text-white ${
                    isActive ? "font-bold" : ""
                  }`
                }
              >
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
          {token && (
            <NavLink
              className={`${PRIMARY} ${SHARED} min-w-[100px]`}
              to={`/users/${user?.id}`}
            >
              Edit Profile
            </NavLink>
          )}
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
                  isActive ? "font-bold" : ""
                }`
              }
            >
              {link?.label}
            </NavLink>
          );
        })}
      </div>
      {location?.pathname !== "/" && (
        <div className="w-full overflow-x-auto lg:overflow-x-hidden flex items-center gap-4 justify-start lg:justify-center bg-gray-950 p-4 text-white font-[500] text-center">
          {/* {location?.pathname !== "/" && (
            <button
              aria-label="Go to previous page"
              onClick={() => navigate(-1)}
              className="text-sm flex items-center gap-2 cursor-pointer"
            >
              <FaArrowLeft /> Back
            </button>
          )} */}

          {childrenLinks.map((link) => {
            return (
              <NavLink
                key={link?.url}
                className={`min-w-fit text-sm`}
                to={link?.url}
              >
                {link?.label}
              </NavLink>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default Navigation;
