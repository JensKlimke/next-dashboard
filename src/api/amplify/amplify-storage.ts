import {useCallback, useEffect, useState} from "react";
import {Storage} from "aws-amplify";

export function useStorageText (path : string) {
  // states
  const [content, setContent] = useState<string>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);
  // callback to load data
  const reload = useCallback(() => {
    // set loading
    setError(undefined);
    setLoading(true);
    // get content as text
    Storage.get(path, { download: true })
      // @ts-ignore
      .then(r => new Response(r.Body).text())
      .then((d) => setContent(d))
      .catch(e => e.message ? setError(e.message) : setError(e))
      .then(() => setLoading(false))
  }, [path]);
  // load on startup
  useEffect(reload, []);
  // return result
  return {content, loading, error, reload};
}
