import { Link } from "react-router";
import { SECONDARY, SHARED } from "../app/globalClasses";
import LoginForm from "../features/authentication/login/LoginForm";

const Login = () => {
  return (
    <section className="w-full flex justify-center items-center flex-col text-white gap-4">
      <div className="min-w-full lg:min-w-[600px] flex flex-col items-start justify-start gap-4">
        <LoginForm />
        <p className="text-sm">Forgot passcode: /recovery/YOUR-SECRET-URL</p>
        <p>OR</p>
        <Link
          className={`w-full lg:w-fit ${SECONDARY} ${SHARED}`}
          to="/authentication/registration"
        >
          Create account
        </Link>
      </div>
    </section>
  );
};

export default Login;
