import { useEffect, useState } from 'react';
import axios from 'util/axiosConfig';
import { Spinner, Table, Button, Alert } from 'reactstrap';
import { Link, useParams } from 'react-router-dom';
import BackButton from 'components/BackButton';
import { NotificationManager } from 'react-notifications';
import { TrainingStates } from '../helper';

export default function ListTrainingInfractionsPage() {
  const [trainingModels, setTrainingModels] = useState(null);
  const [infractionTypes, setInfractionTypes] = useState(null);
  const [device, setDevice] = useState(null);
  const params = useParams();

  useEffect(() => {
    if (!device) {
      axios.get(`/api/devices/${params.deviceId}`).then((res) => {
        setDevice(res.data);
      });
    }
    if (!trainingModels) {
      axios.get(`/api/devices/${params.deviceId}/infraction_types/`).then((res) => {
        setTrainingModels(res.data);
      });
    }
    if (!infractionTypes){
      axios.get('/api/infraction_types/').then((res) => {
        setInfractionTypes(res.data);
      });
    }
  }, [trainingModels, infractionTypes, params.deviceId, device]);

  const deleteTrainingModel = (trainingModel) => {
    axios.delete(
      `/api/devices/${trainingModel.device}/infraction_types/${trainingModel.infraction_type}`
    ).then(() => {
      setTrainingModels(null);
    })
  };

  const pauseTrainingModel = trainingModel => {
    axios.post(
      `/api/devices/${trainingModel.device}/infraction_types/${trainingModel.infraction_type}/stop_predict`,
      {}).then(() => {
        setTrainingModels(null);
      }).catch(() => {
        NotificationManager.error(
          'Error pausing model prediction.',
          'Could Not Pause Model',
          5000,
        );
      });
  };

  const restartTrainingModel = trainingModel => {
    axios.post(
      `/api/devices/${trainingModel.device}/infraction_types/${trainingModel.infraction_type}/start_predict`,
      {}).then(() => {
        setTrainingModels(null);
      }).catch(() => {
        NotificationManager.error(
          'Model prediction paused.',
          'Success',
          5000,
        );
      });
  };

  const mapInfractionToTableRow = (trainingModel) => (
      <tr key={trainingModel.infraction_type}>
        <td className="align-middle">
          {infractionTypes[infractionTypes.map(type => type.id).indexOf(trainingModel.infraction_type)].infraction_type_name}
        </td>
        <td className="align-middle">
          {TrainingStates[trainingModel.training_state]}
        </td>
        <td className="align-middle">
          {trainingModel.is_predicting ? 'Active' : 'Inactive'}
        </td>
        <td className="text-end align-middle">
          {
            trainingModel.training_state !== 'trained' ? (
              <Button
                id={`trainButton${trainingModel.infraction_type}`}
                className="w-100"
                color="primary"
                tag={Link}
                to={`/training/${params.deviceId}/${trainingModel.infraction_type}/train`}
                disabled={!device.stream_url}
              >
                Train
              </Button>
            ) : (
              trainingModel.is_predicting ? (
                <Button
                  className="w-100"
                  color="secondary"
                  onClick={() => pauseTrainingModel(trainingModel)}
                >
                  Pause Prediction
                </Button>
              ) : (
                <Button
                  className="w-100"
                  color="secondary"
                  onClick={() => restartTrainingModel(trainingModel)}
                >
                  Restart Prediction
                </Button>
              )
            )
          }
        </td>
        <td className="text-end align-middle">
          <Button className="w-100" color="danger" onClick={() => deleteTrainingModel(trainingModel)}>
            Delete
          </Button>
        </td>
      </tr>
  );

  const trainedInfractionTypesTable = () => (
    <Table striped borderless responsive>
      <thead>
        <tr>
          <th>Infraction Type</th>
          <th>Training State</th>
          <th>Status</th>
          <th />
          <th />
        </tr>
      </thead>
      <tbody className="border-top border-bottom">
        {trainingModels.map(mapInfractionToTableRow)}
      </tbody>
    </Table>
  );

  // Used to wait for the fetches to load before rendering
  if (trainingModels === null || infractionTypes === null || !device) {
    return <Spinner />;
  }

  return (
    <div>
      <BackButton to={`/location-manager/${device.location}/edit`} />
      {
        !device.stream_url && (
          <Alert color="danger">
            This device isn't streaming. Start this device's stream to train it to detect infractions.
          </Alert>
        )
      }
      <div className="d-flex justify-content-between align-items-center pb-4">
        <h1 className="fw-bold">{`Training For Device #${params.deviceId}`}</h1>
        <Button
          id="addTrainingInfraction"
          tag={Link}
          to={`/training/${params.deviceId}/add`}
          color="primary"
          disabled={!device.stream_url}
        >
            Assign Infraction Type
        </Button>
      </div>
      {
        trainingModels ? (
          trainingModels.length ? trainedInfractionTypesTable() : <p>No infraction types to show</p>
        ) : (
          <Spinner />
        )
      }
    </div>
  );
}
