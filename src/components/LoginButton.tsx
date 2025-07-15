import { Link } from "react-router";
import { PRIMARY, SHARED } from "../app/globalClasses";

const LoginButton = () => {
  return (
    <Link
      aria-label="Go to login page"
      className={`${PRIMARY} ${SHARED}`}
      to="authentication/login"
    >
      Login
    </Link>
  );
};

export default LoginButton;
