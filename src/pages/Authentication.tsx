import { Link } from "react-router";
import { PRIMARY } from "../app/globalClasses";

const Authentication = () => {
  return (
    <section className="w-full flex justify-center items-center flex-col gap-4 text-white">
      <h1>Where would you like to go?</h1>
      <div className="flex gap-4 align-center">
        <Link to="/authentication/login" className={PRIMARY}>
          Login
        </Link>
        <Link to="/authentication/registration" className={PRIMARY}>
          Register
        </Link>
      </div>
    </section>
  );
};

export default Authentication;
