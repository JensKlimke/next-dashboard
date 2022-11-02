import {ReactElement} from "react";
import {useAmplifyApi} from "./amplify-api";
import GenericApiComponent from "../GenericApiComponent";


type Props = {
  api: string
  path: string
  parameters?: object
  children: ((result: any) => ReactElement)
}

export default function AmplifyApi({api, path, parameters, children} : Props) {
  // use hook for amplify API
  const {data, loading, error, reload} = useAmplifyApi(api, path, parameters);
  // general API component
  return (
    <GenericApiComponent reload={reload} data={data} loading={loading} error={error}>
      {children}
    </GenericApiComponent>
  );
}
