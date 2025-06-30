import { Link } from "react-router";
import RegistrationForm from "../features/authentication/registration/RegistrationForm";
import { SECONDARY } from "../app/globalClasses";

const Registration = () => {
  return (
    <section className="w-full flex justify-center items-center flex-col gap-4">
      <div className="min-w-full lg:min-w-[600px] flex flex-col items-center justify-center gap-4">
        <RegistrationForm />
        <Link
          className={`min-w-[200px] ${SECONDARY}`}
          to="/authentication/login"
        >
          Login
        </Link>
      </div>
    </section>
  );
};

export default Registration;
