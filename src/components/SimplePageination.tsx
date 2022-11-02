import {Pagination} from "react-bootstrap";
import {useCallback, useMemo, useState} from "react";

export default function SimplePagination ({onChange, length, minified} : { onChange: (index : number) => void, length: number, minified ?: boolean }) {
  // state
  const [index, setIndex] = useState(0);
  // callback to change index
  const change = useCallback((idx: number) => {
    setIndex(idx);
    onChange(idx);
  }, [onChange]);
  // generate elements
  const elements = useMemo(() => {
    // when minified, only show inactive current index
    if (minified)
      return <Pagination.Item disabled>{index + 1}</Pagination.Item>
    // define array
    const arr = Array.from(Array(length).keys());
    // less than 10 elements
    if (length <= 9)
      return arr.map(n => <Pagination.Item key={n} active={n === index} onClick={() => change(n)}>{n + 1}</Pagination.Item>);
    // create array
    const elements : JSX.Element[] = [];
    // more than 9 elements
    for (let i = -2; i <= 2; ++i) {
      const n = Math.min(Math.max(index, 2), length - 3) + i;
      elements.push(<Pagination.Item key={n} active={n === index} onClick={() => change(n)}>{n + 1}</Pagination.Item>);
    }
    // add elements to back, when no ellipses and last element is added
    if (index === length - 4) {
      elements.unshift(<Pagination.Item key={length - 7} onClick={() => change(length - 7)}>{length - 6}</Pagination.Item>);
    } else if (index >= length - 3) {
      elements.unshift(<Pagination.Item key={length - 6} onClick={() => change(length - 6)}>{length - 5}</Pagination.Item>);
      elements.unshift(<Pagination.Item key={length - 7} onClick={() => change(length - 7)}>{length - 6}</Pagination.Item>);
    }
    // add elements to back, when no ellipses and last element is added
    if (index === 3) {
      elements.push(<Pagination.Item key={6} onClick={() => change(6)}>{7}</Pagination.Item>);
    } else if (index <= 2) {
      elements.push(<Pagination.Item key={6} onClick={() => change(5)}>{6}</Pagination.Item>);
      elements.push(<Pagination.Item key={7} onClick={() => change(6)}>{7}</Pagination.Item>);
    }
    // add ellipses and last element
    if (index < length - 5) {
      elements.push(<Pagination.Ellipsis key={'ellipse-back'} disabled />);
      elements.push(<Pagination.Item key={length - 1} onClick={() => change(length - 1)}>{length}</Pagination.Item>);
    } else if (index < length - 4) {
      elements.push(<Pagination.Item key={length - 2} onClick={() => change(length - 2)}>{length - 1}</Pagination.Item>);
      elements.push(<Pagination.Item key={length - 1} onClick={() => change(length - 1)}>{length}</Pagination.Item>);
    } else if (index < length - 3) {
      elements.push(<Pagination.Item key={length - 1} onClick={() => change(length - 1)}>{length}</Pagination.Item>);
    }
    // add ellipses and first element
    if (index == 3) {
      elements.unshift(<Pagination.Item key={0} onClick={() => change(0)}>{1}</Pagination.Item>);
    } else if (index == 4) {
      elements.unshift(<Pagination.Item key={1} onClick={() => change(1)}>{2}</Pagination.Item>);
      elements.unshift(<Pagination.Item key={0} onClick={() => change(0)}>{1}</Pagination.Item>);
    } else if (index > 4) {
      elements.unshift(<Pagination.Ellipsis key={'ellipse-front'} disabled />);
      elements.unshift(<Pagination.Item key={0} onClick={() => change(0)}>{1}</Pagination.Item>);
    }
    // return elements
    return elements;
  }, [length, index, minified, change]);

  return (
    <Pagination>
      {/*<Pagination.First onClick={() => change(0)} />*/}
      <Pagination.Prev disabled={index === 0} onClick={() => change(index - 1)} />
      {elements}
      <Pagination.Next disabled={index === (length - 1)} onClick={() => change(index + 1)} />
      {/*<Pagination.Last onClick={() => change(length - 1)} />*/}
    </Pagination>
  );

}


export function MinifiedPagination (props : { onChange: (index : number) => void, length: number }) {
  return <SimplePagination {...props} minified />;
}
