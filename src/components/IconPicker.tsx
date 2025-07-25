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
import { PiCarrot } from "react-icons/pi";
import { TbHomeShield } from "react-icons/tb";
import { IoRestaurantOutline } from "react-icons/io5";
import { LuPill } from "react-icons/lu";
import { LuBicepsFlexed } from "react-icons/lu";
import { PiBeachBall } from "react-icons/pi";
import { IoCarSportOutline } from "react-icons/io5";
import { PiTShirt } from "react-icons/pi";
import { BsHeartPulse } from "react-icons/bs";
import { IoGameControllerOutline } from "react-icons/io5";

const ICON_OPTIONS = [
  { name: "GROCERIES", icon: <PiCarrot /> },
  { name: "GAMING", icon: <IoGameControllerOutline /> },
  { name: "HOME", icon: <TbHomeShield /> },
  { name: "HAMBURGER", icon: <IoRestaurantOutline /> },
  { name: "CAR", icon: <IoCarSportOutline /> },
  { name: "TAXI", icon: <FaTaxi /> },
  { name: "INNSURANCE", icon: <FaShieldAlt /> },
  { name: "HOUSEHOLD", icon: <GiBroom /> },
  { name: "KIDS", icon: <FaChild /> },
  { name: "FEES", icon: <FaMoneyBillWave /> },
  { name: "MISC", icon: <MdMiscellaneousServices /> },
  { name: "GYM", icon: <LuBicepsFlexed /> },
  { name: "GIFTS", icon: <FaGift /> },
  { name: "PETS", icon: <FaDog /> },
  { name: "EDUCATION", icon: <FaGraduationCap /> },
  { name: "ENTERTAINMENT", icon: <FaGamepad /> },
  { name: "CLOTHING", icon: <PiTShirt /> },
  { name: "TRAVEL", icon: <PiBeachBall /> },
  { name: "HEALTH", icon: <BsHeartPulse /> },
  { name: "PHARMACY", icon: <LuPill /> },
];

const IconPicker = ({
  value,
  setIcon,
}: {
  value: string;
  setIcon: (value: string) => void;
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {ICON_OPTIONS.map(({ name, icon }) => (
        <button
          type="button"
          key={name}
          onClick={() => setIcon(name)}
          className={`p-2 border-1 text-[20px] rounded cursor-pointer flex justify-center ${
            name === value ? "bg-[#5152fb] text-white" : ""
          }`}
          title={name}
        >
          {icon}
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
