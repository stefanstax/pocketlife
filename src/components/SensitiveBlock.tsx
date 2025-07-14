import { type ReactNode } from "react";
import { FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";

const SensitiveBlock = ({
  children,
  privacy,
  setPrivacy,
}: {
  children: ReactNode;
  privacy: boolean;
  setPrivacy: (value: boolean) => void;
}) => {
  const togglePrivacy = () => {
    setPrivacy(false);
    toast.info("Privacy off for 5 seconds.");

    setTimeout(() => {
      setPrivacy(true);
    }, 5000);
  };
  return (
    <div className="relative">
      <div
        className={`${
          privacy ? "absolute" : "hidden"
        } w-full h-full flex justify-center items-center bg-gray-950 text-white rounded-lg`}
      >
        <FiEyeOff onClick={togglePrivacy} />
      </div>
      {children}
    </div>
  );
};

export default SensitiveBlock;
