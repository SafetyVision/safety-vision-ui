import { useState, useEffect } from 'react';
import { Spinner } from 'reactstrap';
import axios from 'util/axiosConfig';
import { useParams } from 'react-router-dom';
import BackButton from 'components/BackButton';

export default function ViewUserPage() {
  const [user, setUser] = useState(null);
  const [isError, setIsError] = useState(false);
  const params = useParams();

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
    <BackButton to="/account/users" />
    <h1 className="fw-bold">
      View User
    </h1>
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
