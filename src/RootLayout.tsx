import { Link, Outlet } from "react-router-dom";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

export function RootLayout(): JSX.Element {
  return (
    <>
      <Navbar bg="light" data-bs-theme="light">
        <Nav className="w-full max-w-screen-lg mx-auto px-8">
          <Nav.Link as={Link} to="/" className="font-bold">
            Home
          </Nav.Link>

          <Nav.Link as={Link} to="soal" className="font-bold">
            Soal
          </Nav.Link>
        </Nav>
      </Navbar>

      <main className="max-w-screen-md mx-auto my-8">
        <Outlet />
      </main>
    </>
  );
}
