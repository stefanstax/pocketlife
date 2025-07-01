import { Outlet } from "react-router";
import Navigation from "./Navigation";
import Page from "./Page";

const Layout = () => {
  return (
    <main className="w-full flex flex-col">
      <Navigation />
      <Page>
        <Outlet />
      </Page>
    </main>
  );
};

export default Layout;
