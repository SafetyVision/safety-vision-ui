import { Navigate } from 'react-router-dom';

export default function SignUpPage({ authInfo }) {
  if (authInfo.isAuthenticated || !authInfo.isExistingUser) {
    return <Navigate to="/" />;
  }

  return <p>SignUp Page</p>;
}
