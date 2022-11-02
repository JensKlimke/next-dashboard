import React from "react";
import {Container, Navbar} from "react-bootstrap";
import {usePage} from "dashboard/contexts/page";

function Footer () {
  // get page information
  const page = usePage();
  // render
  return (
      <Navbar bg='light' variant='light' className='Footer'>
        <Container>
          <div className='text'>
            { page.footerContent || 'Next Dashboard' }
          </div>
        </Container>
      </Navbar>
  )
}

export default Footer;
