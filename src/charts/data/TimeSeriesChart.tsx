import React, {useEffect, useState} from "react";
import {ApexOptions} from "apexcharts";
import {Col, Container, Placeholder, Row} from "react-bootstrap";
import merge from 'lodash.merge';
import {timeLineChartOptions} from "./apex";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface PropsI {
  series: any | undefined;
  options: ApexOptions;
}

export default function TimeSeriesChart ({series, options}: PropsI) {
  // states
  const [chartOptions, setChartOptions] = useState<ApexOptions | undefined>();
  // effect on option change
  useEffect(() => {
    // set options
    setChartOptions(merge(timeLineChartOptions, options));
  }, [options]);
  // don't show anything if options are not processed
  if(!chartOptions)
    return <></>
  // show placeholders, when data not available
  if(!series)
    return <Placeholder4 />
  // show chart
  return (
    <Container fluid className='ratio ratio-16x9'>
      <Row>
        <Col>
          <Chart
            series={series}
            options={chartOptions}
            height='100%'
            width='100%'
            type='line'
          />
        </Col>
      </Row>
    </Container>
  );
}

function Placeholder4 () {
  return(
    <>
      <Placeholder as="p" animation="glow">
        <Placeholder xs={12} />
      </Placeholder>
      <Placeholder as="p" animation="glow">
        <Placeholder xs={12} />
      </Placeholder>
      <Placeholder as="p" animation="glow">
        <Placeholder xs={12} />
      </Placeholder>
      <Placeholder as="p" animation="glow">
        <Placeholder xs={12} />
      </Placeholder>
    </>
  );
}
