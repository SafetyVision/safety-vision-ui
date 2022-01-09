import { Button, Row } from 'reactstrap';
import { Link } from 'react-router-dom';

export default function UserAndAccountManagementPage() {
  return (
    <div>
      <h1 className="pb-3">
        User and Account Management
      </h1>
      <Row>
        <Button tag={Link} to="/account/view" color="primary" className="my-3">
          View Account Details
        </Button>

      </Row>
      <Row>
        <Button tag={Link} to="/account/edit" color="primary" className="my-3">
          Edit Account Details
        </Button>
      </Row>
      <Row>
        <Button tag={Link} to="/account/users" color="primary" className="my-3">
          View Users on Account
        </Button>

      </Row>
      <Row>
        <Button tag={Link} to="/account/users/add" color="primary" className="my-3">
          Add User to Account
        </Button>
      </Row>
      <Row>
        <Button onClick={() => {}} color="danger" className="my-3">
          Delete Account
        </Button>
      </Row>
    </div>
  );
}
