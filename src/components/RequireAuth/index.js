import { Navigate, useLocation } from 'react-router-dom';

export default function RequireAuth({authInfo, children}) {
  const location = useLocation();

  if (!authInfo.isAuthenticated && authInfo.isExistingUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!authInfo.isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
}
