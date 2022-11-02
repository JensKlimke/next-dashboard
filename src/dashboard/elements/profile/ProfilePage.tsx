import React from 'react';
import {Card, Col, Container, Row} from 'react-bootstrap';
import ProfileForm from './ProfileForm';
import {useConfig} from "dashboard/contexts/config";
import styles from '../../../styles/Profile.module.css'
import defaultImage from '../../images/undraw_profile_image_re_ic2f.svg'

export default function ProfilePage () {
  // config
  const config = useConfig();
  // render
  return (
    <Container>
      <div className={styles.blankLine}>&nbsp;</div>
      <Row className='justify-content-md-center'>
        <Col lg={8} md={12} >
          <Card>
            <Card.Body>
              <Row>
                <Col xl={6} className='d-none d-xl-block'>
                  <Card.Img variant='top' src={config.profileSideImage?.src || defaultImage.src} />
                </Col>
                <Col xl={6} sm={12}>
                  <Card.Title>Edit Profile</Card.Title>
                  <ProfileForm />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
