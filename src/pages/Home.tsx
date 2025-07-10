import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { Link } from "react-router";

const Home = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);

  return (
    <section className="w-full flex flex-col gap-4 justify-center items-center">
      {token ? (
        <div className="flex flex-col gap-10 items-center">
          <h1 className="text-6xl font-black">
            {user?.username}, what shall we do today?
          </h1>
          <div className="grid grid-cols-4 gap-4">
            <Link
              to="/transactions"
              className="flex flex-col bg-gray-950 rounded-lg shadow-2xl relative hover:rotate-z-6 transition-all"
            >
              <img
                className="rounded-lg"
                src="src/assets/images/transactions-tab.webp"
                alt=""
              />
              <h3 className="text-white text-2xl font-bold text-center absolute bottom-0 bg-[#30303080] backdrop-blur-sm w-full py-4 rounded-b-lg">
                Transactions
              </h3>
            </Link>
            <Link
              to="/transactions"
              className="flex flex-col bg-gray-950 opacity-50 pointer-events-none rounded-lg shadow-2xl relative hover:rotate-z-6 transition-all"
            >
              <img
                className="rounded-lg"
                src="src/assets/images/transactions-tab.webp"
                alt=""
              />
              <h3 className="text-white text-2xl font-bold text-center absolute bottom-0 bg-[#30303080] backdrop-blur-sm w-full py-4 rounded-b-lg">
                Links
              </h3>
            </Link>
            <Link
              to="/transactions"
              className="flex flex-col bg-gray-950 opacity-50 pointer-events-none rounded-lg shadow-2xl relative hover:rotate-z-6 transition-all"
            >
              <img
                className="rounded-lg"
                src="src/assets/images/transactions-tab.webp"
                alt=""
              />
              <h3 className="text-white text-2xl font-bold text-center absolute bottom-0 bg-[#30303080] backdrop-blur-sm w-full py-4 rounded-b-lg">
                Storage Files
              </h3>
            </Link>
            <Link
              to="/transactions"
              className="flex flex-col bg-gray-950 opacity-50 pointer-events-none rounded-lg shadow-2xl relative hover:rotate-z-6 transition-all"
            >
              <img
                className="rounded-lg"
                src="src/assets/images/transactions-tab.webp"
                alt=""
              />
              <h3 className="text-white text-2xl font-bold text-center absolute bottom-0 bg-[#30303080] backdrop-blur-sm w-full py-4 rounded-b-lg">
                Notes
              </h3>
            </Link>
          </div>
          {/* Links */}
          {/* Storage Files */}
          {/* Notes */}
        </div>
      ) : (
        <h1 className="text-2xl font-black">Where would you like to go?</h1>
      )}
    </section>
  );
};

export default Home;
