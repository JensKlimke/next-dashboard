import {useCallback, useEffect, useRef, useState} from "react";

export function useWebsocket (url: string, onMessage?: (msg: any) => void, handshake?: string) {
  // state and reference
  const [socket, setSocket] = useState<WebSocket>();
  const ref = useRef<WebSocket>();
  // on socket change
  useEffect(() => {
    ref.current = socket;
  }, [socket])
  // connect function
  const connect = useCallback(() => {
    // connect
    const s = new WebSocket(url);
    // callbacks
    (onMessage !== undefined) && s.addEventListener('message', (m) => onMessage(JSON.parse(m.data)));
    (handshake !== undefined) && s?.addEventListener('open', () => s.send(handshake));
    // on error, reconnect
    s.addEventListener('error', () => {
      if (s?.readyState === WebSocket.CLOSED)
        connect();
    });
    // set socket
    setSocket(s);
  }, [handshake, onMessage, url]);
  const disconnect = useCallback(() => {
    ref.current && ref.current.close();
  }, [])
  // on mount and unmount
  useEffect(() => {
    connect();
    return () => disconnect();
  }, [])
  // socket as return
  return socket;
}
