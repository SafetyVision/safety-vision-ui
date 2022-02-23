import { useEffect, useState } from 'react';
import axios from 'util/axiosConfig';
import { Spinner, Table, Button } from 'reactstrap';
import { Link } from 'react-router-dom';

export default function ListUsersPage({ authInfo }) {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    if (authInfo.currentUser && users === null) {
      axios.get('/api/users/').then((res) => {
        setUsers(res.data);
      });
    }
  }, [authInfo.currentUser, users]);

  const mapUserToTableRow = (user) => (
    <tr key={user.id}>
      <td className="align-middle">
        {user.id === authInfo.currentUser.id ? `${user.first_name} (You)` : user.first_name}
      </td>
      <td className="align-middle">
        {user.last_name}
      </td>
      <td className="align-middle">
        {user.email}
      </td>
      <td className="text-end align-middle">
        <Button className="w-100" color="primary" tag={Link} to={`/account/users/${user.id}/view`}>
          View
        </Button>
      </td>
    </tr>
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center pb-4">
        <h1 className="fw-bold">User Management</h1>
        {
          authInfo.currentUser.isOwner && (
            <Button tag={Link} to="/account/users/add" color="primary" className="h" >
              Add User
            </Button>
          )
        }
      </div>
      {
        users ? (
          <Table striped borderless responsive>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th />
              </tr>
            </thead>
            <tbody className="border-top border-bottom">
              {users.map(mapUserToTableRow)}
            </tbody>
          </Table>
        ) : (
          <Spinner />
        )
      }
    </div>
  );
}
