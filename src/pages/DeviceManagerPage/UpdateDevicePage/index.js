import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import axios from 'util/axiosConfig';
import { Button, Form, FormGroup, Label, Input, Toast, ToastBody, ToastHeader, Row, Col } from 'reactstrap';
import BackButton from 'components/BackButton';
import { Link } from 'react-router-dom';

export default function UpdateDevicePage() {
  const successToastContent = {
    header: 'Device Updated',
    body: 'Your device was successfully updated. Click the back button to see changes.',
  };

  const errorToastContent = {
    header: 'Device could not be updated',
    body: 'Try again with a valid Device details.',
  }

  const [description, setDescription] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [originalDescription, setOriginalDescription] = useState('');
  const [toastContent, setToastContent] = useState(successToastContent);
  const { locationId, deviceSerialNumber } = useParams();

  useEffect(() => {
    axios.get(`/api/devices/${deviceSerialNumber}`).then((res) => {
      setDescription(res.data.description);
      setOriginalDescription(res.data.description);
    });
  }, [deviceSerialNumber]);

  const updateDevice = () => {
    setIsOpen(false);
    axios.patch(`/api/devices/${deviceSerialNumber}`, {
      description: description.trim(),
      location: locationId
    }).then(() => {
      setToastContent(successToastContent);
      setIsOpen(true);
      setOriginalDescription(description);
    }).catch(() => {
      setDescription(originalDescription);
      setToastContent(errorToastContent);
      setIsOpen(true);
    });
  };

  return (
    <div>
      <BackButton to={`/location-manager/${locationId}/edit`} />
      <h1 className="fw-bold">Edit Device</h1>
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
            Device Description
          </Label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ maxWidth: '500px' }}
          />
        </FormGroup>
        <Button color="primary" onClick={updateDevice} className="w-100">Update Device</Button>
      </Form>
    </div>
  );
}
