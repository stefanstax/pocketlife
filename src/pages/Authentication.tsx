import { Link } from "react-router";
import { buttonClasses } from "../app/globalClasses";

const Authentication = () => {
  return (
    <section className="w-full h-screen flex justify-center items-center flex-col gap-4 text-white">
      <h1 className="text-2xl font-black">Where would you like to go?</h1>
      <div className="flex gap-4 align-center">
        <Link to="/login" className={buttonClasses}>
          Login
        </Link>
        <Link to="/authentication/registration" className={buttonClasses}>
          Register
        </Link>
      </div>
    </section>
  );
};

export default Authentication;
