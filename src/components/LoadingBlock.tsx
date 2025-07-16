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
        <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-sm flex items-center justify-center animate-pulse rounded-md" />
      )}
      {children}
    </div>
  );
};

export default LoadingBlock;
