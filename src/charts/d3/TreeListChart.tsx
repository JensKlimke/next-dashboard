import {useEffect, useRef} from "react";
import * as d3 from "d3";
import {TreeData} from "charts/d3/TreeChart";

const width = 600;
const height = 400;

export default function TreeListChart({tree}: { tree: TreeData }) {
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
    // save size
    svg
      .style('width', width)
      .style('height', height);
  }, [tree, ref])
  return <svg
    ref={ref}
  />;
}
