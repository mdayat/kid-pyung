import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import { RootLayout } from "./RootLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";

const Soal = lazy(() => import("./pages/Soal"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },

      {
        path: "soal",
        element: (
          <Suspense fallback={<h1>Loading...</h1>}>
            <Soal />
          </Suspense>
        ),
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);
