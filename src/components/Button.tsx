import type { ReactNode } from "react";
import { PRIMARY, SECONDARY, SHARED, TERTIARY } from "../app/globalClasses";

export interface ButtonProps {
  ariaLabel: string;
  extraClasses?: string;
  variant: "PRIMARY" | "SECONDARY" | "TERTIARY";
  children: ReactNode;
  onClick?: () => void;
  type: "button" | "submit" | "reset";
}

const Button = ({
  ariaLabel,
  extraClasses,
  variant,
  children,
  type,
  onClick,
}: ButtonProps) => {
  return (
    <button
      type={type ?? "button"}
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
