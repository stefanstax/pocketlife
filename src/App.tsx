import { BrowserRouter, Route, Routes } from "react-router";
import Authentication from "./pages/Authentication";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import TransactionList from "./features/transactions/TransactionList";
import AddTransaction from "./features/transactions/TransactionAdd";
import EditTransaction from "./features/transactions/TransactionEdit";
import CurrenciesAdd from "./features/transactions/currency/CurrencyAdd";
import CurrencyList from "./features/transactions/currency/CurrencyList";
import CurrencyEdit from "./features/transactions/currency/CurrencyEdit";
import CurrencySelection from "./features/transactions/currency/CurrencySelection";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import GuestRoute from "./components/GuestRoute";
import { ToastContainer } from "react-toastify";
import ComingSoon from "./pages/ComingSoon";
import PaymentMethodAdd from "./features/transactions/paymentMethods/PaymentMethodAdd";
import PaymentMethodsList from "./features/transactions/paymentMethods/PaymentMethodsList";
import PaymentMethodEdit from "./features/transactions/paymentMethods/PaymentMethodEdit";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route element={<AdminRoute />}>
            <Route path="currencies">
              <Route index element={<CurrencyList />} />
              <Route path="add" element={<CurrenciesAdd />} />
              <Route path=":id" element={<CurrencyEdit />} />
            </Route>{" "}
          </Route>
          <Route element={<ProtectedRoute />}>
            {/* Protected Routes */}
            <Route path="transactions">
              <Route index element={<TransactionList />} />
              <Route path="add" element={<AddTransaction />} />
              <Route path=":id" element={<EditTransaction />} />
            </Route>
            <Route path="select-currencies" element={<CurrencySelection />} />
            <Route path="payment-methods">
              <Route index element={<PaymentMethodsList />} />
              <Route path="add" element={<PaymentMethodAdd />} />
              <Route path=":id" element={<PaymentMethodEdit />} />
            </Route>
          </Route>
          {/* Guest Routes */}
          <Route path="links" element={<ComingSoon />} />
          <Route path="storage" element={<ComingSoon />} />
          <Route element={<GuestRoute />}>
            <Route path="authentication">
              <Route index element={<Authentication />} />
              <Route path="login" element={<Login />} />
              <Route path="registration" element={<Registration />} />
            </Route>
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
