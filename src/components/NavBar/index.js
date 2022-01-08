import { useState } from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import logo from 'assets/logo.png';

export default function NavBar({authInfo}) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const unauthenticatedNavBar = [
    {
      text: 'Log In',
      href: '/login',
    },
    {
      text: 'Create Account',
      href: '/signup',
    },
  ];

  const authenticatedNavBar = [
    {
      text: 'Dashboard',
      href: '/',
    },
  ];

  let navBar = unauthenticatedNavBar;
  if (authInfo.isAuthenticated) {
    navBar = authenticatedNavBar;
  }

  return (
    <Navbar
      color="light"
      expand="md"
      light
    >
      <NavbarBrand href="/" className="me-2">
        <img src={logo} alt="SafetyVision logo." height="40px" />
        <span className="px-3">
          SafetyVision
        </span>
      </NavbarBrand>
      <NavbarToggler className="me-2" onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav
          navbar
        >
          {navBar.map((navItem) => (
            <NavItem>
              <NavLink tag={Link} to={navItem.href}>
                {navItem.text}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
      </Collapse>
    </Navbar>
  );
}
