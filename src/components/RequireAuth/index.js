import { Navigate, useLocation } from 'react-router-dom';

export default function RequireAuth({authInfo, children}) {
  const location = useLocation();
  const from = location?.state?.from?.pathname;

  if (from) {
    return <Navigate to={from} state={{ from: null }} replace />
  }

  if (!authInfo.currentUser && authInfo.isExistingUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!authInfo.currentUser) {
    return <Navigate to="/" />;
  }

  return children;
}
