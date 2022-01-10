import { Button, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'util/axiosConfig';

export default function UserAndAccountManagementPage({ authInfo, setIsAuthenticated }) {
  const deleteAccount = () => {
    axios.delete(`/api/accounts/${authInfo.currentUser.account}`).then(() => {
      setIsAuthenticated(false);
    });
  };

  return (
    <div>
      <h1 className="pb-3">
        User and Account Management
      </h1>
      <Row>
        <Button tag={Link} to="/account/view" color="primary" className="mx-auto my-2" style={{ maxWidth: '500px' }}>
          View Account Details
        </Button>
      </Row>
      <Row>
        <Button tag={Link} to="/account/edit" color="primary" className="mx-auto my-2" style={{ maxWidth: '500px' }}>
          Edit Account Details
        </Button>
      </Row>
      <Row>
        <Button tag={Link} to="/account/users" color="primary" className="mx-auto my-2" style={{ maxWidth: '500px' }}>
          View Users on Account
        </Button>

      </Row>
      <Row>
        <Button tag={Link} to="/account/users/add" color="primary" className="mx-auto my-2" style={{ maxWidth: '500px' }}>
          Add User to Account
        </Button>
      </Row>
      <Row>
        <Button onClick={deleteAccount} color="danger" className="mx-auto my-2" style={{ maxWidth: '500px' }}>
          Delete Account
        </Button>
      </Row>
    </div>
  );
}
