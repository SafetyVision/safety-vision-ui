import { useState, useEffect } from 'react';
import axios from 'util/axiosConfig';
import LiveFeed from 'components/LiveFeed/index';
import { Spinner, Table, Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Link } from 'react-router-dom';

export default function ListLocationsPage() {
  const [locations, setLocations] = useState(null);
  const [liveFeedDevices, setLiveFeedDevices] = useState(null);
  const [liveFeedLocation, setLiveFeedLocation] = useState(null);
  const [loadLocations, setLoadLocations] = useState(true);


  useEffect(() => {
    if (!locations) {
      axios.get('/api/locations').then((res) => {
        setLoadLocations(false);
        setLocations(res.data);
      });
    }
  }, [locations])

  const handleShowLiveFeed = (location) => {
    setLiveFeedLocation(location);
    setLiveFeedDevices(location.devices);
  }

  const handleCloseLiveFeed = () => {
    setLiveFeedLocation(null);
    setLiveFeedDevices(null);
  }

  const deleteLocation = (id) => {
    axios.delete(`/api/locations/${id}`).then(() => {
      setLocations(null);
    });
  }

  const buttonStyle = {
    'margin-left': '8px'
  }

  const mapLocationToTableRow = (location) => (
    <tr key={location.id}>
      <td className="align-middle">
        {location.description}
      </td>
      {/* <td className="text-end align-middle">
        <Button className="w-100" color="primary" onClick={() => handleShowLiveFeed(location)}>
          Monitor
        </Button>
      </td>
      <td className="text-end align-middle" >
        <Button className="mx-1 w-100" tag={Link} to={`/location-manager/${location.id}/edit`}>
          Edit
        </Button>
      </td> */}
      <td className="text-end align-middle">
        <Button style={buttonStyle} color="primary" onClick={() => handleShowLiveFeed(location)}>
          Monitor
        </Button>
        <Button style={buttonStyle} tag={Link} to={`/location-manager/${location.id}/edit`}>
          Edit
        </Button>
        <Button style={buttonStyle} color="danger" onClick={() => deleteLocation(location.id)} className="">
          Delete
        </Button>
      </td>
    </tr>
  );

  const mapLiveFeedDevices = (device) => (
    <div>
      <LiveFeed url={device ? device.stream_url : null} />
    </div>
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center pb-4">
        <h1 className="fw-bold">Location Manager</h1>
        <Button tag={Link} to="/location-manager/add" color="primary" >
          Add Location
        </Button>
      </div>
      {
        !loadLocations ? (
          locations && locations.length !== 0 ? (
            <div>
              <Table striped borderless responsive>
                <thead>
                  <tr>
                    <th>Location</th>
                    <th />
                    {/* <th />
                    <th /> */}
                  </tr>
                </thead>
                <tbody className="border-top border-bottom">
                  {locations.map(mapLocationToTableRow)}
                </tbody>
              </Table>
              <Modal isOpen={liveFeedDevices} toggle={handleCloseLiveFeed} size="xl">
                <ModalHeader toggle={handleCloseLiveFeed}>
                  {liveFeedLocation ? "Monitor [ " + liveFeedLocation.description + " ]": ""}
                </ModalHeader>
                <ModalBody>
                  {
                    liveFeedDevices?.length > 0 ? liveFeedDevices.map(mapLiveFeedDevices) :
                    <p>No Devices Assoicated</p>
                  }
                </ModalBody>
              </Modal>
            </div>
          ) : (
            <h3>No Locations Found</h3>
          )
        ) : (
          <Spinner />
        )
      }
    </div>
  )
}
