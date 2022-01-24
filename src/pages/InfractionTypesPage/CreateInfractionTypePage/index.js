import { Form, FormGroup, Label, Input, Button, Toast, ToastHeader, ToastBody } from 'reactstrap';
import { useState } from 'react';
import axios from 'util/axiosConfig';
import BackButton from 'components/BackButton';
import LiveFeed from 'components/LiveFeed';

export default function CreateInfractionTypePage() {
  const [infractionName, setInfractionName] = useState('');
  // const [deviceId, setDeviceId] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [streamUrl, setStreamUrl] = useState('');

  const clearForm = () => {
    setInfractionName('');
    // setDeviceId('');
  }

  const createInfractionType = () => {
    axios.post('/api/infraction_types/create', {
      infraction_type_name: infractionName.trim(),
      device: 1,
    }).then(() => {
      clearForm();
      axios.get('/api/devices/1').then((res) => {
        setStreamUrl(res.data.stream_url);
        setIsSuccess(true);
      })
    });
  };

  return (
    <div>
      <BackButton to="/infractionTypes" />
      <h1 className="fw-bold">
        Create Infraction Type
      </h1>
      <Form className="mx-auto" style={{ maxWidth: '500px' }}>
        {/* <Toast isOpen={isError} className="mb-3 w-100" >
          <ToastHeader toggle={() => setIsError(false)}>
            Failed to Create Infraction Type
          </ToastHeader>
          <ToastBody>
            Please provide valid data and try again.
          </ToastBody>
        </Toast> */}
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
          !isSuccess ? (
            <div>
              <FormGroup>
                <Label>Infraction Name</Label>
                <Input
                  value={infractionName}
                  onChange={(e) => setInfractionName(e.target.value)}
                  placeholder="Infraction Name"
                />
              </FormGroup>
              <FormGroup>
                <Label>Device</Label>
                <Input
                  type="select"
                >
                  <option>
                    Select a device
                  </option>
                  <option>
                    My New Device
                  </option>
                </Input>
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
