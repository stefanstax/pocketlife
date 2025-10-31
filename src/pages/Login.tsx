import { Link } from "react-router";
import { SECONDARY, SHARED } from "../app/globalClasses";
import LoginForm from "../features/authentication/login/LoginForm";

const Login = () => {
  return (
    <section className="w-full h-full flex justify-center items-center flex-col text-white gap-4">
      <div className="min-w-full lg:min-w-[800px] flex flex-col items-start justify-start gap-4">
        <h1 className="text-2xl font-black">Login</h1>
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
