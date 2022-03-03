import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import axios from 'util/axiosConfig';
import { Button, Form, FormGroup, Label, Input, Toast, ToastBody, ToastHeader, Row, Col, Spinner, Table, Modal, ModalBody, ModalHeader } from 'reactstrap';
import BackButton from 'components/BackButton';
import { Link } from 'react-router-dom';
import LiveFeed from 'components/LiveFeed/index';

export default function UpdateLocationPage() {
  const successToastContent = {
    header: 'Device Updated',
    body: 'Your device was successfully updated.',
  };

  const errorToastContent = {
    header: 'Device could not be updated',
    body: 'Try again with a valid Device details.',
  }

  const [description, setDescription] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [originalDescription, setOriginalDescription] = useState('');
  const [toastContent, setToastContent] = useState(successToastContent);
  const [devices, setDevices] = useState(null);
  const [liveFeedDevice, setLiveFeedDevice] = useState(null);
  const [loadDevices, setLoadDevices] = useState(true);
  const [serial_number, setSerialNumber] = useState('');
  const [deviceDescription, setDeviceDescription] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const { locationId } = useParams();

  useEffect(() => {
    axios.get(`/api/locations/${locationId}`).then((res) => {
      setDescription(res.data.description);
      setOriginalDescription(res.data.description);
      setDevices(res.data.devices);
      setLoadDevices(false);
    });
  }, [locationId]);

  const updateLocation = () => {
    setIsOpen(false);
    axios.patch(`/api/locations/${locationId}`, {
      description: description.trim(),
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

  const clearForm = () => {
    setDeviceDescription('');
    setSerialNumber('');
}

  const addDevice = () => {
    axios.patch(`/api/devices/${serial_number}`, {
        description: deviceDescription.trim(),
        location: locationId
    }).then(() => {
        clearForm();
        setIsSuccess(true);
        setIsError(false);
        setLoadDevices(true);
        axios.get(`/api/locations/${locationId}`).then((res) => {
          setDevices(res.data.devices);
          setLoadDevices(false);
        });
    }).catch(() => {
        setIsError(true);
    });

  };

  const deleteDevice = (serial) => {
    axios.delete(`/api/devices/${serial}`).then(() => {
      setLoadDevices(true);
      axios.get(`/api/locations/${locationId}`).then((res) => {
        setDevices(res.data.devices);
        setLoadDevices(false);
      });
    });
  }

  const handleShowLiveFeed = (device) => {
    setLiveFeedDevice(device);
  }

  const buttonStyle = {
    'margin-left': '8px',
  }

  const formStyle = {
    maxWidth: '500px',
    'margin-bottom': '40px'
  }

  const mapDeviceToTableRow = (device) => (
    <tr key={device.serial_number}>
      <td className="align-middle">
        {device.serial_number}
      </td>
      <td className="align-middle">
        {device.description}
      </td>
      <td className="text-end align-middle">
        <Button style={buttonStyle} color="primary" onClick={() => handleShowLiveFeed(device)}>
          Live View
        </Button>
        <Button style={buttonStyle}>
          Train
        </Button>
        <Button style={buttonStyle} tag={Link} to={`/location-manager/${locationId}/device/${device.serial_number}`}>
          Edit
        </Button>
        <Button style={buttonStyle} color="danger" onClick={() => deleteDevice(device.serial_number)}>
          Delete
        </Button>
      </td>
    </tr>
  );

  return (
    <div>
      <BackButton to="/location-manager" />
      <h1 className="fw-bold">Edit Location</h1>
      <Form style={formStyle} className="mx-auto">
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
            Location Description
          </Label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ maxWidth: '500px' }}
          />
        </FormGroup>
        <Button color="primary" onClick={updateLocation} className="w-100">Update Location</Button>
      </Form>

      <h3 className="fw-bold">Add Device to Location</h3>
      <Form className="mx-auto" style={formStyle}>
          <Toast isOpen={isError} className="mb-3 w-100" >
            <ToastHeader toggle={() => setIsError(false)}>
                Could Not Add Device
            </ToastHeader>
            <ToastBody>
                Check if the serial number is correct
            </ToastBody>
          </Toast>
          {
            <Toast isOpen={isSuccess} className="mb-3 w-100" >
              <ToastHeader toggle={() => setIsSuccess(false)}>
                  Device Added Successfully
              </ToastHeader>
              <ToastBody>
                  View your new device below
              </ToastBody>
            </Toast>
          }
          <FormGroup>
            <Label>Serial Number</Label>
            <Input
                value={serial_number}
                onChange={(e) => setSerialNumber(e.target.value.replace(/\s/g,''))}
                placeholder="Serial Number"
            />
          </FormGroup>
          <FormGroup>
            <Label>Device Description</Label>
            <Input
                value={deviceDescription}
                onChange={(e) => setDeviceDescription(e.target.value)}
                placeholder="Device Description"
            />
          </FormGroup>
          <Button className="w-100" color="primary" onClick={addDevice}>
              Add Device
          </Button>
      </Form>

      <div>
        <div className="d-flex justify-content-between align-items-center pb-4">
          <h3 className="fw-bold">Devices</h3>
          {/* <Button tag={Link} to="/device-manager/add" color="primary" >
            Add Device
          </Button> */}
        </div>
        {
          !loadDevices ? (
            devices?.length > 0 ? (
              <div>
                <Table striped borderless responsive>
                  <thead>
                    <tr>
                      <th>Serial Number</th>
                      <th>Description</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody className="border-top border-bottom">
                    {devices?.map(mapDeviceToTableRow)}
                  </tbody>
                </Table>
                <Modal isOpen={liveFeedDevice} toggle={() => setLiveFeedDevice(null)} size="xl">
                  <ModalHeader toggle={() => setLiveFeedDevice(null)}>
                    {liveFeedDevice ? "Livefeed of Device [ " + liveFeedDevice.serial_number + " ]": ""}
                  </ModalHeader>
                  <ModalBody>
                    <LiveFeed url={liveFeedDevice ? liveFeedDevice.stream_url : null} />
                  </ModalBody>
                </Modal>
              </div>
            ) : (
              <h5>No devices assigned</h5>
            )
          ) : (
            <Spinner />
          )
        }
      </div>
    </div>
  );
}
