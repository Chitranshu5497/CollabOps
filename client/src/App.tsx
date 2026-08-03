import { RouterProvider } from "react-router-dom";
import { router } from "./routes/AppRouter";
import AuthInitializer from "./components/common/AuthInitializer";
import AppLoader from "./components/common/AppLoader";
import { useAuthStore } from "./store/auth.store";

function App() {
  const loading = useAuthStore((state) => state.loading);

  return (
    <>
      <AuthInitializer />

      {loading ? <AppLoader /> : <RouterProvider router={router} />}
    </>
  );
}

export default App;