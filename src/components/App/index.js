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
import { Container, Spinner } from 'reactstrap';

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isExistingUser = getCookie('sessionid') !== null;
  const authInfo = {
    isAuthenticated,
    isExistingUser,
  };

  useEffect(() => {
    axios.get('api/set-csrf/');
    axios.get('/api/test-auth/').then(() => {
      setIsAuthenticated(true);
      setIsLoaded(true);
    })
    .catch(() => {
      setIsAuthenticated(false);
      setIsLoaded(true);
    });
  }, []);

  if (!isLoaded) {
    return <Spinner />
  }

  return (
    <div>
      <div>
        <NavBar
          authInfo={authInfo}
          setIsAuthenticated={setIsAuthenticated}
        />
      </div>
      <Container className="pt-5 h-100 px-4">
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
          <Route path="login" element={
              <LoginPage
                authInfo={authInfo}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route path="signup" element={<SignUpPage setIsAuthenticated={setIsAuthenticated}/>} />
        </Routes>
      </Container>
    </div>
  );
}
