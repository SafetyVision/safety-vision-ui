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
        <div style={{ maxWidth: '500px' }} className="border rounded mx-auto p-3">
          <label className="fw-bold pt-3">
            Company/Organization Name
          </label>
          <p>
            {accountData.account_name}
          </p>
        </div>
      </div>
    );
  }

  return <Spinner />
}
