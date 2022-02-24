import { useEffect, useState } from 'react';
import { Form, FormGroup, Label, Button, Input, Toast, ToastHeader, ToastBody, Spinner } from 'reactstrap';
import { useParams } from 'react-router-dom';
import axios from 'util/axiosConfig';
import BackButton from 'components/BackButton';
import PermissionDeniedPage from 'pages/ErrorPages/PermissionDeniedPage';
import ResourceNotFoundPage from 'pages/ErrorPages/ResourceNotFoundPage';

export default function UpdateUserPage({ setIsAuthenticated, authInfo }) {
  const successPasswordToastBody = {
    header: 'Password Changed',
    body: 'Your password was changed successfully.',
  };

  const errorPasswordToastBody = {
    header: 'Password change failed',
    body: 'Could not change your password. Ensure you are using a complex password and try again.'
  };

  const matchPasswordsToastBody = {
    header: 'Passwords do not match',
    body: 'Reenter your password to ensure the passwords match.'
  };

  const successEditUserToastBody = {
    header: 'User Updated',
    body: 'User details were updated successfully'
  };

  const errorEditUserToastBody = {
    header: 'Edit User Details Failed',
    body: 'Could not update user details, try again in a bit.'
  };

  const params = useParams();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordChangeToastOpen, setIsPasswordChangeToastOpen] = useState(false);
  const [passwordChangeToastContent, setPasswordChangeToastContent] = useState(successPasswordToastBody);
  const [editUserToastContent, setEditUserToastContent] = useState(successEditUserToastBody);
  const [isEditUserDetailsToastOpen, setIsEditUserDetailsToastOpen] = useState(false);
  const [originalUserDetails, setOriginalUserDetails] = useState(null);
  const [isGetUserError, setIsGetUserError] = useState(false);

  useEffect(() => {
    axios.get(`/api/users/${params.userId}`).then((res) => {
      setFirstName(res.data.first_name);
      setLastName(res.data.last_name);
      setEmail(res.data.email);
      setOriginalUserDetails(res.data);
    }).catch(() => {
      setIsGetUserError(true);
    });
  }, [params.userId])

  const changePassword = () => {
    if (password === confirmPassword) {
      axios.patch(`/api/users/${params.userId}`, {
        password,
      }).then(() => {
        setIsPasswordChangeToastOpen(true);
        setPasswordChangeToastContent(successPasswordToastBody);
        setPassword('');
        setConfirmPassword('');
        setIsAuthenticated(false);
      }).catch(() => {
        setIsPasswordChangeToastOpen(true);
        setPasswordChangeToastContent(errorPasswordToastBody);
        setPassword('');
        setConfirmPassword('');
      });
    } else {
      setIsPasswordChangeToastOpen(true);
      setPasswordChangeToastContent(matchPasswordsToastBody);
      setPassword('');
      setConfirmPassword('');
    }
  };

  const updateUserDetails = () => {
    axios.patch(`/api/users/${params.userId}`, {
      first_name: firstName,
      last_name: lastName,
      email,
    }).then((res) => {
      setOriginalUserDetails(res.data);
      setEditUserToastContent(successEditUserToastBody);
      setIsEditUserDetailsToastOpen(true);
    }).catch(() => {
      setEditUserToastContent(errorEditUserToastBody);
      setIsEditUserDetailsToastOpen(true);
      setFirstName(originalUserDetails.first_name);
      setLastName(originalUserDetails.last_name);
      setEmail(originalUserDetails.email);
    });
  };

  if (isGetUserError) {
    return <ResourceNotFoundPage />;
  }

  if (!originalUserDetails) {
    return <Spinner />;
  }

  if (!(authInfo.currentUser.isOwner || authInfo.currentUser.id === originalUserDetails.id)) {
    return <PermissionDeniedPage />;
  }

  return (
    <div>
      <BackButton to={`/account/users/${params.userId}/view`} />
      <h1 className="fw-bold">
        Edit User
      </h1>
      <Form className="mx-auto mb-5" style={{ maxWidth: '500px' }}>
        <Toast isOpen={isEditUserDetailsToastOpen} className="mb-4 w-100">
          <ToastHeader toggle={() => setIsEditUserDetailsToastOpen(false)}>
            {editUserToastContent.header}
          </ToastHeader>
          <ToastBody>
            {editUserToastContent.body}
          </ToastBody>
        </Toast>
        <FormGroup>
          <Label>
            First Name
          </Label>
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value.trim())}
            placeholder="First name"
          />
        </FormGroup>
        <FormGroup>
          <Label>
            Last Name
          </Label>
          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value.trim())}
            placeholder="Last name"
          />
        </FormGroup>
        <FormGroup>
          <Label>
            Email
          </Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            placeholder="Email"
          />
        </FormGroup>
        <Button color="primary" className="w-100" onClick={updateUserDetails}>
          Edit User Details
        </Button>
      </Form>
      <h1 className="fw-bold">
        Change Password
      </h1>
      <p>
        You will be asked to log in with your new password after changing your password.
      </p>
      <Form className="mx-auto mb-5" style={{ maxWidth: '500px' }}>
        <Toast isOpen={isPasswordChangeToastOpen} className="mb-4 w-100">
          <ToastHeader toggle={() => setIsPasswordChangeToastOpen(false)}>
            {passwordChangeToastContent.header}
          </ToastHeader>
          <ToastBody>
            {passwordChangeToastContent.body}
          </ToastBody>
        </Toast>
        <FormGroup>
          <Label>
            New Password
          </Label>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="New password"
          />
        </FormGroup>
        <FormGroup>
          <Label>
            Confirm New Password
          </Label>
          <Input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            placeholder="Confirm new password"
          />
        </FormGroup>
        <Button color="primary" onClick={changePassword} className="w-100">
          Change Password
        </Button>
      </Form>
    </div>
  );
}
