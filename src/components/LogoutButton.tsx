import { useDispatch } from "react-redux";
import { logout } from "../app/authSlice";
import { PRIMARY, SHARED } from "../app/globalClasses";

const LogoutButton = () => {
  const dispatch = useDispatch();
  return (
    <button
      aria-label="Logout user"
      role="button"
      className={`${PRIMARY} ${SHARED} flex-1 min-w-[100px]`}
      onClick={() => dispatch(logout())}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
