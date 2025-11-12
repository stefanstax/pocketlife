import { Outlet } from "react-router";
import Navigation from "./Navigation";
import Page from "./Page";
import useWindowSize from "../hooks/useWindowSize";
import MobileNavigation from "./MobileNavigation";
import { useSelector } from "react-redux";
import { transactionPanelData } from "../app/overviewSlice";
import TransactionPanel from "../features/transactions/TransactionPanel";
import type { RootState } from "../app/store";
import UrlWatcher from "./UrlWatcher";

const Layout = () => {
  const user = useSelector((state: RootState) => state.auth);
  const { width } = useWindowSize();
  const transactionPanel = useSelector(transactionPanelData);
  return (
    <main className="w-full h-full">
      <UrlWatcher />
      <div className="flex flex-col lg:flex-row max-w-11/12 lg:max-w-9/12 mx-auto py-10 gap-10">
        {user?.token !== null && (
          <div className="w-full lg:w-3/12">
            {width < 1024 && <MobileNavigation />}
            {width >= 1024 && <Navigation />}
          </div>
        )}
        <Page>
          <Outlet />
        </Page>
        {/* // todo  Transaction Overview will go here */}

        {transactionPanel?.data && (
          <TransactionPanel data={transactionPanel?.data} />
        )}
      </div>
    </main>
  );
};

export default Layout;
