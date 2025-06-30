import { Link } from "react-router";
import { SECONDARY } from "../app/globalClasses";
import LoginForm from "../features/authentication/login/LoginForm";

const Login = () => {
  return (
    <section className="w-full flex justify-center items-center flex-col gap-4">
      <div className="min-w-full lg:min-w-[600px] flex flex-col items-center justify-center gap-4">
        <LoginForm />
        <Link className={SECONDARY} to="/authentication/registration">
          Create account
        </Link>
      </div>
    </section>
  );
};

export default Login;
