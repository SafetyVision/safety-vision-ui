import { Navigate } from 'react-router-dom';

export default function LoginPage({ authInfo }) {
  if (authInfo.isAuthenticated || !authInfo.isExistingUser) {
    return <Navigate to="/" />;
  }

  return <p>Login Page</p>;
}
