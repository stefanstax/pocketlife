import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router";
import { closeAllOverviews } from "../app/overviewSlice";

const UrlWatcher = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!location.pathname.includes("/transactions")) {
      dispatch(closeAllOverviews());
    }
  }, [location.pathname]);
  return null;
};

export default UrlWatcher;
