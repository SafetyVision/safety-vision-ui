import axios from 'util/axiosConfig';
import { useEffect, useState } from 'react';
import { Spinner } from 'reactstrap';

export default function ViewAccountPage({ authInfo }) {
  const [accountData, setAccountData] = useState(null);

  useEffect(() => {
    if (authInfo.currentUser) {
      axios.get(`/api/accounts/${authInfo.currentUser.account}`).then((res) => {
        setAccountData(res.data);
      });
    }
  }, [authInfo.currentUser]);

  if (accountData) {
    return (
      <div>
        <h1 className="fw-bold pb-4">Your Account</h1>
        <h2 className="fw-bold">Company/Organization Name:</h2>
        <h3>{accountData.account_name}</h3>
      </div>
    );
  }

  return <Spinner />
}
