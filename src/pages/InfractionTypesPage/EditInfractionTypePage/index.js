import { useEffect, useState } from 'react';
import axios from 'util/axiosConfig';
import { Button, Form, FormGroup, Label, Input, Toast, ToastBody, ToastHeader, Spinner } from 'reactstrap';
import BackButton from 'components/BackButton';
import ResourceNotFoundPage from 'pages/ErrorPages/ResourceNotFoundPage';
import { useParams } from 'react-router-dom';

export default function EditInfractionTypePage() {
  const successToastContent = {
    header: 'Infraction type name updated',
    body: 'Your infraction type was successfully updated.',
  };

  const errorToastContent = {
    header: 'Infraction type name could not be updated',
    body: 'Try again with a valid infraction type name.',
  }

  const [infractionTypeName, setInfractionTypeName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isFetchError, setIsFetchError] = useState(false);
  const [originalInfractionTypeName, setOriginalInfractionTypeName] = useState('');
  const [toastContent, setToastContent] = useState(successToastContent);
  const { infractionTypeId } = useParams();

  useEffect(() => {
    axios.get(`/api/infraction_types/${infractionTypeId}`).then((res) => {
      setInfractionTypeName(res.data.infraction_type_name);
      setOriginalInfractionTypeName(res.data.infraction_type_name);
    }).catch(() => {
      setIsFetchError(true);
    });
  }, [infractionTypeId]);

  const updateInfractionType = () => {
    setIsOpen(false);
    axios.patch(`/api/infraction_types/${infractionTypeId}`, {
      infraction_type_name: infractionTypeName.trim(),
    }).then(() => {
      setToastContent(successToastContent);
      setIsOpen(true);
      setOriginalInfractionTypeName(infractionTypeName);
    }).catch(() => {
      setInfractionTypeName(originalInfractionTypeName);
      setToastContent(errorToastContent);
      setIsOpen(true);
    });
  };

  if (isFetchError) {
    return <ResourceNotFoundPage />;
  }

  if (!originalInfractionTypeName) {
    return <Spinner />;
  }

  return (
    <div>
      <BackButton to={`/infraction-types/${infractionTypeId}/view`} />
      <h1 className="pb-4 fw-bold">Edit Infraction Type</h1>
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
            Infraction Type Name
          </Label>
          <Input
            value={infractionTypeName}
            onChange={(e) => setInfractionTypeName(e.target.value)}
            style={{ maxWidth: '500px' }}
          />
        </FormGroup>
        <Button color="primary" onClick={updateInfractionType} className="w-100">
          Update Infraction Type
        </Button>
      </Form>
    </div>
  );
}
