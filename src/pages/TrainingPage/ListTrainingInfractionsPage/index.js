import { useEffect, useState } from 'react';
import axios from 'util/axiosConfig';
import { Spinner, Table, Button } from 'reactstrap';
import { Link, useParams } from 'react-router-dom';
import BackButton from 'components/BackButton';
import { TrainingStates } from '../helper';

export default function ListTrainingInfractionsPage() {
    const [trainingModels, setTrainingModels] = useState(null);
    const [infractionTypes, setInfractionTypes] = useState(null);
    const params = useParams();

    useEffect(() => {
      if (trainingModels === null) {
        axios.get(`/api/devices/${params.deviceId}/infraction_types/`).then((res) => {
          setTrainingModels(res.data);
        });
      }
      if (infractionTypes === null){
        axios.get('/api/infraction_types/').then((res) => {
          setInfractionTypes(res.data);
        });
      }
    }, [trainingModels, infractionTypes, params.deviceId]);

    const mapInfractionToTableRow = (trainingModels) => (
        <tr key={trainingModels.infraction_type}>
          <td className="align-middle">
            {infractionTypes[infractionTypes.map(e => e.id).indexOf(trainingModels.infraction_type)].infraction_type_name}
          </td>
          <td className="align-middle">
            {TrainingStates[trainingModels.training_state]}
          </td>
          <td className="align-middle">
            {trainingModels.is_predicting ? 'Active' : 'Inactive'}
          </td>
          <td className="text-end align-middle">
            <Button className="w-100" color="primary" tag={Link} to={`/training/${params.deviceId}/${trainingModels.infraction_type}/train`}>
              Train
            </Button>
          </td>
        </tr>
    );

    // Used to wait for the fetches to load before rendering
    if (trainingModels === null || infractionTypes === null) { 
      return <Spinner />;
    }

    return (
      <div>
        <BackButton to={`/device-manager`} />
        <div className="d-flex justify-content-between align-items-center pb-4">
          <h1 className="fw-bold">{`Training For Device #${params.deviceId}`}</h1>
          <Button tag={Link} to={`/training/${params.deviceId}/add/`} color="primary" className="h" >
              Assign Infraction Type
          </Button>
        </div>
        {
          true ? (
            <Table striped borderless responsive>
              <thead>
                <tr>
                  <th>Infraction Type</th>
                  <th>Training State</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody className="border-top border-bottom">
                {trainingModels === null ? 'No Infraction Types': trainingModels.map(mapInfractionToTableRow)}
              </tbody>
            </Table>
          ) : (
            <Spinner />
          )
        }
      </div>
    );
}