import { useEffect, useState } from 'react';
import axios from 'util/axiosConfig';
import { Spinner, Table, Button } from 'reactstrap';
import { Link, useParams } from 'react-router-dom';
import BackButton from 'components/BackButton';

export default function InfractionTypesPage() {
    const [infractionTypes, setInfractionTypes] = useState(null);
    const params = useParams();

    useEffect(() => {
      if (infractionTypes === null) {
        axios.get('/api/infraction_types/').then((res) => {
          setInfractionTypes(res.data);
        });
      }
    }, [infractionTypes]);

    const mapInfractionToTableRow = (infractionTypes) => (
        <tr key={infractionTypes.id}>
          <td className="align-middle">
            {infractionTypes.infraction_type_name}
          </td>
          <td className="text-end align-middle">
            <Button className="w-100" color="primary" tag={Link} to={`/device-manager/${params.deviceId}/infraction-types/${infractionTypes.id}/view`}>
              View
            </Button>
          </td>
          <td className="text-end align-middle">
            <Button className="mx-1 w-100" tag={Link} to={`/account/${infractionTypes.id}/edit`}>
              Edit
            </Button>
          </td>
        </tr>
    );

    return (
      <div>
        <BackButton to={`/device-manager/${params.deviceId}/edit`} />
        <div className="d-flex justify-content-between align-items-center pb-4">
          <h1 className="fw-bold">{`Infraction Types For Device #${params.deviceId}`}</h1>
        </div>
        {
          true ? (
            <Table striped borderless responsive>
              <thead>
                <tr>
                  <th>Infraction Name</th>
                  <th />
                  <th />
                </tr>
              </thead>
              <tbody className="border-top border-bottom">
                {infractionTypes === null ? 'No Infraction Types': infractionTypes.map(mapInfractionToTableRow)}
              </tbody>
            </Table>
          ) : (
            <Spinner />
          )
        }
      </div>
    );
}
