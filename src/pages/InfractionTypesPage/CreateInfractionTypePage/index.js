import { Form, FormGroup, Label, Input, Button, Toast, ToastHeader, ToastBody } from 'reactstrap';
import { useState } from 'react';
import axios from 'util/axiosConfig';
import BackButton from 'components/BackButton';

export default function CreateInfractionTypePage() {
  const [infractionName, setInfractionName] = useState('');
  // const [deviceId, setDeviceId] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [setInfractionType] = useState(null);

  const clearForm = () => {
    setInfractionName('');
    // setDeviceId('');
  }

  const createInfractionType = () => {
    axios.post('/api/infraction_types/create', {
      infraction_type_name: infractionName,
      // device_id: deviceId,
    }).then((res) => {
      clearForm();
      setIsSuccess(true);
      setInfractionType(res.data);
    }).catch(() => {
      setIsError(true);
    })
  };

  return (
    <div>
      <BackButton to="/infractionTypes" />
      <h1 className="fw-bold">
        Create Infraction Type
      </h1>
      <Form className="mx-auto" style={{ maxWidth: '500px' }}>
        <Toast isOpen={isError} className="mb-3 w-100" >
          <ToastHeader toggle={() => setIsError(false)}>
            Failed to Create Infraction Type
          </ToastHeader>
          <ToastBody>
            Please provide valid data and try again.
          </ToastBody>
        </Toast>
        {/* {
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
        } */}
        <FormGroup>
          <Label>Infraction Name</Label>
          <Input
            value={infractionName}
            onChange={(e) => setInfractionName(e.target.value.trim())}
            placeholder="Infraction Name"
          />
        </FormGroup>
        {/* <FormGroup>
          <Label>Device ID</Label>
          <Input
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value.trim())}
            placeholder="Device ID"
          />
        </FormGroup> */}
        <Button className="w-100" color="primary" onClick={createInfractionType}>
          Create Infraction Type
        </Button>
      </Form>
    </div>
  );
}
