import axios from 'util/axiosConfig';
import { useEffect, useState } from 'react';
import { Button, Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';
import ConfirmationModal from 'components/ConfirmationModal';


export default function ViewAccountPage({ authInfo, setIsAuthenticated }) {
  const [accountData, setAccountData] = useState(null);
  const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  useEffect(() => {
    if (authInfo.currentUser) {
      axios.get(`/api/accounts/${authInfo.currentUser.account}`).then((res) => {
        setAccountData(res.data);
      });
    }
  }, [authInfo.currentUser]);

  const deleteAccount = () => {
    axios.delete(`/api/accounts/${authInfo.currentUser.account}`).then(() => {
      setIsAuthenticated(false);
    });
  };

  const toggleConfirmDeleteModal = () => setConfirmDeleteOpen(!isConfirmDeleteOpen);

  if (accountData) {
    return (
      <div>
        <ConfirmationModal
          isOpen={isConfirmDeleteOpen}
          toggle={toggleConfirmDeleteModal}
          bodyContent="Deleting this account will delete all data associated with this account. This cannot be undone."
          confirmAction={deleteAccount}
        />
        <div className="d-flex pb-4 justify-content-between align-items-center flex-wrap flex-row">
          <h1 className="fw-bold">Your Account</h1>
          {
            authInfo.currentUser.isOwner && (
              <div className="d-flex justify-content-end align-items-center">
                <Button tag={Link} to="/account/edit" className="m-2">
                  Edit Account
                </Button>
                <Button color="danger" onClick={() => setConfirmDeleteOpen(true)}>
                  Delete Account
                </Button>
              </div>
            )
          }
        </div>
        <div style={{ maxWidth: '500px' }} className="border rounded mx-auto p-3">
          <label className="fw-bold pt-3">
            Company/Organization Name
          </label>
          <p>
            {accountData.account_name}
          </p>
          <label className="fw-bold pt-3">
            Owner
          </label>
          <Link to={`/account/users/${accountData.owner.id}/view`} className="d-block text-decoration-none">
            {`${accountData.owner.first_name} ${accountData.owner.last_name}`}
          </Link>
        </div>
      </div>
    );
  }

  return <Spinner />
}
