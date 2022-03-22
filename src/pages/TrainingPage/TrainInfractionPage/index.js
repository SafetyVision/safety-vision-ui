import { useEffect, useState, useRef } from 'react';
import axios from 'util/axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';
import { Spinner, Button, Alert } from 'reactstrap';
import BackButton from 'components/BackButton';
import LiveFeed from 'components/LiveFeed';
import { TrainingStatesVerbose, WaitingTrainingStates } from '../helper';

export default function TrainInfractionsPage() {
  const [trainingModel, setTrainingModel] = useState(null);
  const [infraction, setInfraction] = useState(null);
  const [streamUrl, setStreamUrl] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const sseConnection = useRef(null);

  useEffect(() => {
    if (trainingModel === null) {
      axios.get(`/api/devices/${params.deviceId}/infraction_types/${params.infractionId}`).then((res) => {
        setTrainingModel(res.data);
        if (res.data.training_state === "done_not_committing_2" || res.data.training_state === "trained") {
          setIsComplete(true);
        }
        if (WaitingTrainingStates.includes(res.data.training_state)) {
          setIsWaiting(true);
        }
      });
    }
    if (infraction === null){
      axios.get(`/api/infraction_types/${params.infractionId}`).then((res) => {
        setInfraction(res.data);
      });
    }
  }, [trainingModel, infraction, params.deviceId, params.infractionId]);

  useEffect(() => {
    axios.get(`/api/devices/${params.deviceId}`).then((res) => {
      if (!res.data.stream_url) {
        navigate(`/training/${res.data.serial_number}/view`, { replace: true })
      }
      setStreamUrl(res.data.stream_url);
    });
  }, [params.deviceId, navigate]);

  useEffect(() => {
    if (!sseConnection.current){
      const sseConnectionEndpoint =`/api/events/?channel=${params.deviceId}_${params.infractionId}_training_events`;
      sseConnection.current = new EventSource(sseConnectionEndpoint);
      sseConnection.current.onmessage = () => {
        axios.get(`/api/devices/${params.deviceId}/infraction_types/${params.infractionId}`).then((res) => {
          setTrainingModel(res.data);
          if (res.data.training_state === "done_not_committing_2" || res.data.training_state === "trained") {
            setIsComplete(true);
          }
        });
        setIsWaiting(false);
      }
    }
    return function cleanup() {
      sseConnection.current.close();
      sseConnection.current = null;
    }
  }, [params.deviceId, params.infractionId]);

  const startTraining = () => {
    let nextState = "";
    if (trainingModel.training_state === "init" || trainingModel.training_state === "done_not_committing_1") {
      nextState = "start_commit";
    } else if (trainingModel.training_state === "done_committing_1" || trainingModel.training_state === "done_committing_2") {
      nextState = "start_not_commit";
    }
    axios.post(
      `/api/devices/${params.deviceId}/infraction_types/${params.infractionId}/${nextState}`,
      {}
    ).then(() => {
      axios.get(`/api/devices/${params.deviceId}/infraction_types/${params.infractionId}`).then((res) => {
        setTrainingModel(res.data);
        if (res.data.training_state === "done_not_committing_2" || res.data.training_state === "trained") {
          setIsComplete(true);
        }
      });
      setIsWaiting(true);
    })
  }

  // Used to wait for the fetches to load before rendering
  if (!trainingModel || !infraction || !streamUrl) {
    return <Spinner />;
  }

  return (
    <div>
      <BackButton to={`/training/${params.deviceId}/view`} />
      <div className="d-flex justify-content-between align-items-center pb-4">
        <h1 className="fw-bold">{`Training: ${infraction.infraction_type_name}`}</h1>
      </div>
      <div className="w-75 mx-auto">
        <Alert className="w-100" color={!isWaiting ? 'success' : 'warning'}>
            {TrainingStatesVerbose[trainingModel.training_state]}
        </Alert>
        <LiveFeed url={streamUrl} />
        {
          (
            trainingModel.training_state !== "done_not_committing_2" ||
            trainingModel.training_state !== "trained") && (
              <Button
                className="w-100"
                color="primary"
                onClick={startTraining}
                disabled={isWaiting || isComplete}
              >
                {
                  trainingModel.training_state === "init" ? (
                    "Start Training"
                  ) : (
                    trainingModel.training_state === "trained" ? "Model Trained" : "Continue Training"
                  )
                }
              </Button>
            )
        }
      </div>
    </div>
  );
}
