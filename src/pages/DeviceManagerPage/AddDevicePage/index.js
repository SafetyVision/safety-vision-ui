import { Form, FormGroup, Label, Input, Button, Toast, ToastHeader, ToastBody } from 'reactstrap';
import { useState } from 'react';
import axios from 'util/axiosConfig';
import { Link } from 'react-router-dom';
import BackButton from 'components/BackButton';

export default function AddDevicePage() {
    const [serial_number, setSerialNumber] = useState('');
    const [location, setLocation] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [device, setDevice] = useState(null);

    const clearForm = () => {
        setLocation('');
        setSerialNumber('');
    }

    const addDevice = () => {
        axios.post('/api/devices/create', {
            serial_number: serial_number,
            location: location.trim(),
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
            <BackButton to="/device-manager" />
            <h1 className="fw-bold">
                Add Device
            </h1>
            <Form className="mx-auto" style={{ maxWidth: '500px' }}>
                <Toast isOpen={isError} className="mb-3 w-100" >
                <ToastHeader toggle={() => setIsError(false)}>
                    Could Not Add Device
                </ToastHeader>
                <ToastBody>
                    Check if the serial number is correct and if the device is streaming properly.
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
                            <Link to={`/device-manager`}>here</Link>
                            .
                        </ToastBody>
                        </Toast>
                    )
                }
                <FormGroup>
                <Label>Serial Number</Label>
                <Input
                    value={serial_number}
                    onChange={(e) => setSerialNumber(e.target.value.replace(/\s/g,''))}
                    placeholder="Serial Number"
                />
                </FormGroup>
                <FormGroup>
                <Label>Location</Label>
                <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Location"
                />
                </FormGroup>
                <Button className="w-100" color="primary" onClick={addDevice}>
                    Add Device
                </Button>
            </Form>
        </div>
    );
}
