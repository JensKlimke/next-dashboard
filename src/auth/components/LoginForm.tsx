import {Button, Form} from "react-bootstrap";
import React, {useState} from "react";
import {useAuth} from "auth/contexts/auth";


export default function LoginForm() {
  // states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  // hooks
  const auth = useAuth();
  // callbacks
  const login = (event : React.FormEvent<HTMLFormElement>) => {
    // prevent default
    event.preventDefault();
    // loading
    setLoading(true);
    // login
    auth.login && auth.login(email, password)
        .then(() => setLoading(false))
        .catch(e => console.error(e))
  }
  // render
  return (
    <Form onSubmit={login}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Control onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder="Email address" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Control onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder="Password" />
      </Form.Group>
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
