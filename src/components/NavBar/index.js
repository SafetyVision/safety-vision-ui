import { useState, Fragment } from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  NavLink,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
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
          {
            !authInfo.isAuthenticated ? (
              <Fragment>
                <NavItem>
                  <NavLink tag={Link} to="/login">
                    Log In
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/signup">
                    Create Account
                  </NavLink>
                </NavItem>
              </Fragment>
            ) : (
              <Fragment>
                <NavItem>
                  <NavLink tag={Link} to="/">
                    Dashboard
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/infraction-events">
                    Infraction Events
                  </NavLink>
                </NavItem>
                <UncontrolledDropdown inNavbar nav>
                  <DropdownToggle caret nav>
                    User and Account Management
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem tag={Link} to="/account">
                      Account Management
                    </DropdownItem>
                    <DropdownItem tag={Link} to="/account/users">
                      User Management
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <NavItem>
                  <NavLink tag={Link} to="/devicemanager">
                    Device Manager
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/infractionTypes">
                    Infraction Types
                  </NavLink>
                </NavItem>
              </Fragment>
            )
          }
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
