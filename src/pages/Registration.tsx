import { Link } from "react-router";
import RegistrationForm from "../features/registration/RegistrationForm";
import { buttonSecondary } from "../app/globalClasses";

const Registration = () => {
  return (
    <section className="w-full flex justify-center items-center flex-col gap-4">
      <div className="min-w-[600px] flex flex-col items-center justify-center gap-4">
        <RegistrationForm />
        <p className="text-white">OR</p>
        <Link
          className={`min-w-[200px] ${buttonSecondary}`}
          to="/authentication/login"
        >
          Login
        </Link>
      </div>
    </section>
  );
};

export default Registration;
