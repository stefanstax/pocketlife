import { Outlet } from "react-router";
import Navigation from "./Navigation";
import Page from "./Page";
import useWindowSize from "./ScreenSize";
import MobileNavigation from "./MobileNavigation";

const Layout = () => {
  const { width } = useWindowSize();
  return (
    <main className="w-full h-full bg-[#010d18]">
      <div className="flex flex-col lg:flex-row max-w-11/12 lg:max-w-9/12 mx-auto py-10 gap-10">
        <div className="w-full lg:w-3/12">
          {width < 1024 && <MobileNavigation />}
          {width >= 1024 && <Navigation />}
        </div>
        <div className="w-full">
          <Page>
            <Outlet />
          </Page>
        </div>
        {/* // todo  Transaction Overview will go here */}
        {/* <div className="w-4/12"></div> */}
      </div>
    </main>
  );
};

export default Layout;
