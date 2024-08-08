import { Suspense } from "react";
import { ToastContainer } from "react-toastify";

import "./styles/main.scss";
import AppRoute from "./routes/AppRoute";

function App() {
  return (
    <Suspense fallback={<h1>Loading...</h1>}>
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
    </Suspense>
  );
}

export default App;
