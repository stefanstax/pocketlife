import type { ReactNode } from "react";

export interface ButtonProps {
  ariaLabel: string;
  extraClasses?: string;
  variant: "PRIMARY" | "SECONDARY" | "TERTIARY";
  children: ReactNode;
  onClick?: () => void;
}

const SHARED =
  "px-4 py-2 min-h-[52px] border-2 rounded-sm flex gap-2 items-center justify-center";
const PRIMARY =
  "bg-[#5152fb] border-[#5152fb] text-white hover:bg-white hover:text-[#5152fb]";
const SECONDARY =
  "bg-white text-[#5152fb] border-white hover:bg-[#5152fb] hover:text-white";
const TERTIARY =
  "bg-transparent border-2 border-white text-white hover:bg-[#5152fb] hover:border-[#5152fb]";

const Button = ({
  ariaLabel,
  extraClasses,
  variant,
  children,
  onClick,
}: ButtonProps) => {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={`${
        variant === "PRIMARY"
          ? PRIMARY
          : variant === "SECONDARY"
          ? SECONDARY
          : variant === "TERTIARY"
          ? TERTIARY
          : ""
      } ${SHARED} ${extraClasses}`}
    >
      {children}
    </button>
  );
};

export default Button;
