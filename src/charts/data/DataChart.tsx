import TimeSeriesChart from "./TimeSeriesChart";
import {useEffect, useState} from "react";
import {ApexOptions} from "apexcharts";

export type ConfigT = {
  groups: {
    name: string
    filter?: (e : any) => boolean
    map?: (e : any) => any
    color: string
  }[],
  options: ApexOptions
}


export default function DataChart ({input, config} : {input : any[] | undefined, config: ConfigT}) {
  // series state
  const [series, setSeries] = useState<any[] | null>(null);
  const [colors, setColors] = useState<string[]>([]);
  // generate series from input
  useEffect(() => {
    // check input
    if (!input) {
      setSeries(null);
      return;
    }
    // get colors
    const colors = config.groups.map(g => g.color);
    setColors(colors);
    // get groups
    const data = config.groups.map((g) => {
      // set data
      let d = [...input];
      // filter data and convert to point
      if (g.filter)
        d = d.filter(g.filter);
      if (g.map)
        d = d.map(g.map);
      // map to x and y
      d = d.map(entry => ({x: entry._time, y: entry._value}));
      // return series
      return {name: g.name, data: d};
    });
    // set series
    setSeries(data);
  }, [input, config]);
  // return chart
  return <TimeSeriesChart series={series} options={{...config.options, colors}} />
}
