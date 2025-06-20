import { Link } from "react-router";
import { PRIMARY, SECONDARY, SHARED } from "../app/globalClasses";

// Revise at one point
const VariantLink = ({
  aria,
  label,
  variant,
  link,
  external,
}: {
  aria: string;
  external?: boolean;
  variant: "PRIMARY" | "SECONDARY";
  label: string;
  link: string;
}) => {
  return (
    <Link
      to={link}
      target={external ? "_blank" : "_self"}
      className={`${SHARED} ${variant === "PRIMARY" ? PRIMARY : SECONDARY}`}
      aria-label={aria}
    >
      {label}
    </Link>
  );
};

export default VariantLink;
