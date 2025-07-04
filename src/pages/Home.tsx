import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { Link } from "react-router";
import { PRIMARY, SHARED } from "../app/globalClasses";

const Home = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);

  return (
    <section className="w-full flex flex-col gap-4 justify-center items-center">
      {token ? (
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-black">Oh hey, {user?.username}</h1>
          <p>Where would you like to go</p>
          <Link to="/transactions" className={`${PRIMARY} ${SHARED}`}>
            Transactions
          </Link>
        </div>
      ) : (
        <h1 className="text-2xl font-black">Where would you like to go?</h1>
      )}
    </section>
  );
};

export default Home;
