import { Suspense } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./styles/main.scss";
import AppRoute from "./routes/AppRoute";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

function App() {
  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <AuthProvider>
          <AppRoute />
          <ToastContainer
            position="bottom-right"
            limit={4}
            autoClose={5000}
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <ToastContainer />
        </AuthProvider>
      </QueryClientProvider>
    </Suspense>
  );
}

export default App;
