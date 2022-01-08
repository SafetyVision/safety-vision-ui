import { useEffect, useState } from 'react';
import axios from 'util/axiosConfig';
import DashboardPage from 'pages/DashboardPage';
import getCookie from 'util/cookies';
import HomePage from 'pages/HomePage';
import LoginPage from 'pages/LoginPage';
import NavBar from 'components/NavBar';
import SignUpPage from 'pages/SignUpPage';
import RequireAuth from 'components/RequireAuth';
import { Routes, Route } from 'react-router-dom';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isExistingUser = getCookie('sessionid') === null;
  const authInfo = {
    isAuthenticated,
    isExistingUser,
  };

  useEffect(() => {
    axios.get('api/set-csrf/');
    axios.get('/api/test-auth/').then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false));
  }, []);

  return (
    <div>
      <div>
        <NavBar authInfo={authInfo} />
      </div>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <RequireAuth authInfo={authInfo}>
                  <DashboardPage />
                </RequireAuth>
              ) : <HomePage authInfo={authInfo} />
            }
          />
          <Route path="login" element={<LoginPage authInfo={authInfo} setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="signup" element={<SignUpPage authInfo={authInfo} />} />
        </Routes>
    </div>
  );
}