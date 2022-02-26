import  { useState, useEffect } from 'react';
import axios from 'util/axiosConfig';
import { Table, Spinner, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import formatTimestamp from 'util/dates';

export default function ListInfractionEventsPage() {
  const [infractionEvents, setInfractionEvents] = useState(null)

  useEffect(() => {
    axios.get('/api/infraction_events/').then((res) => {
      setInfractionEvents(res.data);
    });
  }, []);

  const mapInfractionEventToTableRow = (infractionEvent) => (
    <tr key={infractionEvent.id}>
      <td className="align-middle">
        {infractionEvent.id}
      </td>
      <td className="align-middle">
        <Link to={`/locations/${infractionEvent.location.id}/view`} className="text-decoration-none">
          {infractionEvent.location.description}
        </Link>
      </td>
      <td className="align-middle">
        <Link to={`/infraction-types/${infractionEvent.infraction_type.id}/view`} className="text-decoration-none">
          {infractionEvent.infraction_type.infraction_type_name}
        </Link>
      </td>
      <td className="align-middle">
        {formatTimestamp(infractionEvent.infraction_date_time)}
      </td>
      <td className="text-end align-middle">
        <Button className="w-100" color="primary" tag={Link} to={`/infraction-events/${infractionEvent.id}/view`}>
          View
        </Button>
      </td>
    </tr>
  );

  return (
    <div>
      <h1>
        Infraction Events
      </h1>
      {
        infractionEvents ? (
          <Table striped borderless responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Location</th>
                <th>Infraction Type</th>
                <th>Infraction Time</th>
                <th />
              </tr>
            </thead>
            <tbody className="border-top border-bottom">
              {infractionEvents.map(mapInfractionEventToTableRow)}
            </tbody>
          </Table>
        ) : (
          <Spinner />
        )
      }
    </div>
  );
}
