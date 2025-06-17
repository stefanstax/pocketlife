import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router";
import Authentication from "./pages/Authentication";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import GuestRoute from "./features/auth/GuestRoute";
import TransactionList from "./features/transactions/TransactionList";
import AddTransaction from "./features/transactions/AddTransaction";
import EditTransaction from "./features/transactions/EditTransaction";
import CurrenciesAdd from "./features/currency/CurrencyAdd";
import CurrencyList from "./features/currency/CurrencyList";
import CurrencyEdit from "./features/currency/CurrencyEdit";
import AdminRoute from "./features/auth/AdminRoute";
import CurrencySelection from "./features/currency/CurrencySelection";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
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
            </Route>
            {/* Guest Routes */}
            <Route element={<GuestRoute />}>
              <Route path="authentication">
                <Route index element={<Authentication />} />
                <Route path="login" element={<Login />} />
                <Route path="registration" element={<Registration />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
