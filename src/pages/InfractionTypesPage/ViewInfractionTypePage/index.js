import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Spinner, Row, Col, Button } from 'reactstrap';
import axios from 'util/axiosConfig';
import ResourceNotFoundPage from 'pages/ErrorPages/ResourceNotFoundPage';
import ConfirmationModal from 'components/ConfirmationModal';
import BackButton from 'components/BackButton';

export default function ViewInfractionEventPage() {
  const [infractionType, setInfractionType] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  const toggleConfirmDeleteModal = () => setIsConfirmDeleteOpen(!isConfirmDeleteOpen);

  const deleteInfractionType = () => {
    axios.delete(`/api/infraction_types/${params.infractionTypeId}`).then(() => {
      navigate(`/infraction-types`, { replace: true });
    });
  }

  useEffect(() => {
    axios.get(`/api/infraction_types/${params.infractionTypeId}`).then((res) => {
      setInfractionType(res.data);
    }).catch(() => {
      setIsError(false);
    })
  }, [params.infractionTypeId])

  if (isError) {
    return <ResourceNotFoundPage />;
  }

  if (!infractionType) {
    return <Spinner />;
  }

  return (
    <div>
      <ConfirmationModal
        isOpen={isConfirmDeleteOpen}
        toggle={toggleConfirmDeleteModal}
        confirmAction={deleteInfractionType}
        bodyContent={
          `Deleting this infraction type will delete all infraction events associated
           with it. All devices currently previously trained for this infraction type will no
           longer create infraction events for this type of infraction. This action cannot be undone.`
        }
      />
      <BackButton to="/infraction-types" />
      <Row className="d-flex justify-content-between align-items-center pb-4">
        <Col>
          <h1 className="fw-bold">View Infraction Type</h1>
        </Col>
        <Col className="d-flex justify-content-end">
          <Button color="danger" onClick={() => setIsConfirmDeleteOpen(true)} className="mx-2" >
            Delete Infraction Type
          </Button>
          <Button className="mx-1" tag={Link} to={`/infraction-types/${infractionType.id}/edit`}>
            Edit Infraction Type
          </Button>
        </Col>
      </Row>
      <div style={{ maxWidth: '500px' }} className="border rounded mx-auto p-3">
        <label className="fw-bold pt-3">
          Infraction Type Name
        </label>
        <p>
          {infractionType.infraction_type_name}
        </p>
      </div>
    </div>
  );
}
