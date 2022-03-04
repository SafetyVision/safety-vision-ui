import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import axios from 'util/axiosConfig';
import { Button, Form, FormGroup, Label, Input, Toast, ToastBody, ToastHeader, Spinner, Table, Modal, ModalBody, ModalHeader } from 'reactstrap';
import BackButton from 'components/BackButton';
import { Link } from 'react-router-dom';
import LiveFeed from 'components/LiveFeed/index';

export default function UpdateLocationPage() {
  const successLocationToastContent = {
    header: 'Location Updated',
    body: 'Your Location was successfully updated.',
  };

  const errorLocationToastContent = {
    header: 'Location Could Not Be updated',
    body: 'Try again with a valid Location details.',
  };

  const successAddDeviceToastContent = {
    header: 'Device Added',
    body: 'Check table below for device.',
  };

  const errorAddDeviceToastContent = {
    header: 'Device Could Not Be added',
    body: 'Try again with a valid Device details',
  };

  const deviceAlreadyAssignedToastContent = {
    header: `Device Already Assigned`,
    body: `Unassign the device and try again.`,
  };

  const [isLocationToastOpen, setIsLocationToastOpen] = useState(false);
  const [locationToastContent, setLocationToastContent] = useState(successLocationToastContent);
  const [isDeviceToastOpen, setIsDeviceToastOpen] = useState(false);
  const [deviceToastContent, setDeviceToastContent] = useState(successAddDeviceToastContent);
  const [locationDescription, setLocationDescription] = useState('');
  const [originalLocationDescription, setOriginalLocationDescription] = useState('');
  const [devices, setDevices] = useState(null);
  const [liveFeedDevice, setLiveFeedDevice] = useState(null);
  const [loadDevices, setLoadDevices] = useState(true);
  const [serial_number, setSerialNumber] = useState('');
  const [deviceDescription, setDeviceDescription] = useState('');
  const { locationId } = useParams();

  const noDeviceFoundToastContent = {
    header: `Device With Serial Number [ ${serial_number} ] Not Found`,
    body: 'Try again with a valid serial number',
  }

  useEffect(() => {
    axios.get(`/api/locations/${locationId}`).then((res) => {
      setLocationDescription(res.data.description);
      setOriginalLocationDescription(res.data.description);
      setDevices(res.data.devices);
      setLoadDevices(false);
    });
  }, [locationId]);

  const updateLocation = () => {
    setIsLocationToastOpen(false);
    axios.patch(`/api/locations/${locationId}`, {
      description: locationDescription.trim(),
    }).then(() => {
      setLocationToastContent(successLocationToastContent);
      setIsLocationToastOpen(true);
      setOriginalLocationDescription(locationDescription);
    }).catch(() => {
      setLocationDescription(originalLocationDescription);
      setLocationToastContent(errorLocationToastContent);
      setIsLocationToastOpen(true);
    });
  };

  const clearForm = () => {
    setDeviceDescription('');
    setSerialNumber('');
  }

  const addDevice = () => {
    axios.get(`/api/devices/${serial_number}`).then((res) => {
      if (!res.data.location || res.data.location.toString() === locationId) {
        axios.patch(`/api/devices/${serial_number}`, {
          description: deviceDescription.trim(),
          location: locationId
        }).then(() => {
          clearForm();
          setDeviceToastContent(successAddDeviceToastContent);
          setIsDeviceToastOpen(true);
          setLoadDevices(true);
          axios.get(`/api/locations/${locationId}`).then((res) => {
            setDevices(res.data.devices);
            setLoadDevices(false);
          });
        }).catch(() => {
          setDeviceToastContent(errorAddDeviceToastContent);
          setIsDeviceToastOpen(true);
        });
      } else {
        setDeviceToastContent(deviceAlreadyAssignedToastContent);
        setIsDeviceToastOpen(true);
      }
    }).catch(() => {
      setDeviceToastContent(noDeviceFoundToastContent);
      setIsDeviceToastOpen(true);
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

  const formStyle = {
    maxWidth: '500px',
    marginBottom: '40px'
  }

  const locationToast = (isLocationToastOpen, locationToastContent) => (
    <Toast isOpen={isLocationToastOpen} className="w-100 mb-3">
      <ToastHeader toggle={() => setIsLocationToastOpen(false)}>
        {locationToastContent.header}
      </ToastHeader>
      <ToastBody>
        {locationToastContent.body}
      </ToastBody>
    </Toast>
  );

  const deviceToast = (isDeviceToastOpen, deviceToastContent) => (
    <Toast isOpen={isDeviceToastOpen} className="w-100 mb-3">
      <ToastHeader toggle={() => setIsDeviceToastOpen(false)}>
        {deviceToastContent.header}
      </ToastHeader>
      <ToastBody>
        {deviceToastContent.body}
      </ToastBody>
    </Toast>
  );

  const devicesTable = (devices) => (
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
          {devices.map(mapDeviceToTableRow)}
        </tbody>
      </Table>
      <Modal isOpen={!!liveFeedDevice} toggle={() => setLiveFeedDevice(null)} size="xl">
        <ModalHeader toggle={() => setLiveFeedDevice(null)}>
          {liveFeedDevice ? `Livefeed of Device [ ${liveFeedDevice.serial_number} ]`: ""}
        </ModalHeader>
        <ModalBody>
          <LiveFeed url={liveFeedDevice ? liveFeedDevice.stream_url : null} />
        </ModalBody>
      </Modal>
    </div>
  );

  const mapDeviceToTableRow = (device) => (
    <tr key={device.serial_number}>
      <td className="align-middle">
        {device.serial_number}
      </td>
      <td className="align-middle">
        {device.description}
      </td>
      <td className="text-end align-middle">
        <Button className="mx-2" color="primary" onClick={() => handleShowLiveFeed(device)}>
          Live View
        </Button>
        <Button tag={Link} to={`/training/${device.serial_number}/view`} className="mx-2">
          Infraction Detection Settings
        </Button>
        <Button className="mx-2" tag={Link} to={`/location-manager/${locationId}/device/${device.serial_number}`}>
          Edit Description
        </Button>
        <Button className="mx-2" color="danger" onClick={() => deleteDevice(device.serial_number)}>
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
        {locationToast(isLocationToastOpen, locationToastContent)}
        <FormGroup>
          <Label>
            Location Description
          </Label>
          <Input
            value={locationDescription}
            onChange={(e) => setLocationDescription(e.target.value)}
          />
        </FormGroup>
        <Button color="primary" onClick={updateLocation} className="w-100">Update Location</Button>
      </Form>

      <h3 className="fw-bold">Assign Device to {originalLocationDescription}</h3>
      <Form className="mx-auto" style={formStyle}>
        {deviceToast(isDeviceToastOpen, deviceToastContent)}
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
            Assign Device
        </Button>
      </Form>

      <div>
        <div className="d-flex justify-content-between align-items-center pb-4">
          <h3 className="fw-bold">Devices</h3>
        </div>
        {
          !loadDevices ? (
            devices && devices.length > 0 ? (
              devicesTable(devices)
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
