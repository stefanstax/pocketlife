import {
  FaTaxi,
  FaShieldAlt,
  FaChild,
  FaMoneyBillWave,
  FaGift,
  FaDog,
  FaGraduationCap,
  FaGamepad,
} from "react-icons/fa";
import { GiBroom } from "react-icons/gi";
import { MdMiscellaneousServices } from "react-icons/md";
import { LuPill } from "react-icons/lu";
import { PiHouseSimpleFill } from "react-icons/pi";
import { FaSteam } from "react-icons/fa6";
import { SiChromewebstore } from "react-icons/si";
import { RiShoppingBag3Fill } from "react-icons/ri";
import { GiMuscleFat } from "react-icons/gi";
import { IoMdRestaurant } from "react-icons/io";
import { IoRestaurant } from "react-icons/io5";
import { FaPlane } from "react-icons/fa";
import { GiHealthNormal } from "react-icons/gi";
import { FaCar } from "react-icons/fa";
import { FaTshirt } from "react-icons/fa";

const ICON_OPTIONS = [
  { name: "GROCERIES", icon: <RiShoppingBag3Fill /> },
  { name: "GAMING", icon: <FaSteam /> },
  { name: "HOME", icon: <PiHouseSimpleFill /> },
  { name: "HAMBURGER", icon: <IoRestaurant /> },
  { name: "CAR", icon: <FaCar /> },
  { name: "TAXI", icon: <FaTaxi /> },
  { name: "INNSURANCE", icon: <FaShieldAlt /> },
  { name: "DINEOUT", icon: <IoMdRestaurant /> },
  { name: "HOUSEHOLD", icon: <GiBroom /> },
  { name: "KIDS", icon: <FaChild /> },
  { name: "FEES", icon: <FaMoneyBillWave /> },
  { name: "MISC", icon: <MdMiscellaneousServices /> },
  { name: "GYM", icon: <GiMuscleFat /> },
  { name: "GIFTS", icon: <FaGift /> },
  { name: "PETS", icon: <FaDog /> },
  { name: "EDUCATION", icon: <FaGraduationCap /> },
  { name: "ENTERTAINMENT", icon: <FaGamepad /> },
  { name: "CLOTHING", icon: <FaTshirt /> },
  { name: "TRAVEL", icon: <FaPlane /> },
  { name: "HEALTH", icon: <GiHealthNormal /> },
  { name: "PHARMACY", icon: <LuPill /> },
  { name: "SOFTWARE", icon: <SiChromewebstore /> },
];

const IconPicker = ({
  value,
  setIcon,
}: {
  value: string;
  setIcon: (value: string) => void;
}) => {
  return (
    <div className="w-full flex gap-2 overflow-x-scroll">
      {ICON_OPTIONS.map(({ name, icon }) => (
        <button
          type="button"
          key={name}
          onClick={() => setIcon(name)}
          className={`p-2 border-1 text-xs font-bold rounded-full cursor-pointer flex gap-2 items-center justify-center ${
            name === value ? "bg-black text-white" : ""
          }`}
          title={name}
        >
          {icon} {name}
        </button>
      ))}
    </div>
  );
};

export default IconPicker;

export const IconShowcase = ({ pickedIcon }: { pickedIcon: string }) => {
  const chosenIcon = ICON_OPTIONS.filter((icon) => icon?.name === pickedIcon);
  return chosenIcon[0]?.icon;
};
