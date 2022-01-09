import { useEffect, useState } from 'react';
import axios from 'util/axiosConfig';
import { Button, Form, FormGroup, Label, Input, Toast, ToastBody, ToastHeader } from 'reactstrap';

export default function UpdateAccountPage({ authInfo }) {
  const [accountName, setAccountName] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (authInfo.currentUser) {
      axios.get(`/api/accounts/${authInfo.currentUser.account}`).then((res) => {
        setAccountName(res.data.account_name);
      });
    }
  }, [authInfo.currentUser]);

  const updateAccount = () => {
    axios.patch(`/api/accounts/${authInfo.currentUser.account}`, {
      account_name: accountName.trim(),
      login_identifier: accountName.toLowerCase(),
    }).then(() => {
      setIsOpen(true);
    });
  };

  return (
    <div>
      <h1 className="pb-4 fw-bold">Update Your Account Name</h1>
      <Toast isOpen={isOpen} className="w-100 mb-3">
        <ToastHeader toggle={() => setIsOpen(false)}>
          Account name updated
        </ToastHeader>
        <ToastBody>
          Your account Name was successfully updated.
        </ToastBody>
      </Toast>
      <Form>
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
        <Button color="primary" onClick={updateAccount}>Update Account Name</Button>
      </Form>
    </div>
  );
}
