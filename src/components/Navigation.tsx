import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { Link } from "react-router";
import LoginButton from "../features/auth/LoginButton";
import LogoutButton from "../features/auth/LogoutButton";

const Navigation = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  return (
    <nav className="w-full flex-wrap mt-4 px-4 py-2 min-h-[60px] bg-[#1b1918]  flex justify-between items-center mx-auto">
      <p className="text-2xl text-[#f9f4da] font-black">Transactions App</p>
      <div className="flex gap-5 text-[#5152fb]">
        <Link to="/transactions/">Transactions</Link>
        <Link to="/select-currencies/">Toggle Currencies</Link>
        <Link to="/links/">Links</Link>
      </div>
      <div className="flex gap-5 items-center justify between">
        {isAuthenticated ? <LogoutButton /> : <LoginButton />}
      </div>
    </nav>
  );
};

export default Navigation;
