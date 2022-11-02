import {useCallback, useEffect, useState} from "react";
import {API, Auth} from "aws-amplify";

export function useAmplifyApi (api: string, path: string, parameters?: object) {
  // result
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
    // set result to null
    setLoading(true);
    setData(undefined);
    setError(undefined);
    // load resource
    Auth.currentSession().then(session => {
      API.get(api, path, {
        queryStringParameters: {...parameters},
        headers: {
          Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
        }
      })
        .then(g => setData(g), e => errorHandler('err-api-1', e))
        .catch(e => errorHandler('err-api-2', e))
        .then(() => setLoading(false))
    })
      .catch(e => errorHandler('err-api-3', e));
  }, [api, path, parameters]);
  // load on startup
  useEffect(reload, [reload]);
  // return result
  return {data, loading, error, reload};
}
