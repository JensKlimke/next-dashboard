import {useCallback, useEffect, useState} from "react";
import moment from "moment";

export interface PointI {
  x: any;
  y: any;
}

export interface DataPoint {
  _field: string;
  _value: number;
  _time: string;
}

export const TimeDataFilter = (objects : DataPoint[], field : string, filterDefinition : any) => {
  return objects
    .filter(filterDefinition)
    .filter(o => o._field === field)
    .map((e:any) => ({x: new Date(e._time), y: e._value}));
}

export default function useTimeDataState (data: any[], dataFilter : (data: any[]) => any[], name : string) : [any[] | null, PointI | null] {
  // states
  const [series, setSeries] = useState<any[] | null>(null);
  const [current, setCurrent] = useState<PointI | null>(null);
  // define callback
  const update = useCallback((d : any) => {
    // filter data
    const data = dataFilter(d);
    // check if data is given
    if(data.length === 0) {
      // set data
      setCurrent(null);
      setSeries([]);
      // abort here
      return;
    }
    // remove last element (it's the current value)
    const c = data.pop();
    // get next hour to fill up
    const h = moment(c.x).minute() || moment(c.x).second() || moment(c.x).millisecond()
      ? moment(c.x).add(1, 'hour').startOf('hour')
      : moment(c.x).startOf('hour');
    // add
    data.push({x: h.toDate(), y: undefined});
    // create series from data
    const s = [{name, data}];
    // set current
    setCurrent(c);
    // set series
    setSeries(s);
  }, [dataFilter, name]);
  // effect
  useEffect(() => {
    if(data && update)
      update(data);
  }, [data, update]);
  // return data
  return [series, current];
}
