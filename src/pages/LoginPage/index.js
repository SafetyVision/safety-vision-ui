import { Navigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  Toast,
  ToastHeader,
  ToastBody,
} from 'reactstrap';
import axios from 'util/axiosConfig';

export default function LoginPage({
  authInfo,
  setIsAuthenticated,
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);

  const login = () => {
    axios.post(
      '/api/login/', {
        username,
        password,
      }).then(() => {
        setIsAuthenticated(true);
      }).catch(() => {
        setIsError(true);
        setPassword('');
      });
  }

  const handlePasswordKeyPress = (event) => {
    if (event.key === 'Enter') login();
  }

  if (authInfo.isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="mx-auto" style={{ 'maxWidth': '500px' }}>
      <Toast isOpen={isError} className="w-100 mb-3">
        <ToastHeader toggle={() => setIsError(false)}>
          Log In Failed
        </ToastHeader>
        <ToastBody>
          The email and password you provided was not able to be authenticated. Enter a valid email and password and try again.
        </ToastBody>
      </Toast>
      <Form>
        <h1>
          Log In
        </h1>
        <FormGroup>
          <Label for="email">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            placeholder="Email"
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="password">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handlePasswordKeyPress}
          />
        </FormGroup>
        <Button color="primary" onClick={login} className="w-100">
          Log In
        </Button>
      </Form>
    </div>
  );
}
