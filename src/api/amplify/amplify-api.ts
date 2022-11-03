import {useCallback, useEffect, useState} from "react";
import {API} from "aws-amplify";
import {useAuth} from "auth/contexts/auth";

export function useAmplifyApi (api: string, path: string, parameters?: object) {
  // result
  const auth = useAuth();
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();
  // set error
  const errorHandler = (source : string, err : any) => {
    // log
    console.error(source, err);
    // set error state
    if(typeof err === 'string')
      setError(new Error(err));
    else if(err instanceof Error)
      setError(err);
  }
  // call api
  const reload = useCallback(() => {
    // only load with token
    if (!auth.token)
      return;
    // set result to null
    setLoading(true);
    setData(undefined);
    setError(undefined);
    // load resource
    API.get(api, path, {
      queryStringParameters: {...parameters},
      headers: { Authorization: `Bearer ${auth.token}` }
    })
      .then(g => setData(g), e => errorHandler('err-api-1', e))
      .catch(e => errorHandler('err-api-2', e))
      .then(() => setLoading(false))
  }, [api, path, parameters, auth.token]);
  // load on startup
  useEffect(reload, [reload]);
  // return result
  return {data, loading, error, reload};
}
