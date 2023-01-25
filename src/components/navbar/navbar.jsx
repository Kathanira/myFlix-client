import React from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import Logo from '/public/MyFlix-Logo.png'
import { Link } from "react-router-dom";

export function Navbar({ user, onLoggedOut }) {
  const handleLogOut = (e) => {
    e.preventDefault();
    localStorage.clear();
    window.open('/', '_self');
    onLoggedOut(user);
  };

  const isAuth = () => {
    if (typeof window == "undefined") {
      return false;
    }
    if (localStorage.getItem("token")) {
      return localStorage.getItem("token");
    } else {
      return false;
    }
  };

  return (
    <Navbar className="navbar-custom mt-4" sticky="top" bg="dark"
      expand="xl" style={{ borderRadius: '15px' }}>
      <Container>
        <Link to="/">
          <img src={Logo} height={65} className="pr-3" />
        </Link>
        <Navbar.Brand className="navbar-logo text-white text-center" href="/"></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="text-center ml-auto">
            {isAuth() && (
              <Nav.Link className="text-white-50 text-center" href={`/users/${user}`}>{user}</Nav.Link>
            )}
            {isAuth() && (
              <Button className="text-white" variant="link" onClick={handleLogOut}>Logout</Button>
            )}
            {!isAuth() && (
              <Nav.Link className="text-white" href="/">Log In</Nav.Link>
            )}
            {!isAuth() && (
              <Nav.Link className="text-white" href="/register">Sign Up</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navbar