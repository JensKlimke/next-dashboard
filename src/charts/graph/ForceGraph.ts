// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/force-directed-graph

import * as d3 from 'd3'

// function drag(simulation : any) {
//   function dragstarted(event : any) {
//     if (!event.active) simulation.alphaTarget(0.3).restart();
//     event.subject.fx = event.subject.x;
//     event.subject.fy = event.subject.y;
//   }
//
//   function dragged(event : any) {
//     event.subject.fx = event.x;
//     event.subject.fy = event.y;
//   }
//
//   function dragended(event : any) {
//     if (!event.active) simulation.alphaTarget(0);
//     event.subject.fx = null;
//     event.subject.fy = null;
//   }
//
//   return d3.drag()
//     .on("start", dragstarted)
//     .on("drag", dragged)
//     .on("end", dragended);
// }

export default function ForceGraph({
                      nodes, // an iterable of node objects (typically [{id}, …])
                      links // an iterable of link objects (typically [{source, target}, …])
                    } : any,
                    ref: any,
                   {
                      nodeId = (d : any) => d.id, // given d in nodes, returns a unique identifier (string)
                      nodeGroup, // given d in nodes, returns an (ordinal) value for color
                      nodeGroups, // an array of ordinal values representing the node groups
                      nodeTitle, // given d in nodes, a title string
                      nodeFill = "currentColor", // node stroke fill (if not using a group color encoding)
                      nodeStroke = "#fff", // node stroke color
                      nodeStrokeWidth = 1.5, // node stroke width, in pixels
                      nodeStrokeOpacity = 1, // node stroke opacity
                      nodeRadius,
                      nodeStrength,
                      textStroke = "#000000", // text stroke color
                      textStrokeWidth = 0,    // text stroke width, in pixels
                      textStrokeOpacity = 1,  // text stroke opacity
                      linkSource = ({source} : any) => source, // given d in links, returns a node identifier string
                      linkTarget = ({target} : any) => target, // given d in links, returns a node identifier string
                      linkStroke = "#999", // link stroke color
                      linkStrokeOpacity = 0.6, // link stroke opacity
                      linkStrokeWidth = 1.5, // given d in links, returns a stroke width in pixels
                      linkStrokeLinecap = "round", // link stroke linecap
                      linkStrength,
                      colors = d3.schemeTableau10, // an array of color strings, for the node groups
                      width = 640, // outer width, in pixels
                      height = 400, // outer height, in pixels
                      invalidation // when this promise resolves, stop the simulation
                    } : any = {}) {
  // Compute values.
  const R = d3.map(nodes, nodeRadius).map(intern);
  const N = d3.map(nodes, nodeId).map(intern);
  const LS = d3.map(links, linkSource).map(intern);
  const LT = d3.map(links, linkTarget).map(intern);

  if (nodeTitle === undefined)
    nodeTitle = (_ : any, i : number) => N[i];

  const T = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
  const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
  const W = typeof linkStrokeWidth !== "function" ? null : d3.map(links, linkStrokeWidth);
  const L = typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);

  // Replace the input nodes and links with mutable objects for the simulation.
  nodes = d3.map(nodes, (_, i) => ({id: N[i]}));
  links = d3.map(links, (_, i) => ({source: LS[i], target: LT[i]}));

  // Compute default domains.
  if (G && nodeGroups === undefined)
    nodeGroups = d3.sort(G);

  // Construct the scales.
  const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

  // Construct the forces.
  const forceNode = d3.forceManyBody();
  const forceLink = d3.forceLink(links).id(({index: i}) => N[i || 0]);
  if (nodeStrength !== undefined)
    forceNode.strength(nodeStrength);

  if (linkStrength !== undefined)
    forceLink.strength(linkStrength);

  const simulation = d3.forceSimulation(nodes)
    .force("link", forceLink)
    .force("charge", forceNode)
    .force("center",  d3.forceCenter())
    .on("tick", ticked);

  const svg = d3.select(ref.current)
    .html("")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  const link = svg.append("g")
    .attr("stroke", typeof linkStroke !== "function" ? linkStroke : null)
    .attr("stroke-opacity", linkStrokeOpacity)
    .attr("stroke-width", typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null)
    .attr("stroke-linecap", linkStrokeLinecap)
    .selectAll("line")
    .data(links)
    .join("line");

  const node = svg.append("g")
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("fill", nodeFill)
    .attr("stroke", nodeStroke)
    .attr("stroke-opacity", nodeStrokeOpacity)
    .attr("stroke-width", nodeStrokeWidth)
    .attr("r", ({index : i} : any) => R[i]);
//     .call(drag(simulation))

  const texts = svg.append("g")
    .selectAll("text")
    .data(nodes)
    .join("text")
    .attr('stroke', textStroke)
    .attr('stroke-width', textStrokeWidth)
    .attr("stroke-opacity", textStrokeOpacity)
    // @ts-ignore
    .text(d => d.id);

  // @ts-ignore
  if (W) link.attr("stroke-width", ({index: i} : any) => W[i]);
  // @ts-ignore
  if (L) link.attr("stroke", ({index: i} : any) => L[i]);
  // @ts-ignore
  if (G) node.attr("fill", ({index: i} : any) => color(G[i]));
  // @ts-ignore
  if (T) node.append("title").text(({index: i} : any) => T[i]);
  if (invalidation != null) invalidation.then(() => simulation.stop());

  function intern(value : any) {
    return value !== null && typeof value === "object" ? value.valueOf() : value;
  }

  function ticked() {
    link
      // @ts-ignore
      .attr("x1", d => d.source.x)
      // @ts-ignore
      .attr("y1", d => d.source.y)
      // @ts-ignore
      .attr("x2", d => d.target.x)
      // @ts-ignore
      .attr("y2", d => d.target.y);

    node
      // @ts-ignore
      .attr("cx", d => d.x)
      // @ts-ignore
      .attr("cy", d => d.y);

    texts
      // @ts-ignore
      .attr('x', (d, i) => d.x + R[i] + 2)
      // @ts-ignore
      .attr('y', d => d.y);

  }

  return Object.assign(svg.node(), {scales: {color}});
}
