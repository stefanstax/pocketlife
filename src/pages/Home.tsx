import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { Link } from "react-router";
import { FaLock } from "react-icons/fa";

const Home = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);

  const BlockImage = ({ src, alt }: { src: string; alt: string }) => {
    return (
      <img
        className="rounded-lg h-[300px] object-cover"
        src={src}
        alt={alt ?? ""}
      />
    );
  };

  return (
    <section className="w-full flex flex-col gap-4 justify-center items-center">
      <div className="flex flex-col gap-10 items-center">
        <h1 className="text-4xl lg:text-8xl font-black">{user?.username}</h1>
        <h2 className="text-2xl lg:text-4xl font-bold">
          What shall we do today?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/transactions"
            className="flex flex-col bg-gray-950 rounded-lg shadow-[0_35px_35px_rgba(0,0,0,0.6)] relative hover:ring-4 transition-all"
          >
            <BlockImage src="src/assets/images/transactions-tab.webp" alt="" />
            <h3 className="text-white text-2xl font-bold text-center absolute bottom-0 bg-[#30303080] backdrop-blur-sm w-full py-4 rounded-b-lg">
              Transactions
            </h3>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Home;
