import { Form, FormGroup, Label, Input, Button, Toast, ToastHeader, ToastBody, Spinner } from 'reactstrap';
import { useEffect, useState } from 'react';
import axios from 'util/axiosConfig';
import { useParams } from 'react-router-dom';
import BackButton from 'components/BackButton';
import { removeAssignedInfractions } from '../helper';
import LiveFeed from 'components/LiveFeed';

export default function AddTrainingInfractionPage({ authInfo }) {
  const [allInfractionTypes, setAllInfractionTypes] = useState(null);
  const [trainingModels, setTrainingModels] = useState(null);
  const [streamDelay, setStreamDelay] = useState(0);
  const [betweenCaptures, setBetweenCaptures] = useState(0);
  const [numberCaptures, setNumberCaptures] = useState(0);
  const [infractionType, setInfractionType] = useState('');
  const [streamUrl, setStreamUrl] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const params = useParams();
  const clearForm = () => {
    setInfractionType('');
  }

  useEffect(() => {
    if (allInfractionTypes === null) {
      axios.get('/api/infraction_types/').then((res) => {
        setAllInfractionTypes(res.data);
      });
    }
    if (trainingModels === null) {
      axios.get(`/api/devices/${params.deviceId}/infraction_types/`).then((res) => {
        setTrainingModels(res.data);
      });
    }
  }, [allInfractionTypes, trainingModels, params.deviceId])

  useEffect(() => {
    axios.get(`/api/devices/${params.deviceId}`).then((res) => {
      setStreamUrl(res.data.stream_url);
    });
  });

  const addInfractionType = () => {
      axios.post(`/api/devices/${params.deviceId}/infraction_types/`, {
        device: params.deviceId,
        infraction_type: infractionType,
        number_captures: numberCaptures,
        between_captures: betweenCaptures,
        stream_delay: streamDelay,
        
      }).then((res) => {
        clearForm();
        setIsSuccess(true);
        setInfractionType(res.data);
      }).catch(() => {
        setIsError(true);
      })
  } 

  // Used to wait for the fetches to load before rendering
  if (allInfractionTypes === null || trainingModels === null) { 
    return <Spinner />;
  }

  return (
    <div>
      <BackButton to={`/training/${params.deviceId}/view/`}/>
      <h1 className="fw-bold">
        Assign Infraction Type
      </h1>
      <Form className="mx-auto" style={{ maxWidth: '500px' }}>
        <Toast isOpen={isError} className="mb-3 w-100" >
          <ToastHeader toggle={() => setIsError(false)}>
            Could not assign infraction type
          </ToastHeader>
          <ToastBody>
            Please provide valid user data and try again.
          </ToastBody>
        </Toast>
        {
          infractionType && (
            <Toast isOpen={isSuccess} className="mb-3 w-100" >
              <ToastHeader toggle={() => setIsSuccess(false)}>
                Infraction Type Assigned Successfully
              </ToastHeader>
            </Toast>
          )
        }
        <FormGroup>
          <Label>Infraction Type</Label>
          <Input
            value={infractionType}
            onChange={(e) => setInfractionType(e.target.value.trim())}
            placeholder="Select an Infraction Type"
            type="select"
          >
            <option key={'selectAnInfractionType'} value="">Select an Infraction Type</option>
            {removeAssignedInfractions(trainingModels, allInfractionTypes).map((allInfractionTypes) => <option key={allInfractionTypes.id} value={allInfractionTypes.id}>{allInfractionTypes.infraction_type_name}</option>)}
          </Input>

        </FormGroup>
        <FormGroup>
        <Label>Number of Captures</Label>
          <Input
            value={numberCaptures}
            onChange={(e) => setNumberCaptures(e.target.value.trim())}
            placeholder="Enter the number of captures"
            type="number"
            min="0"
          />
        </FormGroup>
        <FormGroup>
        <Label>Time Between Captures (ms)</Label>
          <Input
            value={betweenCaptures}
            onChange={(e) => setBetweenCaptures(e.target.value.trim())}
            placeholder="Enter the number of captures"
            type="number"
            min="0"
          />
        </FormGroup>
        <FormGroup>
        <Label>Stream Delay (s)</Label>
          <Input
            value={streamDelay}
            onChange={(e) => setStreamDelay(e.target.value.trim())}
            placeholder="Enter the estimated delay on the video feed"
            type="number"
            min="0"
          />
        </FormGroup>
        <LiveFeed url={streamUrl} />
        <Button className="w-100" color="primary" onClick={addInfractionType}>
          Assign Infraction Type
        </Button>
      </Form>
    </div>
  );
}
