import { useState, useEffect } from 'react';
import { Spinner, Button, Row, Col } from 'reactstrap';
import axios from 'util/axiosConfig';
import { useParams, useNavigate, Link } from 'react-router-dom';
import BackButton from 'components/BackButton';
import ConfirmationModal from 'components/ConfirmationModal';

export default function ViewUserPage({ authInfo }) {
  const [user, setUser] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  const toggleConfirmDeleteModal = () => setIsConfirmDeleteOpen(!isConfirmDeleteOpen);

  const deleteUser = () => {
    axios.delete(`/api/users/${params.userId}`).then(() => {
      navigate(`/account/users`, { replace: true });
    });
  }

  useEffect(() => {
    axios.get(`/api/users/${params.userId}`).then((res) => {
      setUser(res.data);
    }).catch(() => {
      setIsError(false);
    })
  }, [params.userId])

  if (isError) {
    <h1>Could not get this user's data</h1>
  }

  if (!user) {
    return <Spinner />
  }

  return (
    <div>
      <ConfirmationModal
        isOpen={isConfirmDeleteOpen}
        toggle={toggleConfirmDeleteModal}
        confirmAction={deleteUser}
        bodyContent="Deleting this user cannot be undone."
      />
      <BackButton to="/account/users" />
      <Row className="d-flex justify-content-between align-items-center pb-4">
        <Col>
          <h1 className="fw-bold">View User</h1>
        </Col>
        <Col className="d-flex justify-content-end">
          {
            (authInfo.currentUser.isOwner && authInfo.currentUser.id !== user.id) && (
              <Button color="danger" onClick={() => setIsConfirmDeleteOpen(true)} className="mx-2" >
                Delete User
              </Button>
            )
          }
          {
            (authInfo.currentUser.isOwner || authInfo.currentUser.id === user.id) && (
              <Button className="mx-1" tag={Link} to={`/account/users/${user.id}/edit`}>
                Edit User
              </Button>
            )
          }
        </Col>
      </Row>
      <div style={{ maxWidth: '500px' }} className="border rounded mx-auto p-3">
        <label className="fw-bold pt-3">
          First Name
        </label>
        <p>
          {user.first_name}
        </p>
        <label className="fw-bold">
          Last Name
        </label>
        <p>
          {user.last_name}
        </p>
        <label className="fw-bold">
          Email
        </label>
        <p>
          {user.email}
        </p>
      </div>
    </div>
 );
}
