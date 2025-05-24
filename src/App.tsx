import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router";
import Authentication from "./pages/Authentication";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Home from "./pages/Home";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="w-full h-screen bg-[#00011b]">
        <BrowserRouter>
          <Routes>
            <Route index path="/" element={<Home />} />
            <Route path="/authentication">
              <Route index element={<Authentication />} />
              <Route path="login" element={<Login />} />
              <Route path="registration" element={<Registration />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </main>
    </QueryClientProvider>
  );
};

export default App;
