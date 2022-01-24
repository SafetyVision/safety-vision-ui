import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import axios from 'util/axiosConfig';
import { Button, Form, FormGroup, Label, Input, Toast, ToastBody, ToastHeader } from 'reactstrap';
import BackButton from 'components/BackButton';

export default function UpdateDevicePage() {
  const successToastContent = {
    header: 'Device Updated',
    body: 'Your device was successfully updated.',
  };

  const errorToastContent = {
    header: 'Device could not be updated',
    body: 'Try again with a valid Device details.',
  }

  const [location, setLocation] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [originalLocation, setOriginalLocation] = useState('');
  const [toastContent, setToastContent] = useState(successToastContent);
  const { deviceId } = useParams();

  useEffect(() => {
    axios.get(`/api/devices/${deviceId}`).then((res) => {
      setLocation(res.data.location);
      setOriginalLocation(res.data.location);
    });
  }, [deviceId]);

  const updateDevice = () => {
    setIsOpen(false);
    axios.patch(`/api/devices/${deviceId}`, {
      location: location.trim(),
    }).then(() => {
      setToastContent(successToastContent);
      setIsOpen(true);
      setOriginalLocation(location);
    }).catch(() => {
      setLocation(originalLocation);
      setToastContent(errorToastContent);
      setIsOpen(true);
    });
  };

  return (
    <div>
      <BackButton to="/devicemanager" />
      <h1 className="pb-4 fw-bold">Edit Device</h1>
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
            Device Location
          </Label>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{ maxWidth: '500px' }}
          />
        </FormGroup>
        <Button color="primary" onClick={updateDevice} className="w-100">Update Device</Button>
      </Form>
    </div>
  );
}
