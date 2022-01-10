import { useEffect, useState } from 'react';
import axios from 'util/axiosConfig';
import { Button, Form, FormGroup, Label, Input, Toast, ToastBody, ToastHeader } from 'reactstrap';
import BackButton from 'components/BackButton';

export default function UpdateAccountPage({ authInfo }) {
  const successToastContent = {
    header: 'Account name updated',
    body: 'Your account Name was successfully updated.',
  };

  const errorToastContent = {
    header: 'Account name could not be updated',
    body: 'Try again with a valid account name.',
  }

  const [accountName, setAccountName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [originalAccountName, setOriginalAccountName] = useState('');
  const [toastContent, setToastContent] = useState(successToastContent);

  useEffect(() => {
    if (authInfo.currentUser) {
      axios.get(`/api/accounts/${authInfo.currentUser.account}`).then((res) => {
        setAccountName(res.data.account_name);
        setOriginalAccountName(res.data.account_name);
      });
    }
  }, [authInfo.currentUser]);

  const updateAccount = () => {
    axios.patch(`/api/accounts/${authInfo.currentUser.account}`, {
      account_name: accountName.trim(),
      login_identifier: accountName.toLowerCase(),
    }).then(() => {
      setToastContent(successToastContent);
      setIsOpen(true);
      setOriginalAccountName(accountName);
    }).catch(() => {
      setAccountName(originalAccountName);
      setToastContent(errorToastContent);
      setIsOpen(true);
    });
  };

  return (
    <div>
      <BackButton to="/account" />
      <h1 className="pb-4 fw-bold">Edit Account</h1>
      <Form style={{ maxWidth: '500px' }} className="mx-auto">
        <Toast isOpen={isOpen} className="w-100 mb-3">
          <ToastHeader toggle={() => setIsOpen(false)}>
            {toastContent.header}
          </ToastHeader>
          <ToastBody>
            {toastContent.body}
          </ToastBody>
        </Toast>
        <FormGroup>
          <Label>
            Company/Organization Name
          </Label>
          <Input
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            style={{ maxWidth: '500px' }}
          />
        </FormGroup>
        <Button color="primary" onClick={updateAccount} className="w-100">Update Account Name</Button>
      </Form>
    </div>
  );
}
