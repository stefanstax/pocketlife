import type { ReactNode } from "react";
import { SHARED, TERTIARY } from "../app/globalClasses";

const DefaultModal = ({
  showModal,
  children,
  onCancel,
}: {
  showModal: boolean;
  children: ReactNode;
  onCancel: () => void;
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-[#171717]/75 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-white flex flex-wrap gap-3 p-6 shadow-xl max-w-md w-full mx-4">
        {children}
        <button onClick={onCancel} className={`${TERTIARY} ${SHARED} flex-1`}>
          Close
        </button>
      </div>
    </div>
  );
};

export default DefaultModal;
