import {useEffect, useRef} from 'react';
import * as d3 from 'd3';

export type Node = {
  id: string
  name: string
  color: string
  textColor?: string
  parent?: string
  children?: string[]
}

export type TreeData = {
  nodes: Node[]
  path: (string | undefined)[]
}

// parameters
const gapSizeHor = 20;
const gapSizeVert = 50;
const gapOuter = 10;
const boxWidth = 200;
const boxHeight = 100;

const coordinates : { [key: string]: {x: number, y: number}; } = {};

const generateBoxes = (
  svg : d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
  key: string | undefined,
  level: number,
  data: Node[]
) => {
  // create group containers
  const groups = svg
    .selectAll(`g.level-${level}`)
    .data(data)
    .enter()
    .append('g')
    .classed('group', true)
    .attr('transform', (d, i) => {
        // calculate coordinate
        const x = i * (boxWidth + gapSizeHor) + gapOuter;
        const y = level * (boxHeight + gapSizeVert) + gapOuter;
        // save coordinate
        coordinates[d.id] = {x, y};
        // return translate
        return `translate(${x},${y})`;
      });
  // draw rectangle for groups
  groups.append('rect')
    .attr('rx', 5)
    .attr('ry', 5)
    .attr('x', 0.0)
    .attr('y', 0.0)
    .attr('width', boxWidth)
    .attr('height', boxHeight)
    .attr('fill', '#fafafa')
    .attr('stroke', '#2c2c2c')
    .attr('stroke-width', 1)
    .attr('fill', d => d.color || 'white')
  // add name as text
  groups.append('text')
    .attr('text', d => d.name)
    .attr('x', 10.0)
    .attr('y', 20.0)
    .style('fill', d => (d.textColor || 'black'))
    .text(d => d.name)
  // clean
  groups
    .exit()
    .remove();
}

const generatePath = (
  svg : d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
  from: {x: number, y: number},
  to: {x: number, y: number},
  color: string | undefined
) => {
  // generate line
  const line = d3.line();
  // generate path
  svg
    .append('path')
    .attr("d", line([
      [from.x + boxWidth * 0.5, from.y + boxHeight],
      [from.x + boxWidth * 0.5, from.y + boxHeight + gapSizeVert * 0.5],
      [to.x + boxWidth * 0.5, from.y + boxHeight + gapSizeVert * 0.5],
      [to.x + boxWidth * 0.5, to.y]
    ]))
    .attr("stroke", color || 'black')
    .attr('fill', 'none')
}

export default function TreeChart({tree}: { tree: TreeData }) {
  const ref = useRef(null);
  useEffect(() => {
    // wait for ref to be set
    if (!ref.current || !tree)
      return;
    // get nodes and path
    const {nodes, path} = tree;
    // width and height of svg
    const svg = d3
      .select(ref.current)
    // generate levels of rectangles
    let maxNeighbors = 0, noLevels = 0;
    path.forEach( (p, i) => {
      // get nodes of level
      const n = nodes.filter(e => e.parent === p);
      // save max width and number of levels
      maxNeighbors = n.length > maxNeighbors ? n.length : maxNeighbors;
      ++noLevels;
      // generate boxes
      generateBoxes(svg, undefined, i, n);
      // generate lines
      if (p !== undefined) {
        // from coordinates
        const from = coordinates[p];
        // nodes
        n
          .map(e => ({color: e.color, coordinates: coordinates[e.id]}))
          .map(to => generatePath(svg, from, to.coordinates, to.color));
      }
    });
    // save size
    svg
      .style('width', (maxNeighbors - 1) * (boxWidth + gapSizeHor) + boxWidth + 2 * gapOuter)
      .style('height', (noLevels - 1) * (boxHeight + gapSizeVert) + boxHeight + 2 * gapOuter);
  }, [tree, ref])
  return <svg
    ref={ref}
  />;
}
