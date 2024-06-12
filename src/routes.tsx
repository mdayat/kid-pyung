import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import { RootLayout } from "./RootLayout";
import { Home } from "./pages/Home";

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
    ],
  },
]);
