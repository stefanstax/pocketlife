import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { MenuButtonActive, MenuButtonDefault } from "../app/globalClasses";
import { useState } from "react";
import MenuDropdown from "./MenuDropdown";

const MobileNavigation = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [expandParentLink, setExpandParentLink] = useState<string | null>(null);

  const handleMenuExpand = (link) => {
    if (expandParentLink === link?.url) {
      setExpandParentLink(null);
    } else {
      setExpandParentLink(link?.url);
    }
  };

  return (
    <nav className="w-full">
      <div className="w-full mx-auto gap-4 flex flex-col items-start justify-start">
        <div className="w-full flex justify-between items-center">
          <h1 className="text-2xl text-[#C4C6FF] font-black">
            <a href="/">MAYPACT</a>
          </h1>
          <button
            onClick={() => setIsMenuExpanded(!isMenuExpanded)}
            className={`${
              isMenuExpanded ? MenuButtonActive : MenuButtonDefault
            }`}
          >
            Menu
          </button>
        </div>

        <MenuDropdown
          user={user?.id}
          token={token}
          isMenuExpanded={isMenuExpanded}
          handleMenuExpand={handleMenuExpand}
          expandParentLink={expandParentLink}
          setExpandParentLink={setExpandParentLink}
        />
      </div>
    </nav>
  );
};

export default MobileNavigation;
