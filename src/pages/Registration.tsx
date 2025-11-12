import { Link } from "react-router";
import RegistrationForm from "../features/authentication/registration/RegistrationForm";
import { SECONDARY, SHARED } from "../app/globalClasses";

const Registration = () => {
  return (
    <section className="w-full flex justify-center items-center flex-col text-white gap-4">
      <div className="w-full max-w-[600px] flex flex-col items-start justify-start gap-4">
        <RegistrationForm />
        <p>OR</p>
        <Link className={`${SECONDARY} ${SHARED}`} to="/authentication/login">
          Login
        </Link>
      </div>
    </section>
  );
};

export default Registration;
