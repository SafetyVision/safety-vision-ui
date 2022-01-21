import { Form, FormGroup, Label, Input, Button, Toast, ToastHeader, ToastBody } from 'reactstrap';
import { useState } from 'react';
import axios from 'util/axiosConfig';
import { Link } from 'react-router-dom';
import BackButton from 'components/BackButton';

export default function AddDevicePage() {
    const [location, setLocation] = useState('');
    const [streamName, setStreamName] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [device, setDevice] = useState(null);

    const clearForm = () => {
        setLocation('');
        setStreamName('');
    }

    const addDevice = () => {
        axios.post('/api/devices/create', {
            location: location,
            stream_name: streamName,
        }).then((res) => {
            clearForm();
            setIsSuccess(true);
            setIsError(false);
            setDevice(res.data);
        }).catch(() => {
            setIsError(true);
        })

    };

    return (
        <div>
            <BackButton to="/devicemanager" />
            <h1 className="fw-bold">
                Add Device
            </h1>
            <Form className="mx-auto" style={{ maxWidth: '500px' }}>
                <Toast isOpen={isError} className="mb-3 w-100" >
                <ToastHeader toggle={() => setIsError(false)}>
                    Could Not Add Device
                </ToastHeader>
                <ToastBody>
                    Please provide valid device data and try again.
                </ToastBody>
                </Toast>
                {
                    device && (
                        <Toast isOpen={isSuccess} className="mb-3 w-100" >
                        <ToastHeader toggle={() => setIsSuccess(false)}>
                            Device Added Successfully
                        </ToastHeader>
                        <ToastBody>
                            View your new device located in, {device.location}, &nbsp;
                            <Link to={`/devicemanager`}>here</Link>
                            .
                        </ToastBody>
                        </Toast>
                    )
                }
                <FormGroup>
                <Label>Location</Label>
                <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value.trim())}
                    placeholder="Location"
                />
                </FormGroup>
                <FormGroup>
                <Label>Stream Name</Label>
                <Input
                    value={streamName}
                    onChange={(e) => setStreamName(e.target.value.trim())}
                    placeholder="Stream name"
                />
                </FormGroup>
                <Button className="w-100" color="primary" onClick={addDevice}>
                    Add Device
                </Button>
            </Form>
        </div>
    );
}
