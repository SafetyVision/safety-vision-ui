import { useState, useEffect } from 'react';
import axios from 'util/axiosConfig';
import LiveFeed from 'components/LiveFeed/index';
import { Spinner, Table, Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Link } from 'react-router-dom';

export default function ListDevicesPage() {
  const [devices, setDevices] = useState(null);
  const [liveFeedDevice, setLiveFeedDevice] = useState(null);

  useEffect(() => {
    if (!devices) {
      axios.get('/api/devices').then((res) => {
        setDevices(res.data);
      });
    }
  }, [devices])

  const handleShowLiveFeed = (device) => {
    setLiveFeedDevice(device);
  }

  const deleteDevice = (id) => {
    axios.delete(`/api/devices/${id}`).then(() => {
      setDevices(null);
    });
  }

  const mapDeviceToTableRow = (device) => (
    <tr key={device.id}>
      <td className="align-middle">
        {device.location}
      </td>
      <td className="align-middle">
        {device.stream_name}
      </td>
      <td className="text-end align-middle">
        <Button className="w-100" color="primary" onClick={() => handleShowLiveFeed(device)}>
          Live View
        </Button>
      </td>
      <td className="text-end align-middle" >
        <Button className="mx-1 w-100" tag={Link} to={`/devicemanager/${device.id}/edit`}>
          Edit
        </Button>
      </td>
      <td className="text-end align-middle">
        <Button color="danger" onClick={() => deleteDevice(device.id)} className="w-100">
          Delete
        </Button>
      </td>

    </tr>
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center pb-4">
        <h1 className="fw-bold">Device Manager</h1>
        <Button tag={Link} to="/devicemanager/add" color="primary" >
          Add Device
        </Button>
      </div>
      {
        devices ? (
          <div>
            <Table striped borderless responsive>
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Stream Name</th>
                  <th />
                  <th />
                  <th />
                </tr>
              </thead>
              <tbody className="border-top border-bottom">
                {devices.map(mapDeviceToTableRow)}
              </tbody>
            </Table>
            <Modal isOpen={liveFeedDevice} toggle={() => setLiveFeedDevice(null)} size="xl">
              <ModalHeader toggle={() => setLiveFeedDevice(null)}>
                {liveFeedDevice ? liveFeedDevice.stream_name : ""}
              </ModalHeader>
              <ModalBody>
                <LiveFeed url={liveFeedDevice ? liveFeedDevice.stream_url : null} />
              </ModalBody>
            </Modal>
          </div>
        ) : (
          <Spinner />
        )
      }
    </div>
  )
}
