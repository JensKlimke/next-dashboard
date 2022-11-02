import {useEffect, useRef} from 'react';
import * as d3 from 'd3';
import {BoxT, SizeT} from './lib/shapes';

export type SankeyData = {
  size: SizeT
  groups: (BoxT & { label: string })[]
  nodes: (BoxT & { text: string })[]
  flows: {out: number, in: number, value: number, offsetOut: number, offsetIn: number}[]
}


export default function SankeyChart({data}: {data: SankeyData}) {
  const ref = useRef(null);
  useEffect(() => {
    // wait for ref to be set
    if (!ref.current && !data)
      return;

    // width and height of svg
    const svg = d3
      .select(ref.current)
      .style('width', data.size.width)
      .style('height', data.size.height);

    // create group containers
    const groups = svg
      .selectAll('g.group')
      .data(data.groups)
      .enter()
      .append('g')
      .classed('group', true)
      .attr('transform', (d) => `translate(${d.x},${d.y})`);

    // draw rectangle for groups
    groups.append('rect')
      .attr('rx', (d) => d.radius || 5)
      .attr('ry', (d) => d.radius || 5)
      .attr('x', 0.0)
      .attr('y', 0.0)
      .attr('width', d => d.width)
      .attr('height', d => d.height)
      .attr('fill', '#fafafa')
      .attr('stroke', '#2c2c2c')
      .attr('stroke-width', 1)

    // add group label
    groups.append('text')
      .attr('x', 10)
      .attr('y', 10)
      .attr('dx', '0em')
      .attr('dy', '1em')
      .text(d => d.label)

    // clean
    groups
      .exit()
      .remove();

    // create nodes
    const nodes = svg
      .selectAll('g.node')
      .data(data.nodes)
      .enter()
      .append('g')
      .classed('node', true)
      .attr('transform', (d) => `translate(${d.x - 0.5 * d.width},${d.y - 0.5 * d.height})`);

    // add rectangles for nodes
    nodes.append('rect')
      .attr('rx', (d) => d.radius || 0)
      .attr('ry', (d) => d.radius || 0)
      .attr('x', 0.0)
      .attr('y', 0.0)
      .attr('width', d => d.width)
      .attr('height', d => d.height)
      .attr('fill', '#ffffff')
      .attr('stroke', '#2c2c2c')
      .attr('stroke-width', 2)

    // add group label
    nodes.append('text')
      .attr('x', d => d.width * 0.5)
      .attr('y', d => d.height)
      .attr('dy', '1em')
      .attr('text-anchor', 'middle')
      .text(d => d.text)

    nodes
      .exit()
      .remove();

    const flowData = data.flows.map(f => ({
      out: data.nodes[f.out],
      in: data.nodes[f.in],
      offsetIn: f.offsetIn,
      offsetOut: f.offsetOut,
      value: f.value
    }))

    const flows = svg
      .selectAll('g.flow')
      .data(flowData)
      .enter()
      .append('g')
      .classed('flow', true)

    flows.append('path')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', d => d.value)
      .attr('fill', 'none')
      .attr('d', d => {
          const gen = d3.line().curve(d3.curveNatural);
          return gen([
            [d.out.x + d.out.width * 0.5, d.out.y + d.value + d.offsetOut],
            [d.out.x + d.out.width * 0.5 + 100, d.out.y + d.value + d.offsetOut],
            [d.in.x - 100, d.in.y + d.value + d.offsetIn],
            [d.in.x, d.in.y + d.value + d.offsetIn]
          ])
        }
      );



  }, [data, ref])
  return <svg
    ref={ref}
  />;
}
