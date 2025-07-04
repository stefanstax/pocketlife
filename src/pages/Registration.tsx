import { Link } from "react-router";
import RegistrationForm from "../features/authentication/registration/RegistrationForm";
import { SECONDARY, SHARED } from "../app/globalClasses";

const Registration = () => {
  return (
    <section className="w-full flex justify-center items-center flex-col gap-4">
      <div className="min-w-full lg:min-w-[600px] flex flex-col items-center justify-center gap-4">
        <RegistrationForm />
        <p>OR</p>
        <Link
          className={`min-w-full ${SECONDARY} ${SHARED}`}
          to="/authentication/login"
        >
          Login
        </Link>
      </div>
    </section>
  );
};

export default Registration;
