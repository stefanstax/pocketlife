import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { Link } from "react-router";

const Home = () => {
  const { user } = useSelector((state: RootState) => state.auth);

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
    <section className="w-full h-[100vh] my-10 flex flex-col gap-4 justify-start items-center">
      <div className="flex flex-col gap-10 items-start">
        <h1 className="text-3xl font-black mb-10 text-white text-center">
          {user?.name ?? "Guest"}, what shall we do today?
        </h1>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <Link
            to="/transactions"
            className="flex flex-col rounded-md relative hover:ring-4 transition-all"
          >
            <BlockImage
              src="https://maypact-transactions.b-cdn.net/Transactions%20Illustration.webp"
              alt=""
            />
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
