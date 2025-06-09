import { Outlet } from "react-router";
import Navigation from "./Navigation";

const Layout = () => {
  return (
    <main
      className="w-full max-w-[calc(100%_-_20px)] md:max-w-[calc(100%_-_60px)] lg:max-w-[calc(100%_-_120px) xl:max-w-[1180px]
 flex flex-col mx-auto my-5 gap-10"
    >
      <Navigation />
      <Outlet />
    </main>
  );
};

export default Layout;
