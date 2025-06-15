import { Link } from "react-router";
import { buttonSecondary, buttonSolid } from "../app/globalClasses";

// Revise at one point
const VariantLink = ({
  aria,
  type,
  label,
  variant,
  link,
  external,
  role,
}: {
  aria: string;
  external?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
  variant: "PRIMARY" | "SECONDARY";
  label: string;
  link?: string;
  role?: string;
}) => {
  return (
    <>
      {link ? (
        <Link
          to={link}
          target={external ? "_blank" : "_self"}
          className={variant === "PRIMARY" ? buttonSolid : buttonSecondary}
          aria-label={aria}
        >
          {label}
        </Link>
      ) : (
        <button
          className={variant === "PRIMARY" ? buttonSolid : buttonSecondary}
          role={role}
          aria-label={aria}
          type={type}
        >
          {label}
        </button>
      )}
    </>
  );
};

export default VariantLink;
