import { Outlet } from "react-router-dom";

export function RootLayout(): JSX.Element {
  return (
    <>
      <main>
        <Outlet />
      </main>
    </>
  );
}
