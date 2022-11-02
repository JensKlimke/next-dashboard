import {ReactElement} from "react";
import {Alert, Spinner} from "react-bootstrap";

type ApiComponentProps = {
  data: any | undefined
  loading: boolean
  error: Error | undefined
  reload: () => void
  children: ((result: any) => ReactElement)
}

export default function GenericApiComponent({data, loading, error, reload, children} : ApiComponentProps) {
  // show spinner, when loading
  if(loading)
    return <Spinner animation='grow' />;
  // show error
  if(error) {
    return (
      <Alert variant='danger' onClose={reload} dismissible>
        <strong>Error:</strong> {error.message}
      </Alert>
    );
  }
  // check data
  if(!data)
    return <span>No data</span>;
  // return the called function
  return children(data);
}
