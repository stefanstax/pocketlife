import { Link } from "react-router";
import { buttonSolid } from "../../app/globalClasses";

const LoginButton = () => {
  return (
    <Link
      aria-label="Go to login page"
      className={buttonSolid}
      to="authentication/login"
    >
      Login
    </Link>
  );
};

export default LoginButton;
