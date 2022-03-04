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
import { Link, Navigate } from 'react-router-dom';

export default function SignUpPage({
  authInfo,
  setIsAuthenticated,
}) {
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState({ header: null, body: () => null });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [account_name, setAccountName] = useState('');

  const createAccount = () => {
    if (password !== confirmPassword) {
      setIsError(true);
      setPassword('');
      setConfirmPassword('');
      setError({
        header: 'Passwords Do Not Match',
        body: () => (
          <p>Your passwords did not match. Reenter your password and try again.</p>
        )
      });

      return;
    }
    axios.post('/api/accounts/register', {
      account_name: account_name.trim(),
      users: [
        {
          first_name,
          last_name,
          email,
          password,
        }
      ],
    }).then(() => {
      axios.post('/api/login/', {
        username: email,
        password,
      }).then(() => {
        setIsAuthenticated(true);
      }).catch(() => {
        setIsError(true);
        setError({
          header: 'Login Failed',
          body: () => (
            <p>Your account has successfully been created, but log in failed. Try logging in <Link to="/login">here</Link>.</p>
          ),
        })
        setPassword('');
        setConfirmPassword('');
      });
    }).catch(() => {
      setIsError(true);
      setError({
        header: 'Account Creation Failed',
        body: () => (<p>Failed to create this account. Try again.</p>),
      });
      setPassword('');
      setConfirmPassword('');
    });
  };

  if (authInfo.currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <div className="mx-auto" style={{ 'maxWidth': '500px' }}>
      <Toast isOpen={isError} className="w-100 mb-3">
        <ToastHeader toggle={() => setIsError(false)}>
          {error.header}
        </ToastHeader>
        <ToastBody>
          {error.body()}
        </ToastBody>
      </Toast>
      <Form>
        <h1>
          Create Account
        </h1>
        <FormGroup>
          <Label>
            Company/Organization Name
          </Label>
          <Input
            id="account"
            name="account"
            placeholder="Your company/organization"
            value={account_name}
            onChange={(e) => setAccountName(e.target.value)}
          />
        </FormGroup>
        <FormGroup className="pt-3">
          <Label>
            First Name
          </Label>
          <Input
            id="first_name"
            name="first_name"
            placeholder="First name"
            value={first_name}
            onChange={(e) => setFirstName(e.target.value.trim())}
          />
        </FormGroup>
        <FormGroup>
          <Label>
            Last Name
          </Label>
          <Input
            id="last_name"
            name="last_name"
            placeholder="Last name"
            value={last_name}
            onChange={(e) => setLastName(e.target.value.trim())}
          />
        </FormGroup>
        <FormGroup className="pt-3">
          <Label>
            Email
          </Label>
          <Input
            id="email"
            name="email"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label>
            Password
          </Label>
          <Input
            id="password"
            name="password"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label>
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </FormGroup>
        <Button color="primary" onClick={createAccount} className="w-100">
          Create Account
        </Button>
      </Form>
    </div>
  );
}
