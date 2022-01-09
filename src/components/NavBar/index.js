import { useState } from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  NavLink,
  Button,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import logo from 'assets/logo.png';
import axios from 'util/axiosConfig';

export default function NavBar({
  authInfo,
  setIsAuthenticated,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const logout = () => {
    axios.post('/api/logout/', {}).then(() => {
      setIsAuthenticated(false);
    });
  };

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
    {
      text: 'User and Account Management',
      href: '/account',
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
        <Nav navbar className="me-auto">
          {navBar.map((navItem) => (
            <NavItem key={navItem.href}>
              <NavLink tag={Link} to={navItem.href}>
                {navItem.text}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
        {
          authInfo.isAuthenticated && (

            <Button onClick={logout}>
              Logout
            </Button>
          )
        }
      </Collapse>
    </Navbar>
  );
}
