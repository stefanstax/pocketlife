import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense, lazy, type JSX } from "react";
import { ToastContainer } from "react-toastify";

import Layout from "./components/Layout";
import BlurredSpinner from "./components/BlurredSpinner";

const Authentication = lazy(() => import("./pages/Authentication"));
const Login = lazy(() => import("./pages/Login"));
const Registration = lazy(() => import("./pages/Registration"));
const Home = lazy(() => import("./pages/Home"));
const TransactionList = lazy(
  () => import("./features/transactions/TransactionList")
);
const AddTransaction = lazy(
  () => import("./features/transactions/TransactionAdd")
);
const CurrenciesAdd = lazy(
  () => import("./features/transactions/currency/CurrencyAdd")
);
const CurrencyList = lazy(
  () => import("./features/transactions/currency/CurrencyList")
);
const CurrencyEdit = lazy(
  () => import("./features/transactions/currency/CurrencyEdit")
);
const PaymentMethodAdd = lazy(
  () => import("./features/transactions/paymentMethods/PaymentMethodAdd")
);
const PaymentMethodsList = lazy(
  () => import("./features/transactions/paymentMethods/PaymentMethodsList")
);
const PaymentMethodEdit = lazy(
  () => import("./features/transactions/paymentMethods/PaymentMethodEdit")
);
const Recovery = lazy(() => import("./features/recovery/Recovery"));
const UserProfile = lazy(() => import("./features/users/UserProfile"));
const CategoryList = lazy(
  () => import("./features/transactions/category/CategoryList")
);
const CategoryAdd = lazy(
  () => import("./features/transactions/category/CategoryAdd")
);
const CategoryEdit = lazy(
  () => import("./features/transactions/category/CategoryEdit")
);
const ComingSoon = lazy(() => import("./pages/ComingSoon"));

// Route guards (keep eager)
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import GuestRoute from "./components/GuestRoute";

const App = () => {
  const withSuspense = (Component: JSX.Element) => (
    <Suspense fallback={<BlurredSpinner />}>{Component}</Suspense>
  );
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          {/* Admin Routes */}
          {/* <Route element={<AdminRoute />}>
          </Route> */}
          <Route element={<ProtectedRoute />}>
            <Route path="users/:id" element={withSuspense(<UserProfile />)} />
            {/* Protected Routes */}
            <Route path="transactions">
              <Route index element={withSuspense(<TransactionList />)} />
              <Route path="add" element={withSuspense(<AddTransaction />)} />
            </Route>
            <Route path="currencies">
              <Route index element={withSuspense(<CurrencyList />)} />
              <Route path="add" element={withSuspense(<CurrenciesAdd />)} />
              <Route path=":id" element={withSuspense(<CurrencyEdit />)} />
            </Route>
            <Route path="transaction-categories">
              <Route index element={withSuspense(<CategoryList />)} />
              <Route path="add" element={withSuspense(<CategoryAdd />)} />
              <Route path=":id" element={withSuspense(<CategoryEdit />)} />
            </Route>
            <Route path="payment-methods">
              <Route index element={withSuspense(<PaymentMethodsList />)} />
              <Route path="add" element={withSuspense(<PaymentMethodAdd />)} />
              <Route path=":id" element={withSuspense(<PaymentMethodEdit />)} />
            </Route>
          </Route>
          {/* Guest Routes */}
          <Route path="links" element={withSuspense(<ComingSoon />)} />
          <Route path="storage" element={withSuspense(<ComingSoon />)} />
          <Route element={<GuestRoute />}>
            <Route path="authentication">
              <Route index element={<Authentication />} />
              <Route path="login" element={<Login />} />
              <Route path="registration" element={<Registration />} />
            </Route>
            <Route path="recovery/:recoveryUrl" element={<Recovery />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={false}
        pauseOnHover
        draggable
      />
    </BrowserRouter>
  );
};

export default App;
