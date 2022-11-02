import React from "react";
import {Button, Col, Container, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCompress} from "@fortawesome/free-solid-svg-icons";
import {WithChildren} from "types/withChildren";
import {usePage} from "dashboard/contexts/page";

export default function Kiosk({onCloseKiosk, children} : WithChildren & { onCloseKiosk: () => void }) {
  // page
  const page = usePage();
  // render
  return (
    <Container fluid className='Kiosk'>
      <Row>
        <Col>&nbsp;</Col>
        <Col className='text-center'>
            <span className='text-muted text-nowrap' style={{whiteSpace: 'nowrap'}}>
              { page.footerContent || 'Next Dashboard' }
            </span>
        </Col>
        <Col className='text-end'>
          <Button variant="outline-link" onClick={onCloseKiosk}>
            <FontAwesomeIcon icon={faCompress} />
          </Button>
        </Col>
      </Row>
      <Row>
        {children}
      </Row>
    </Container>
  );

}
