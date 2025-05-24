import { Link } from "react-router";

const Home = () => {
  return (
    <section className="w-full h-screen flex flex-col gap-4 justify-center items-center text-white">
      <h1 className="text-2xl font-black">Welcome to Transactions Logs</h1>
      <Link to="/authentication/registration">
        Let's get you registered first.
      </Link>
    </section>
  );
};

export default Home;
