import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { router } from "./routes/AppRouter";
import AuthInitializer from "./components/common/AuthInitializer";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthInitializer />
    <RouterProvider router={router} />
  </React.StrictMode>
);