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

  const deleteUser = (id) => {
    axios.delete(`/api/users/${id}`).then(() => {
      setUsers(null);
    });
  }

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
      <td className="text-end">
        <Button className="w-100" color="primary" tag={Link} to={`/account/users/${user.id}/view`}>
          View
        </Button>
      </td>
      <td className="text-end">
        <Button className="mx-1 w-100" tag={Link} to={`/account/users/${user.id}/edit`}>
          Edit
        </Button>
      </td>
      <td className="text-end">
        {
          user.id !== authInfo.currentUser.id ? (
            <Button color="danger" onClick={() => deleteUser(user.id)} className="w-100">
              Delete
            </Button>
          ) : null
        }
      </td>
    </tr>
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="fw-bold pb-4">Users List</h1>
        <Button tag={Link} to="/account/users/add" color="primary" className="h" >
          Add User
        </Button>
      </div>
      {
        users ? (
          <Table striped borderless responsive>
            <thead>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th />
              <th />
              <th />
            </thead>
            <tbody>
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
