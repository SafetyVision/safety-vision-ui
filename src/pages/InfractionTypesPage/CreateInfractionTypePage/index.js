import { Form, FormGroup, Label, Input, Button, Toast, ToastHeader, ToastBody } from 'reactstrap';
import { useState, useEffect } from 'react';
import axios from 'util/axiosConfig';
import BackButton from 'components/BackButton';
import LiveFeed from 'components/LiveFeed';
import { useParams } from 'react-router-dom';

export default function CreateInfractionTypePage() {
  const [infractionName, setInfractionName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [streamUrl, setStreamUrl] = useState('');
  const [devices, setDevices] = useState(null);
  const params = useParams();

  const clearForm = () => {
    setInfractionName('');
  };

  useEffect(() => {
    axios.get('/api/devices').then((res) => {
      setDevices(res.data);
    });
  }, [])

  const createInfractionType = () => {
    axios.post('/api/infraction_types/create', {
      infraction_type_name: infractionName.trim(),
      device: params.deviceId,
    }).then(() => {
      clearForm();
      axios.get(`/api/devices/${params.deviceId}`).then((res) => {
        setStreamUrl(res.data.stream_url);
        setIsSuccess(true);
      });
    });
  };

  return (
    <div>
      <BackButton to={`/device-manager/${params.deviceId}/edit`} />
      <h1 className="fw-bold">
        {`Create Infraction Type For Device #${params.deviceId}`}
      </h1>
      <Form className="mx-auto" style={{ maxWidth: '500px' }}>
        {
          <Toast isOpen={isSuccess} className="mb-3 w-100" >
            <ToastHeader toggle={() => setIsSuccess(false)}>
              Infraction Type Added Successfully
            </ToastHeader>
            <ToastBody>
              Demonstrate to your device an infraction occuring.
            </ToastBody>
          </Toast>
        }
        {
          !isSuccess && devices ? (
            <div>
              <FormGroup>
                <Label>Infraction Name</Label>
                <Input
                  value={infractionName}
                  onChange={(e) => setInfractionName(e.target.value)}
                  placeholder="Infraction Name"
                />
              </FormGroup>
              <Button className="w-100" color="primary" onClick={createInfractionType}>
                Create Infraction Type
              </Button>
            </div>
          ) : (
            <LiveFeed url={streamUrl} />
          )
        }
      </Form>
    </div>
  );
}
