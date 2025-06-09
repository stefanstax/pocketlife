import { useSelector } from "react-redux";
import { Link } from "react-router";
import type { RootState } from "../app/store";

const Home = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  return (
    <section className="w-full flex flex-col gap-4 justify-center items-center text-white">
      {isAuthenticated ? (
        <h1>Oh hey, {user?.username}</h1>
      ) : (
        <h1 className="text-2xl font-black">Where would you like to go?</h1>
      )}{" "}
      <Link to="/authentication/registration">
        Let's get you registered first.
      </Link>
      <Link to="/authentication/login">Already registered, log in</Link>
    </section>
  );
};

export default Home;
