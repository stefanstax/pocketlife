import { FaMoneyBillWave } from "@react-icons/all-files/fa/FaMoneyBillWave";
import { FaGraduationCap } from "@react-icons/all-files/fa/FaGraduationCap";
import { FaStore } from "@react-icons/all-files/fa/FaStore";
import { FaBox } from "@react-icons/all-files/fa/FaBox";
import { SiPorkbun } from "react-icons/si";
import { FaServer } from "@react-icons/all-files/fa/FaServer";
import { MdEmail } from "@react-icons/all-files/md/MdEmail";
import { FaBook } from "@react-icons/all-files/fa/FaBook";
import { FaRobot } from "@react-icons/all-files/fa/FaRobot";

const ICON_OPTIONS = [
  { name: "SERVERS", icon: <FaServer /> },
  { name: "AI", icon: <FaRobot /> },
  { name: "SEO", icon: <FaBook /> },
  { name: "EMAILS", icon: <MdEmail /> },
  { name: "INVOICES", icon: <FaMoneyBillWave /> },
  { name: "SHIPPING", icon: <FaBox /> },
  { name: "DOMAINS", icon: <SiPorkbun /> },
  { name: "FEES", icon: <FaMoneyBillWave /> },
  { name: "EDUCATION", icon: <FaGraduationCap /> },
  { name: "SOFTWARE", icon: <FaStore /> },
];

const IconPicker = ({
  value,
  setIcon,
}: {
  value: string;
  setIcon: (value: string) => void;
}) => {
  return (
    <div className="w-full flex flex-wrap gap-2 p-2 bg-[#2A2B3D]">
      {ICON_OPTIONS.map(({ name, icon }) => (
        <button
          type="button"
          key={name}
          onClick={() => setIcon(name)}
          className={`p-2 text-sm min-w-fit cursor-pointer flex gap-2 items-center justify-center ${
            name === value ? "bg-[#1A1A2E] text-white" : ""
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
