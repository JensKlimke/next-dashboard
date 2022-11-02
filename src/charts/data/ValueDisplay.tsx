import React from 'react';
import {Col, Container, Placeholder, Row} from 'react-bootstrap';
import LargeNumber from './LargeNumber';
import {PointI} from "hooks/timeData";


export interface ValueDisplayOptionsI {
  postValue?: string;
  preValue?: string;
  decimals?: number;
}

interface PropsI {
  value: PointI | undefined;
  options: ValueDisplayOptionsI;
}

export default function ValueDisplay ({value, options}: PropsI) {
  // switch for view modes
  return (
    <Container className='ratio ratio-16x9'>
      <Row className='justify-content-center h-100' >
        <Col className='align-self-center text-center'>
          {
            value ?
              <LargeNumber
                value={value?.y}
                decimals={options?.decimals || 0}
                post={options.postValue}
                pre={options.preValue}
                muted={false}
              /> : <Placeholder3/>
          }
        </Col>
      </Row>
    </Container>
  );
}

function Placeholder3 () {

  return(
    <>
      <Placeholder as='h4' animation='glow'>
        <Placeholder xs={7} />
        <Placeholder xs={7} />
        <Placeholder xs={7} />
      </Placeholder>
    </>
  );

}
