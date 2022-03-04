import { useEffect, useState, useRef } from 'react';
import axios from 'util/axiosConfig';
import { useParams } from 'react-router-dom';
import { Spinner, Button, Alert } from 'reactstrap';
import BackButton from 'components/BackButton';
import LiveFeed from 'components/LiveFeed';
import { TrainingStates } from '../helper';

export default function TrainInfractionsPage() {
    const [trainingModel, setTrainingModel] = useState(null);
    const [infraction, setInfraction] = useState(null);
    const [streamUrl, setStreamUrl] = useState('');
    const [isWaiting, setIsWaiting] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const params = useParams();
    const sseConnection = useRef(null);

    const refreshTrainingModel = () => {
      axios.get(`/api/devices/${params.deviceId}/infraction_types/${params.infractionId}`).then((res) => {
        setTrainingModel(res.data);
        if (res.data.training_state === "done_not_committing_2" || res.data.training_state === "trained") {
          setIsComplete(true);
        }
      });
    }

    useEffect(() => {
      if (trainingModel === null) {
        axios.get(`/api/devices/${params.deviceId}/infraction_types/${params.infractionId}`).then((res) => {
          setTrainingModel(res.data);
          if (res.data.training_state === "done_not_committing_2" || res.data.training_state === "trained") {
            setIsComplete(true);
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
        setStreamUrl(res.data.stream_url);
      });
    });

    useEffect(() => {
      if (!sseConnection.current){
        const sseConnectionEndpoint =`/api/events/?channel=${params.deviceId}_${params.infractionId}_training_events`;
        sseConnection.current = new EventSource(sseConnectionEndpoint);
        sseConnection.current.onmessage = () => {
          refreshTrainingModel(null);
          setIsWaiting(false);
        }
      }
      return function cleanup() {
        sseConnection.current.close();
        sseConnection.current = null;
      }
    });

    const startTraining = () => {
      let nextState = "";
      if (trainingModel.training_state === "init" || trainingModel.training_state === "done_not_committing_1") {
        nextState = "start_commit";
      } else if (trainingModel.training_state === "done_committing_1" || trainingModel.training_state === "done_committing_2") {
        nextState = "start_not_commit";
      }
      axios.post(`/api/devices/${params.deviceId}/infraction_types/${params.infractionId}/${nextState}`, {
      }).then(() => {
        refreshTrainingModel();
        setIsWaiting(true);
      })
    }

    // Used to wait for the fetches to load before rendering
    if (!trainingModel || !infraction) {
      return <Spinner />;
    }

    return (
      <div>
        <BackButton to={`/training/${params.deviceId}/view`} />
        <div className="d-flex justify-content-between align-items-center pb-4">
          <h1 className="fw-bold">{`Training: ${infraction.infraction_type_name}`}</h1>
        </div>
        <div>
        <Alert className="w-100" color={!isWaiting ? 'success' : 'warning'}>
            {TrainingStates[trainingModel.training_state]}
        </Alert>
        <LiveFeed url={streamUrl} />
        </div>
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
    );
}
