import { Fragment, useEffect, useState } from 'react';
import axios from 'util/axiosConfig';
import { useParams, Link } from 'react-router-dom';
import { Spinner } from 'reactstrap';
import BackButton from 'components/BackButton';
import formatTimestamp from 'util/dates';
import ResourceNotFoundPage from 'pages/ErrorPages/ResourceNotFoundPage';

export default function ViewInfractionEvent() {
  const params = useParams();
  const [infractionEvent, setInfractionEvent] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    axios.get(`/api/infraction_events/${params.infractionEventId}`).then((res) => {
      setInfractionEvent(res.data);
      setIsLoaded(true);
      setIsError(false);
    }).catch(() => {
      setIsError(true);
    });
  }, [params.infractionEventId]);

  if (isError) {
    return <ResourceNotFoundPage />;
  }

  if (!isLoaded) {
    return <Spinner />;
  }

  return (
    <div>
      <BackButton to="/infraction-events" />
      <h1 className="mb-2">
        Infraction Event #{params.infractionEventId}
      </h1>
      {
        infractionEvent ? (
          <Fragment>
            <label className="fw-bold pt-3">
              Infraction Time
            </label>
            <p className="mb-0">
              {formatTimestamp(infractionEvent.infraction_date_time)}
            </p>
            <label className="fw-bold pt-3">
              Location
            </label>
            <Link to={`/locations/${infractionEvent.infraction_type.id}/view`} className="d-block text-decoration-none">
              {infractionEvent.infraction_type.infraction_type_name}
            </Link>
            <label className="fw-bold pt-3">
              Infraction Type
            </label>
            <Link to={`/infraction-types/${infractionEvent.location.id}/view`} className="d-block text-decoration-none mb-5">
              {infractionEvent.location.description}
            </Link>
            {
              infractionEvent.infraction_video.file && (
                <div className="w-100 d-flex justify-content-center">
                  <video controls key={infractionEvent.id} className="w-100" style={{ maxWidth: '1000px' }}>
                    <source src={infractionEvent.infraction_video.file} type="video/mp4" />
                  </video>
                </div>
              )
            }
          </Fragment>
        ) : (
          <p>Something went wrong.</p>
        )
      }
    </div>
  );
}
