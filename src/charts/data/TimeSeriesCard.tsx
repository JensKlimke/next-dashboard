import React, {useState} from "react";
import TimeSeriesChart from "./TimeSeriesChart";
import ValueDisplay, {ValueDisplayOptionsI} from "./ValueDisplay";
import {Card, Form} from "react-bootstrap";
import {PointI} from "hooks/timeData";

export enum ViewMode {
  current = 0,
  chart = 1
}

export interface TimeSeriesChartOptionsI extends ValueDisplayOptionsI {
  timeFormat: (t : Date) => string;
  valueFormat: (v : number) => string;
  what: string;
}

interface PropsI {
  title?: string;
  series: any[] | null;
  value: PointI | null;
  chartOptions: any | undefined;
  numberOptions: TimeSeriesChartOptionsI;
}

export default function TimeSeriesCard ({title, series, value, chartOptions, numberOptions}: PropsI) {
  // state for view mode
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.current);
  // generate footer text
  const footerText = viewMode === ViewMode.current
    ? `Time of value: ${numberOptions.timeFormat(value?.x)}`
    : `${numberOptions.what}: ${numberOptions.valueFormat(value?.y)} (${numberOptions.timeFormat(value?.x)})`
  // generate header text
  const headerText = title + (
    viewMode === ViewMode.current ? ` (${numberOptions.what})` : ''
  );
  // return card
  return (
    <Card>
      <Card.Header>
        {headerText}
        <Form.Check
          className='float-end'
          type="switch"
          label="Chart view"
          onClick={() => setViewMode(viewMode === ViewMode.chart ? ViewMode.current : ViewMode.chart)}
        />
      </Card.Header>
      <Card.Body>
        <TimeSeriesContent
          viewMode={viewMode}
          series={series}
          value={value}
          numberOptions={numberOptions}
          chartOptions={chartOptions}
        />
      </Card.Body>
      <Card.Footer>
        {footerText}
      </Card.Footer>
    </Card>
  );

}


function TimeSeriesContent ({viewMode, series, value, numberOptions, chartOptions}: any) {
  // switch for view modes
  switch(viewMode) {
    case ViewMode.current:
      return <ValueDisplay value={value} options={numberOptions} />
    case ViewMode.chart:
      return <TimeSeriesChart series={series} options={chartOptions} />
    default:
      return <></>;
  }
}
