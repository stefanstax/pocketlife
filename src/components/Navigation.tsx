import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { Link } from "react-router";
import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { FaCircleDollarToSlot } from "react-icons/fa6";
import { FaFileInvoiceDollar } from "react-icons/fa";

const Navigation = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  return (
    <nav className="w-full flex-wrap mt-4 p-4 min-h-[60px] bg-black rounded-sm shadow-xl gap-4 flex justify-start items-center mx-auto">
      <h1 className="text-xl text-white font-black">Transactions App</h1>
      <div className="flex gap-5 font-[500] text-white">
        <Link
          to="/transactions/"
          className="flex gap-2 items-center hover:text-blue-200"
        >
          <FaMoneyBillTransfer /> Transactions
        </Link>
        {user?.username === "stefanstax" && (
          <Link
            to="/currencies/"
            className="flex gap-2 items-center hover:text-blue-200"
          >
            <FaFileInvoiceDollar /> Manage Currencies
          </Link>
        )}
        <Link
          to="/select-currencies/"
          className="flex gap-2 items-center hover:text-blue-200"
        >
          <FaCircleDollarToSlot /> Toggle Currencies
        </Link>
      </div>
      <div className="flex gap-5 ml-auto items-center justify between">
        {isAuthenticated ? <LogoutButton /> : <LoginButton />}
      </div>
    </nav>
  );
};

export default Navigation;
