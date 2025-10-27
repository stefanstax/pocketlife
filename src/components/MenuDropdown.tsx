import { type Dispatch, type SetStateAction } from "react";
import { links } from "./navigationLinks";
import { NavLink } from "react-router";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { SECONDARY, SHARED, TERTIARY } from "../app/globalClasses";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

const MenuDropdown = ({
  user,
  token,
  isMenuExpanded,
  handleMenuExpand,
  expandParentLink,
  setExpandParentLink,
}: {
  user: string;
  token: string;
  isMenuExpanded: boolean;
  handleMenuExpand: (value) => void;
  expandParentLink: string | null;
  setExpandParentLink: Dispatch<SetStateAction<string | null>>;
}) => {
  const parentLinks = links.filter((link) => link?.hasChildren == true);
  const childrenLinks = links.filter(
    (link) => link?.parent === expandParentLink
  );

  return (
    <div
      className={`w-full ${
        isMenuExpanded ? "flex" : "hidden"
      } lg:flex flex-col gap-4`}
    >
      <div className={`w-full flex flex-col items-start gap-2`}>
        {parentLinks?.map((link) => {
          return (
            <div
              key={link?.url}
              className={`w-full flex flex-wrap gap-2 items-center justify-between ${
                link.hasChildren && "border-b-1 border-[#1a2630] pb-2"
              }`}
            >
              <NavLink
                to={link?.url}
                onClick={() => setExpandParentLink(null)}
                className={({ isActive }) =>
                  `flex items-center text-white ${isActive ? "font-bold" : ""}`
                }
              >
                {link?.label}{" "}
              </NavLink>
              <span
                className="text-white"
                onClick={() => {
                  handleMenuExpand(link);
                }}
              >
                {expandParentLink === link?.url ? (
                  <FaChevronUp className="animate-pulse" />
                ) : (
                  <FaChevronDown />
                )}
              </span>

              {expandParentLink === link.url && (
                <div className="w-full flex flex-col gap-2 mt-2">
                  {childrenLinks.map((childLink) => (
                    <NavLink
                      key={childLink.url}
                      to={childLink.url}
                      onClick={() => setExpandParentLink(null)} // close dropdown when child clicked
                      className="text-white text-sm flex gap-2 items-center border-l-4 border-[#1a2630] pl-3"
                    >
                      {childLink.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Authentication Buttons */}
      <div className="flex flex-col gap-2">
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
            className={`${TERTIARY} ${SHARED} min-w-[100px]`}
            to={`/users/${user}`}
          >
            Edit Profile
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default MenuDropdown;
