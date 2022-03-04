import { useEffect, useState } from 'react';
import axios from 'util/axiosConfig';
import { Spinner, Table, Button } from 'reactstrap';
import { Link } from 'react-router-dom';

export default function InfractionTypesPage() {
    const [infractionTypes, setInfractionTypes] = useState(null);

    useEffect(() => {
      if (!infractionTypes) {
        axios.get('/api/infraction_types/').then((res) => {
          setInfractionTypes(res.data);
        });
      }
    }, [infractionTypes]);

    const mapInfractionToTableRow = (infractionType) => (
        <tr key={infractionType.id}>
          <td className="align-middle">
            {infractionType.infraction_type_name}
          </td>
          <td className="text-end align-middle">
            <Button className="w-100" color="primary" tag={Link} to={`/infraction-types/${infractionType.id}/view`}>
              View
            </Button>
          </td>
        </tr>
    );

    const infractionTypesTable = () => infractionTypes.length ? (
      <Table striped borderless responsive>
        <thead>
          <tr>
            <th>Infraction Type Name</th>
            <th />
          </tr>
        </thead>
        <tbody className="border-top border-bottom">
          {infractionTypes.map(mapInfractionToTableRow)}
        </tbody>
      </Table>
    ) : (
      <p>No infractions types to show</p>
    );

    return (
      <div>
        <div className="d-flex justify-content-between align-items-center pb-4">
          <h1 className="fw-bold">Infraction Types</h1>
          <Button tag={Link} to="/infraction-types/add" color="primary" >
            Add Infraction Type
          </Button>
        </div>
        {infractionTypes ? infractionTypesTable() : <Spinner />}
      </div>
    );
}
