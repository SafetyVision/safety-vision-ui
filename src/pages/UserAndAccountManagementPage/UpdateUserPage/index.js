import { useEffect, useState } from 'react';
import { Form, FormGroup, Label, Button, Input, Toast, ToastHeader, ToastBody } from 'reactstrap';
import { useParams } from 'react-router-dom';
import axios from 'util/axiosConfig';
import { useNavigate } from 'react-router-dom';

export default function UpdateUserPage({ setIsAuthenticated }) {
  const successToastBody = {
    header: 'Password Changed',
    body: 'Your password was changed successfully.',
  }

  const errorToastBody = {
    header: 'Password change failed',
    body: 'Could not change your password. Ensure you are using a complex password and try again.'
  }

  const matchPasswordsToastBody = {
    header: 'Passwords do not match',
    body: 'Reenter your password to ensure the passwords match.'
  }

  const navigate = useNavigate();
  const params = useParams();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordChangeToastOpen, setIsPasswordChangeToastOpen] = useState(false);
  const [passwordChangeToastContent, setPasswordChangeToastContent] = useState(successToastBody);
  const [isEditUserDetailsToastOpen, setIsEditUserDetailsToastOpen] = useState(false);
  const [originalUserDetails, setOriginalUserDetails] = useState();

  useEffect(() => {
    axios.get(`/api/users/${params.userId}`).then((res) => {
      setFirstName(res.data.first_name);
      setLastName(res.data.last_name);
      setEmail(res.data.email);
      setOriginalUserDetails(res.data);
    })
  }, [params.userId])

  const changePassword = () => {
    if (password === confirmPassword) {
      axios.patch(`/api/users/${params.userId}`, {
        password,
      }).then(() => {
        setIsPasswordChangeToastOpen(true);
        setPasswordChangeToastContent(successToastBody);
        setPassword('');
        setConfirmPassword('');
        setIsAuthenticated(false);
      }).catch(() => {
        setIsPasswordChangeToastOpen(true);
        setPasswordChangeToastContent(errorToastBody);
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
    }).then(() => {
      navigate(`/account/users/${params.userId}/view`, { replace: true });
    }).catch(() => {
      setIsEditUserDetailsToastOpen(true);
      setFirstName(originalUserDetails.first_name);
      setLastName(originalUserDetails.last_name);
      setEmail(originalUserDetails.email);
    })
  };

  return (
    <div>
      <h1 className="fw-bold">
        Edit User
      </h1>
      <Form className="mx-auto mb-5" style={{ maxWidth: '500px' }}>
        <Toast isOpen={isEditUserDetailsToastOpen} className="mb-4 w-100">
          <ToastHeader toggle={() => setIsEditUserDetailsToastOpen(false)}>
            Edit User Details Failed
          </ToastHeader>
          <ToastBody>
            Could not update user details, try again in a bit.
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
