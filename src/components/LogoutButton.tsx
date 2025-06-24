import { useDispatch } from "react-redux";
import { logout } from "../app/authSlice";
import { SECONDARY, SHARED } from "../app/globalClasses";

const LogoutButton = () => {
  const dispatch = useDispatch();
  return (
    <button
      aria-label="Logout user"
      role="button"
      className={`${SECONDARY} ${SHARED}`}
      onClick={() => dispatch(logout())}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
