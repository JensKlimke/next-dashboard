import {Button, Form, InputGroup, Table} from "react-bootstrap";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {faSort, faSortDown, faSortUp, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {useCallback, useEffect, useState} from "react";

type ConfigType = {
  searchString?: (obj: any) => string
  cols: any
  format?: any
}

type SortType = {
  by: string
  dir: boolean
}

const defaultSort : SortType = {by: '#', dir: true};

export default function DataTable ({input, config} : {input: any[], config: ConfigType}) {
  // states
  const [search, setSearch] = useState<string>('');
  const [indices, setIndices] = useState<number[]>([]);
  const [sort, setSort] = useState<SortType>(defaultSort);
  // process input data
  useEffect(() => {
    // set default sort
    setSort( defaultSort );
  }, []);
  // process search filter
  useEffect(() => {
    // sort index
    let idcs = Array.from(Array(input.length).keys());
    if(sort.by === '#')
      idcs.sort((i, j) => compare(i, j, sort.dir));
    else
      idcs.sort((i, j) => compare(input[i][sort.by], input[j][sort.by], sort.dir));
    // filter devices
    if (config.searchString) {
      // @ts-ignore
      const idcf = idcs.filter(e => (similar(config.searchString(input[e]), search) > 0.5));
      // set indices
      setIndices(idcf);
    } else {
      setIndices(idcs);
    }
  }, [sort, search, config, input]);
  // sort callback
  const sortBy = useCallback((by : string) => {
    if (!sort) return;
    // standard direction is asc (=true)
    let dir = true;
    // if already sorted by this field, toggle direction
    if(sort.by === by)
      dir = !sort.dir;
    // set sort
    setSort({by, dir})
  }, [sort]);
  // set keys
  const keys = Object.keys(config.cols);
  // check keys
  if(keys.length === 0)
    throw new Error('Cols must be defined');
  // render table
  return (
    <>
      <InputGroup className="mb-3">
        <Form.Control
          placeholder='search'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="outline-secondary" onClick={() => setSearch('')}>
          <FontAwesomeIcon icon={faXmark} />
        </Button>
      </InputGroup>
      <Table className="thead-dark">
        <thead>
        <tr>
          <>
            <SortName field={'#'} sort={sort} callback={sortBy}>#</SortName>
            {
              keys.map(key =>
                <SortName key={`head-${key}`} field={key} sort={sort} callback={sortBy}>{config?.cols[key] || key}</SortName>
              )
            }
          </>
        </tr>
        </thead>
        <tbody>
          {
            indices.map((i: number) => (
              <tr key={`row-${i}`}>
                <td><i>{i}</i></td>
                {
                  keys.map(key =>
                    <td key={`row-${i}-col-${key}`}>
                      {(config?.format && config?.format[key]) ? config.format[key](input[i][key], input[i]) : input[i][key]}
                    </td>
                  )
                }
              </tr>
            ))
          }
        </tbody>
      </Table>
    </>
  )
}

/**
 * Function to compare two values (numbers and strings)
 * - returns -1 or 1 and not a boolean
 * - necessary for e.g. Chrome browser, since boolean does not sort stable
 */
function compare(a : any, b : any, dir : boolean) : number {
  if (dir)
    return (a < b) ? -1 : (a > b ? 1 : 0);
  else
    return (a > b) ? -1 : (a < b ? 1 : 0);
}

/**
 * Checks the similarity of a string
 * Returns 1, if the string exists in the text
 * returns 0, otherwise
 * @param text Text to be searched in
 * @param str String to be searched for
 */
function similar(text : string, str : string) {
  // create matcher
  const matcher = new RegExp(str, 'i');
  // check match
  if (text.match(matcher) !== null)
    return 1;
  // not found, return zero
  return 0;
}

function SortName ({field, sort, callback, children} : {field: string, sort: any, callback: any, children: string}) {

  let icon : IconProp = faSort;
  if(sort.by === field)
    icon = sort.dir ? faSortDown : faSortUp;

  return (
    <th scope="col" onClick={() => callback(field)}>
      <span>{children}</span>&nbsp;
      <FontAwesomeIcon icon={icon} color={icon ===  faSort ? '#ddd' : ''}/>
    </th>
  )
}
