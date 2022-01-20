import { Fragment, useEffect, useState } from 'react';
import axios from 'util/axiosConfig';
import { useParams } from 'react-router-dom';
import { Spinner } from 'reactstrap';
import BackButton from 'components/BackButton';
import formatTimestamp from 'util/dates';

export default function ViewInfractionEvent() {
  const params = useParams();
  const [infractionEvent, setInfractionEvent] = useState(null);

  useEffect(() => {
    axios.get(`/api/infraction_events/${params.infractionEventId}`).then((res) => {
      setInfractionEvent(res.data);
    });
  }, [params.infractionEventId]);

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
            <p>
              {formatTimestamp(infractionEvent.infraction_date_time)}
            </p>
            <div className="w-100 d-flex justify-content-center">
              <video controls key={infractionEvent.id} className="w-100" style={{ maxWidth: '1000px' }}>
                <source src={infractionEvent.infraction_video.file} type="video/mp4" />
              </video>
            </div>
          </Fragment>
        ) : (
          <Spinner />
        )
      }
    </div>
  );
}
