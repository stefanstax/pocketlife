import type { ReactNode } from "react";
import { PRIMARY, SECONDARY, SHARED, TERTIARY } from "../app/globalClasses";

export interface ButtonProps {
  ariaLabel: string;
  extraClasses?: string;
  variant: "PRIMARY" | "SECONDARY" | "TERTIARY";
  children: ReactNode;
  onClick?: () => void;
}

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
