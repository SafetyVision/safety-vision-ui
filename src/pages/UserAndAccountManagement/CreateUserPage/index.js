import { Form, FormGroup, Label, Input, Button, Toast, ToastHeader, ToastBody, Spinner } from 'reactstrap';
import { useState } from 'react';
import axios from 'util/axiosConfig';
import { Link } from 'react-router-dom';
import BackButton from 'components/BackButton';
import PermissionDeniedPage from 'pages/ErrorPages/PermissionDeniedPage';

export default function CreateUserPage({ authInfo }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [user, setUser] = useState(null);

  const clearPasswords = () => {
    setPassword('');
    setConfirmPassword('');
  }

  const clearForm = () => {
    clearPasswords();
    setFirstName('');
    setLastName('');
    setEmail('');
  }

  const addUser = () => {
    if (password === confirmPassword) {
      axios.post('/api/users/', {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      }).then((res) => {
        clearForm();
        setIsSuccess(true);
        setUser(res.data);
      }).catch(() => {
        setIsError(true);
        clearPasswords()
      })
    } else {
      setIsError(true);
      clearPasswords();
    }
  };

  if (!authInfo.currentUser) {
    return <Spinner />;
  }

  if (!authInfo.currentUser.isOwner) {
    return <PermissionDeniedPage />;
  }

  return (
    <div>
      <BackButton to="/account/users" />
      <h1 className="fw-bold">
        Add User
      </h1>
      <Form className="mx-auto" style={{ maxWidth: '500px' }}>
        <Toast isOpen={isError} className="mb-3 w-100" >
          <ToastHeader toggle={() => setIsError(false)}>
            Could Not Add User
          </ToastHeader>
          <ToastBody>
            Please provide valid user data and try again.
          </ToastBody>
        </Toast>
        {
          user && (
            <Toast isOpen={isSuccess} className="mb-3 w-100" >
              <ToastHeader toggle={() => setIsSuccess(false)}>
                User Added Successfully
              </ToastHeader>
              <ToastBody>
                View your new user, {user.first_name}, &nbsp;
                <Link to={`/account/users/${user.id}/view`}>here</Link>
                .
              </ToastBody>
            </Toast>
          )
        }
        <FormGroup>
          <Label>First Name</Label>
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value.trim())}
            placeholder="First name"
          />
        </FormGroup>
        <FormGroup>
          <Label>Last Name</Label>
          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value.trim())}
            placeholder="Last name"
          />
        </FormGroup>
        <FormGroup>
          <Label>Email</Label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            placeholder="example@email.com"
            type="email"
          />
        </FormGroup>
        <FormGroup>
          <Label>Password</Label>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
          />
        </FormGroup>
        <FormGroup>
          <Label>Confirm Password</Label>
          <Input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            type="password"
          />
        </FormGroup>
        <Button className="w-100" color="primary" onClick={addUser}>
          Add User
        </Button>
      </Form>
    </div>
  );
}
