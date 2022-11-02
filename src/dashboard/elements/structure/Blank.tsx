import {Col, Container, Image, Row} from "react-bootstrap";
import React from "react";
import {WithChildren} from "types/withChildren";
import {useConfig} from "dashboard/contexts/config";

export default function Blank({children} : WithChildren) {
  // get config
  const config = useConfig();
  // render
  return (
    <Container fluid className='Blank'>
      <Row className='justify-content-center h-100'>
        <Col xs={12} className='align-self-center text-center'>
          <Image src={config.sidebarLogoLarge?.src || ''} alt={'logo'} className='logo' />
        </Col>
        <Col md={8} lg={6} xl={4} >
          { children }
        </Col>
      </Row>
    </Container>
  );

}
