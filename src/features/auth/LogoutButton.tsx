import { buttonSecondary } from "../../app/globalClasses";
import { useDispatch } from "react-redux";
import { logout } from "./authSlice";

const LogoutButton = () => {
  const dispatch = useDispatch();
  return (
    <button
      aria-label="Logout user"
      role="button"
      className={buttonSecondary}
      onClick={() => dispatch(logout())}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
