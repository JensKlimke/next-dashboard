import {Button, Form, InputGroup} from "react-bootstrap";
import React, {useCallback, useMemo, useState} from "react";
import {ChangePasswordCallbackType} from "auth/types/auth";


export default function NewPassword({changePassword} : {changePassword : ChangePasswordCallbackType}) {
  // states
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [loading, setLoading] = useState(false);
  // callbacks
  const savePassword = useCallback((event : React.FormEvent<HTMLFormElement>) => {
    // prevent default
    event.preventDefault();
    // loading
    setLoading(true);
    // check
    if (password !== passwordRepeat) {
      alert("Passwords must be equal");
      setLoading(false);
      return;
    }
    // change password
    changePassword(password)
      .then(() => {})
      .catch(e => console.error(e))
      .then(() => setLoading(false));
  }, [password, passwordRepeat]);
  // calculate validity
  const equal = useMemo(() => {
    return password === passwordRepeat;
  }, [password, passwordRepeat]);
  // render
  return (
    <Form onSubmit={savePassword}>
      <Form.Group className="mb-3">
        <Form.Control
          onChange={(e) => setPassword(e.target.value)}
          value={password} type="password"
          placeholder="Password"
        />
      </Form.Group>
      <InputGroup hasValidation className="mb-3">
        <Form.Control
          onChange={(e) => setPasswordRepeat(e.target.value)}
          value={passwordRepeat}
          type="password"
          placeholder="Repeat Password"
          isInvalid={password !== passwordRepeat}
        />
        <Form.Control.Feedback type={equal ? "valid" : "invalid"}>{equal ? "Looks good" : "Must be equal"}</Form.Control.Feedback>
      </InputGroup>
      <div className="d-grid gap-2">
        <Button disabled={loading} variant="primary" type="submit">
          Save Password
        </Button>
      </div>
    </Form>
  );

}
