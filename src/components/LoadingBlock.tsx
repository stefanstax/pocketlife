// TBD
import { type ReactNode } from "react";

const LoadingBlock = ({
  children,
  isLoading,
}: {
  children: ReactNode;
  isLoading: boolean;
}) => {
  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute w-full h-full bg-gray-950 rounded-lg z-9999"></div>
      )}
      {children}
    </div>
  );
};

export default LoadingBlock;
