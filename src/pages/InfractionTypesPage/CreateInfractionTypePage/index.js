import { Form, FormGroup, Label, Input, Button, Toast, ToastHeader, ToastBody } from 'reactstrap';
import { useState } from 'react';
import axios from 'util/axiosConfig';
import BackButton from 'components/BackButton';

export default function CreateInfractionTypePage() {
  const [infractionName, setInfractionName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const clearForm = () => {
    setInfractionName('');
  };

  const createInfractionType = () => {
    setIsSuccess(false);
    setIsError(false);
    axios.post('/api/infraction_types/', {
      infraction_type_name: infractionName.trim(),
    }).then(() => {
      clearForm();
      setIsSuccess(true);
    }).catch(() => {
      setIsError(true);
    });
  };

  return (
    <div>
      <BackButton to="/infraction-types" />
      <h1 className="fw-bold">
        Create New Infraction Type
      </h1>
      <Form className="mx-auto" style={{ maxWidth: '500px' }} >
        <Toast isOpen={isSuccess} className="mb-3 w-100" >
          <ToastHeader toggle={() => setIsSuccess(false)}>
            Success
          </ToastHeader>
          <ToastBody>
            Infraction type created successfully.
          </ToastBody>
        </Toast>
        <Toast isOpen={isError} className="mb-3 w-100" >
          <ToastHeader toggle={() => setIsError(false)}>
            Infraction Type Create Failed
          </ToastHeader>
          <ToastBody>
            Ensure you are using valid infraction type name, and try again later.
          </ToastBody>
        </Toast>
        <FormGroup>
          <Label>Infraction Name</Label>
          <Input
            value={infractionName}
            onChange={(e) => setInfractionName(e.target.value)}
            placeholder="Infraction Name"
          />
        </FormGroup>
        <Button className="w-100" color="primary" onClick={createInfractionType}>
          Create Infraction Type
        </Button>
      </Form>
    </div>
  );
}
