import {Alert, Button, Form} from "react-bootstrap";
import React, {useCallback, useState} from "react";
import {SignInCallbackType} from "auth/types/auth";

export default function SignInForm({signIn} : {signIn : SignInCallbackType}) {
  // states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>();
  // callback
  const signInLocal = useCallback((event : React.FormEvent<HTMLFormElement>) => {
    // prevent default
    event.preventDefault();
    // set loading
    setLoading(true);
    // sign in
    signIn(email, password)
      .catch(e => e.message && setMessage(e.message))
      .then(() => setLoading(false));
  }, [signIn, email, password]);
  // render
  return (
    <Form onSubmit={signInLocal}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Control onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder="Email address" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Control onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder="Password" />
      </Form.Group>
      { message && <Alert variant='warning' onClose={() => setMessage(undefined)} dismissible>{message}</Alert> }
      <div className="d-grid gap-2">
        <Button disabled={loading} variant="primary" type="submit">
          Login
        </Button>
        <Button disabled={loading} variant="link" onClick={() => alert('Please contact the administrator!')}>
          Forgot password
        </Button>
      </div>
    </Form>
  );

}
