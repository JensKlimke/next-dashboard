import {useAuth} from "auth/contexts/auth";
import {useRoutes} from "dashboard/contexts/routes";
import {useConfig} from "dashboard/contexts/config";
import {Nav, Navbar, NavDropdown, NavLink} from "react-bootstrap";
import NavElement from "dashboard/elements/components/NavElement";
import Link from "next/link";
import {Avatar} from "dashboard/elements/profile/Avatar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRightFromBracket, faUser} from "@fortawesome/free-solid-svg-icons";
import React from "react";

export default function UserMenu () {
  // get contexts
  const {user, signOut} = useAuth();
  const routes = useRoutes();
  const config = useConfig();
  // render
  return (
    <Navbar.Collapse id='navbarScroll'>
      <div className='me-auto my-2 my-lg-0 d-none d-lg-flex'></div>
      <Nav className='me-auto my-2 my-lg-0 d-lg-none' navbarScroll >
        <NavElement routes={routes || []} showIcon={false} showText={true} className='d-block d-sm-none' />
        {
          config.profilePath && (
            <Link href={config.profilePath}>
              <NavLink as='a'>
                Profile
              </NavLink>
            </Link>
          )
        }
        <NavLink onClick={signOut}>
          Logout
        </NavLink>
      </Nav>
      <Nav className='d-none d-lg-flex'>
        <NavDropdown as='span' title={<Avatar name={user?.name || ''} avatar={user?.avatar || null} />} align='end' id='nav-dropdown'>
          {
            config.profilePath && (
              <Link href={config.profilePath}>
                <NavDropdown.Item eventKey='profile' as='button'>
                  <span className='navIcon'>
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                  Profile
                </NavDropdown.Item>
              </Link>
            )
          }
          <NavDropdown.Item eventKey='logout' onClick={signOut}>
            <span className='navIcon'><FontAwesomeIcon icon={faRightFromBracket}/></span>
            Logout
          </NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </Navbar.Collapse>
  )
}
