import { Link, Outlet } from "react-router-dom";

import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";

export function RootLayout(): JSX.Element {
  return (
    <>
      <Navbar bg="light" data-bs-theme="light">
        <Container>
          <Nav>
            <Nav.Link as={Link} to="/" className="font-bold">
              Home
            </Nav.Link>

            <Nav.Link as={Link} to="soal" className="font-bold">
              Soal
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <main>
        <Outlet />
      </main>
    </>
  );
}
