import { Link } from "react-router";
import { SECONDARY, SHARED } from "../app/globalClasses";

const LoginButton = () => {
  return (
    <Link
      aria-label="Go to login page"
      className={`${SECONDARY} ${SHARED}`}
      to="authentication/login"
    >
      Login
    </Link>
  );
};

export default LoginButton;
