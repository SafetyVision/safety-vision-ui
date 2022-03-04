import { Form, FormGroup, Label, Input, Button, Toast, ToastHeader, ToastBody } from 'reactstrap';
import { useState } from 'react';
import axios from 'util/axiosConfig';
import { Link } from 'react-router-dom';
import BackButton from 'components/BackButton';

export default function AddLocationPage() {
    const [description, setDescription] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [location, setLocation] = useState(null);

    const clearForm = () => {
        setDescription('');
    }

    const addLocation = () => {
        axios.post('/api/locations/', {
            description: description.trim(),
        }).then((res) => {
            clearForm();
            setIsSuccess(true);
            setIsError(false);
            setLocation(res.data);
        }).catch(() => {
            setIsError(true);
        })
    };

    return (
    <div>
        <BackButton to="/location-manager" />
        <h1 className="fw-bold">
            Add Location
        </h1>
        <Form className="mx-auto" style={{ maxWidth: '500px' }}>
            <Toast isOpen={isError} className="mb-3 w-100" >
            <ToastHeader toggle={() => setIsError(false)}>
                Could Not Add Location
            </ToastHeader>
            <ToastBody>
                Check if location description already exists.
            </ToastBody>
            </Toast>
            {
                location && (
                    <Toast isOpen={isSuccess} className="mb-3 w-100" >
                    <ToastHeader toggle={() => setIsSuccess(false)}>
                        Location Added Successfully
                    </ToastHeader>
                    <ToastBody>
                        View your new location, {location.description}, &nbsp;
                        <Link to={`/location-manager`}>here</Link>
                        .
                    </ToastBody>
                    </Toast>
                )
            }
            <FormGroup>
                <Label>Location Description</Label>
                <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Location Description"
                />
            </FormGroup>
            <Button className="w-100" color="primary" onClick={addLocation}>
                Add Location
            </Button>
        </Form>
    </div>
    );
}
