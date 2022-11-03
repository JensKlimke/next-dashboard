import React from 'react';
import {Button, Container, Image, Navbar} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faExpand} from '@fortawesome/free-solid-svg-icons';
import {usePage} from "dashboard/contexts/page";
import UserMenu from "dashboard/elements/profile/UserMenu";
import {useConfig} from "dashboard/contexts/config";
import {useAuth} from "auth/contexts/auth";

export default function Topbar({onOpenKiosk} : { onOpenKiosk: () => void }) {
  // get contexts
  const page = usePage();
  const config = useConfig();
  const {user} = useAuth();
  // render topbar
  return (
    <Navbar bg='light' expand='lg' className='Topbar'>
      <Container fluid>
        <Navbar.Brand className='text-nowrap'>
          <span className='d-inline d-sm-none'>
            <Image className='Logo' src={config.sidebarLogoSmall?.src || ''} alt='Logo small' />
          </span>&nbsp;
          <span>{page?.title || ''}</span>
        </Navbar.Brand>
        <Button variant="outline-link" onClick={onOpenKiosk}>
          <FontAwesomeIcon icon={faExpand} />
        </Button>
        <Navbar.Toggle aria-controls='navbarScroll' />
        { user && <UserMenu /> }
      </Container>
    </Navbar>
  );
}

