import React, {useEffect, useRef} from "react";
import ForceGraph from './ForceGraph';

export interface NodeI {
  id: string;
  group: number;
  radius: number;
}

export interface LinkI {
  source: string;
  target: string;
  value: number;
}

interface PropsI {
  nodes : NodeI[];
  links: LinkI[];
}

export default function Graph({nodes, links} : PropsI) {

  const ref = useRef();

  useEffect(() => {
    // get svg
    ForceGraph({nodes, links}, ref, {
      nodeStrength: -300.0,
      linkStrength: 0.1,
      nodeRadius: (d : any) => d.radius,
      nodeGroup: (d : any) => d.group,
      nodeTitle: (d : any) => `${d.id}\n${d.group}`,
      width: 1280,
      height: 800,
      nodeStroke: '#6D7CA133',
      nodeStrokeWidth: 3,
      nodeStrokeOpacity: 1.0,
    });
  }, [nodes, links])

  // @ts-ignore
  return <svg ref={ref} />;

}
